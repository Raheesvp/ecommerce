import React, { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../Api/AxiosInstance";
import { redirect } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  // LOGIN function
  const loginuser = async (loginEmail, loginPassword) => {
    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in both fields");
      return { success: false };
    }

    setLoading(true);
    setLoginError("");

  // ADMIN LOGIN LOGIC
  if (loginEmail === "rahees678@gmail.com" && loginPassword === "admin@123") {
    const adminUser = {
      firstName: "Admin",
      lastName: "User",
      email: loginEmail,
      role: "admin",
    };

    setUser(adminUser);
    localStorage.setItem("user",JSON.stringify(adminUser));

    return {success:true,user:adminUser,redirectTo:"/admin/dashboard"};
  }

    try {
      const response = await api.get("/users", {
        params: {
          email: loginEmail.trim(),
          password: loginPassword.trim(),
        },
      });


      if (response.data.length > 0) {
        const loggedUser = response.data[0];
        setUser(loggedUser);

        // FIX: Store the entire user object, not just the ID
        localStorage.setItem("user", JSON.stringify(loggedUser));
       
         return { success: true, user: loggedUser };
      }else{
        setLoginError("Invalid Email and Password");
        return {success:false};
      }
    }catch(error){
      console.error("Login Erorr:",error);
      setLoginError("Something went wrong");
      return{success:false}
    }finally{
      setLoading(false);
    }
  };

  // LOGIN ADMIN function - Fixed to store properly
  const loginAdmin = async (adminEmail, adminPassword) => {
    setLoading(true);
    try {
      const response = await api.get("/users", {
        params: {
          email: adminEmail,
          password: adminPassword,
          role: "admin",
        },
      });

      if (response.data.length > 0) {
        const adminUser = response.data[0];
        setUser(adminUser);
        localStorage.setItem("user", JSON.stringify(adminUser)); // Store full user object
        toast.success("Admin login successful!");
        return { success: true, user: adminUser };
      } else {
        toast.error("Invalid admin credentials");
        return { success: false };
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Admin login failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
  };

  // Function to update user data (for order history, profile updates, etc.)
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loginuser,
      loginAdmin,
      loginError,
      logout,
      loading,
      updateUser // Add updateUser function
    }}>
      {children}
    </AuthContext.Provider>
  );
};