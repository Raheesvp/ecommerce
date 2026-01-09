

import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import api, { setRefreshHandler } from "../Api/AxiosInstance";
import { authService } from "../Services/AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ FIX 1: Initialize user directly from localStorage so it doesn't start as null on refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;

  });

  useEffect(() => {
    setRefreshHandler(setIsRefreshing); // Link them here
  }, []);

  const [loading, setLoading] = useState(false);

  const [isRefreshing,setIsRefreshing] = useState(false);

  // ✅ FIX 2: Check if user exists. This is now a BOOLEAN, not a function.
  const isAuthenticated = !!user; 

  const loginuser = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post("/Auth/Login", {
        email: email.trim(),
        password: password.trim(),
      });

      if (response.data && response.data.data) {
        const userData = { ...response.data.data, email: email };

        localStorage.setItem("accessToken", userData.accessToken);
        localStorage.setItem("refreshToken", userData.refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        toast.success("Login Successful!");

        let redirectTo = "/";
        if (userData.role?.toLowerCase() === "admin") {
          redirectTo = "/admin/dashboard";
        }

        return { success: true, user: userData, redirectTo };
      } else {
        toast.error("Login failed.");
        return { success: false };
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = async() => {
    try{
      await authService.logout();
    }catch(err){
      console.warn("Server Logout Failed,(Clearnig the local data anyway")
    }finally{

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");

      setUser(null);
      toast.success("Logged Out Successfully");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginuser,
        logout,
        loading,
        isAuthenticated, 
        isRefreshing
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};