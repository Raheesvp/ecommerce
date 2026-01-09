// AuthPage.jsx - Clean and Simple Modern Design (Responsive)
import React, { useReducer, useState, useContext } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import api from "../Api/AxiosInstance";
import { authService } from "../Services/AuthService"; // Import your auth service
import { AuthContext } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
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
};

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin"); // Options: "signin", "signup", "forgot"
  const [regState, regDispatch] = useReducer(registrationReducer, initialState);
  const [regError, setRegError] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [resetEmail, setResetEmail] = useState(""); // State for forgot password input
  const [isResetSent, setIsResetSent] = useState(false); // State for UI success feedback
  const [isLoading, setIsLoading] = useState(false);

  const { loginuser, loginError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Register User logic
  const registerUser = async (data) => {
    try {
      await api.post("/auth/register", data);
      toast.success("Registration Successful! Redirecting to login...");
      return { success: true };
    } catch (err) {
      console.error(err);
      if (err.response) {
        setRegError(
          err.response.data?.message ||
          err.response.data?.errors?.Email?.[0] ||
          err.response.data?.title ||
          "Registration failed due to invalid input"
        );
      } else {
        setRegError("Unable to reach server");
      }
      return { success: false };
    }
  };

  // Handle Registration Submit
  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (regState.password !== regState.confirmPassword) {
      setRegError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (regState.password.length < 6) {
      toast.error("Password Must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    const registrationData = {
      FirstName: regState.firstName.trim(),
      LastName: regState.lastName.trim(),
      Email: regState.email.trim(),
      Password: regState.password,
      ConfirmPassword: regState.confirmPassword,
    };

    const result = await registerUser(registrationData);
    if (result.success) {
      regDispatch({ type: "RESET_FORM" });
      setActiveTab("signin");
    }
    setIsLoading(false);
  };

  // Handle Login Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await loginuser(loginEmail, loginPassword);
    if (result?.success) {
      const from = location.state?.from?.pathname || "/";
      if (result.user.role === "Admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
    setIsLoading(false);
  };

  // NEW: Handle Forgot Password Submit
const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await authService.forgotPassword(resetEmail);
      
      // Check for success (adjusting for different API response structures)
      if (result.status === 200 || result.statusCode === 200 || result.success) {
        toast.success("OTP sent successfully to your email!");
        
        // REDIRECT to the ResetPasswordPage and pass the email as a parameter
        navigate(`/reset-password?email=${encodeURIComponent(resetEmail)}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process request. Check email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Left Image Section */}
      <div className="hidden md:flex lg:w-1/2 relative">
        <img
          src="https://i.pinimg.com/1200x/cd/54/54/cd5454f908667f54e2198aec9e3891a4.jpg"
          alt="Athletics background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6 lg:p-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3 lg:mb-4">
            Train Hard. <span className="text-red-500">Live Better</span>.
          </h1>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
            Access premium gear, workout plans, and a global fitness community.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-6 sm:mb-8">
            {activeTab === "signin" && "Sign In to Your Account"}
            {activeTab === "signup" && "Join the Community"}
            {activeTab === "forgot" && "Reset Password"}
          </h2>

          {/* Tab Switcher - Hidden in Forgot mode */}
          {activeTab !== "forgot" && (
            <div className="flex mb-6 sm:mb-8 bg-gray-100 p-1 rounded-full shadow-inner">
              <button
                onClick={() => setActiveTab("signin")}
                className={`flex-1 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
                  activeTab === "signin" ? "bg-red-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
                  activeTab === "signup" ? "bg-red-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* LOGIN VIEW */}
          {activeTab === "signin" && (
            <>
              {loginError && (
                <div className="text-red-600 text-xs sm:text-sm mb-4 text-center p-2 bg-red-50 rounded-lg border border-red-200">
                  {loginError}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                />
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setActiveTab("forgot")}
                    className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-lg disabled:opacity-70"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            </>
          )}

          {/* SIGNUP VIEW */}
          {activeTab === "signup" && (
            <>
              {regError && (
                <div className="text-red-600 text-xs sm:text-sm mb-4 text-center p-2 bg-red-50 rounded-lg border border-red-200">
                  {regError}
                </div>
              )}
              <form onSubmit={handleRegistration} className="space-y-3 sm:space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="First"
                    value={regState.firstName}
                    onChange={(e) => regDispatch({ type: "SET_FIRST_NAME", payload: e.target.value })}
                    className="w-1/2 border border-gray-300 rounded-lg px-4 py-3 focus:ring-red-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last"
                    value={regState.lastName}
                    onChange={(e) => regDispatch({ type: "SET_LAST_NAME", payload: e.target.value })}
                    className="w-1/2 border border-gray-300 rounded-lg px-4 py-3 focus:ring-red-500"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={regState.email}
                  onChange={(e) => regDispatch({ type: "SET_EMAIL", payload: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-red-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Create Password"
                  value={regState.password}
                  onChange={(e) => regDispatch({ type: "SET_PASSWORD", payload: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-red-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={regState.confirmPassword}
                  onChange={(e) => regDispatch({ type: "CONFIRM_PASSWORD", payload: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-red-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg disabled:opacity-70"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            </>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {activeTab === "forgot" && (
            <div className="space-y-6">
              {!isResetSent ? (
                <>
                  <p className="text-gray-600 text-sm text-center">
                    Enter your registered email and we'll send a token to reset your password.
                  </p>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-red-500 outline-none"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-70"
                    >
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 font-medium">Reset Request Successful!</p>
                  <p className="text-green-600 text-sm mt-1">Instructions sent to {resetEmail}</p>
                </div>
              )}
              <button
                onClick={() => {
                  setActiveTab("signin");
                  setIsResetSent(false);
                }}
                className="w-full text-center text-sm font-bold text-gray-500 hover:text-gray-700"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;