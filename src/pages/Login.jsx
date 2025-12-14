// AuthPage.jsx - Clean and Simple Modern Design (Responsive)
import React, { useReducer, useState, useContext } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import api from "../Api/AxiosInstance";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// REGISTRATION REDUCER
const registrationReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIRST_NAME":
      return { ...state, firstName: action.payload };
    case "SET_LAST_NAME":
      return { ...state, lastName: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.payload };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};

// INITIAL STATE
const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "user",
  cart: [],
  wishlist: [],
  order: [],
  shippingaddress: {},
};

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signup");
  const [regState, regDispatch] = useReducer(registrationReducer, initialState);
  const [regError, setRegError] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { loginuser, loginError } = useContext(AuthContext);
  const navigate = useNavigate();

  // Register User
  const registerUser = async (data) => {
    try {
      await api.post("/users", data);
      toast.success("Registration Successful! Redirecting to login...");
      regDispatch({ type: "RESET_FORM" });
      setActiveTab("signin");
    } catch (err) {
      setRegError(err.response?.data?.message || "Network error during registration.");
    }
  };

  // Handle Registration
  const handleRegistration = async (e) => {
    e.preventDefault();
    setRegError("");
    setIsLoading(true);

    if (regState.password !== regState.confirmPassword) {
      setRegError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const checkResponse = await api.get(`/users?email=${regState.email}`);
      if (checkResponse.data.length > 0) {
        setRegError("This email already exists! Please use another.");
        setIsLoading(false);
        return;
      } else {
        await registerUser(regState);
      }
    } catch {
      setRegError("Something went wrong while checking the email.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await loginuser(loginEmail, loginPassword);
    if (result.success) {
      if(result.redirectTo){
        navigate(result.redirectTo);
      }else{
        navigate("/")
      }
      toast.success(`Welcome back, ${result.user.firstName}!`);
      
      // Redirect to intended page or home
      if (result.redirectTo) {
        navigate(result.redirectTo);
      } else {
        navigate("/");
      }
    } else {
      toast.error("Login Failed. Please check your credentials.");
    }
    setIsLoading(false);
  };

  return (
    // ✅ Main container: Full screen height, subtle background
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Image/Marketing Section - Hidden on mobile, visible on tablet and up */}
      <div className="hidden md:flex lg:w-1/2 relative">
        <img
          src="https://i.pinimg.com/1200x/cd/54/54/cd5454f908667f54e2198aec9e3891a4.jpg"
          alt="Athletics background"
          className="w-full h-full object-cover"
        />

        {/* Optional overlay text */}
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6 lg:p-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3 lg:mb-4">
            Train Hard. <span className="text-red-500">Live Better</span>.
          </h1>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
            Access premium gear, workout plans, and a global fitness community.
          </p>
        </div>
      </div>

      {/* Mobile-only header image */}
      <div className="md:hidden relative h-48">
        <img
          src="https://i.pinimg.com/1200x/cd/54/54/cd5454f908667f54e2198aec9e3891a4.jpg"
          alt="Athletics background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center p-4">
          <h1 className="text-xl font-bold text-white text-center mb-2">
            Train Hard. <span className="text-red-400">Live Better</span>
          </h1>
          <p className="text-gray-200 text-xs text-center">
            Join our fitness community today
          </p>
        </div>
      </div>

      {/* Authentication Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl w-full max-w-md border border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-6 sm:mb-8">
            {activeTab === "signin" ? "Sign In to Your Account" : "Join the Community"}
          </h2>

          {/* Tab Switcher */}
          <div className="flex mb-6 sm:mb-8 bg-gray-100 p-1 rounded-full shadow-inner">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeTab === "signin"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeTab === "signup"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* LOGIN FORM */}
          {activeTab === "signin" && (
            <>
              {loginError && (
                <div className="text-red-600 text-xs sm:text-sm mb-4 text-center p-2 bg-red-50 rounded-lg border border-red-200">
                  {loginError}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg text-black px-4 py-3 text-sm sm:text-base focus:ring-red-500 focus:border-red-500 transition duration-150 placeholder-gray-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 text-black py-3 text-sm sm:text-base focus:ring-red-500 focus:border-red-500 transition duration-150 placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-red-700 transition duration-200 shadow-lg shadow-red-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            </>
          )}

          {/* REGISTRATION FORM */}
          {activeTab === "signup" && (
            <>
              {regError && (
                <div className="text-red-600 text-xs sm:text-sm mb-4 text-center p-2 bg-red-50 rounded-lg border border-red-200">
                  {regError}
                </div>
              )}
              <form onSubmit={handleRegistration} className="space-y-3 sm:space-y-4">
                <div className="flex flex-col xs:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={regState.firstName}
                    onChange={(e) =>
                      regDispatch({ type: "SET_FIRST_NAME", payload: e.target.value })
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-black text-sm sm:text-base focus:ring-red-500 focus:border-red-500 transition duration-150 placeholder-gray-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={regState.lastName}
                    onChange={(e) =>
                      regDispatch({ type: "SET_LAST_NAME", payload: e.target.value })
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-black text-sm sm:text-base focus:ring-red-500 focus:border-red-500 transition duration-150 placeholder-gray-500"
                    required
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email Address"
                  value={regState.email}
                  onChange={(e) =>
                    regDispatch({ type: "SET_EMAIL", payload: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black text-sm sm:text-base focus:ring-red-500 focus:border-red-500 transition duration-150 placeholder-gray-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Create Password"
                  value={regState.password}
                  onChange={(e) =>
                    regDispatch({ type: "SET_PASSWORD", payload: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black text-sm sm:text-base focus:ring-red-500 focus:border-red-500 transition duration-150 placeholder-gray-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={regState.confirmPassword}
                  onChange={(e) =>
                    regDispatch({ type: "CONFIRM_PASSWORD", payload: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black text-sm sm:text-base focus:ring-red-500 focus:border-red-500 transition duration-150 placeholder-gray-500"
                  required
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-gray-800 transition duration-200 shadow-lg shadow-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            </>
          )}

          {/* Social Login - Optional */}
          <div className="mt-6 sm:mt-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
             
            </div>
            
         
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;