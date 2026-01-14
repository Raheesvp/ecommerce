// AuthPage.jsx - Premium Athletic Design
import React, { useReducer, useState, useContext } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { LogIn, UserPlus, Mail, Lock, User, ArrowLeft, Zap } from "lucide-react";
import api from "../Api/AxiosInstance";
import { authService } from "../Services/AuthService";
import { AuthContext } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// REGISTRATION REDUCER
const registrationReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIRST_NAME": return { ...state, firstName: action.payload };
    case "SET_LAST_NAME": return { ...state, lastName: action.payload };
    case "SET_EMAIL": return { ...state, email: action.payload };
    case "SET_PASSWORD": return { ...state, password: action.payload };
    case "CONFIRM_PASSWORD": return { ...state, confirmPassword: action.payload };
    case "RESET_FORM": return initialState;
    default: return state;
  }
};

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin"); 
  const [regState, regDispatch] = useReducer(registrationReducer, initialState);
  const [regError, setRegError] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [resetEmail, setResetEmail] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);

  const { loginuser, loginError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const registerUser = async (data) => {
    try {
      await api.post("/auth/register", data);
      toast.success("Registration Successful! Redirecting to login...");
      return { success: true };
    } catch (err) {
      if (err.response) {
        setRegError(err.response.data?.message || "Registration failed due to invalid input");
      } else {
        setRegError("Unable to reach server");
      }
      return { success: false };
    }
  };

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
    const result = await registerUser({
      FirstName: regState.firstName.trim(),
      LastName: regState.lastName.trim(),
      Email: regState.email.trim(),
      Password: regState.password,
      ConfirmPassword: regState.confirmPassword,
    });
    if (result.success) {
      regDispatch({ type: "RESET_FORM" });
      setActiveTab("signin");
    }
    setIsLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await loginuser(loginEmail, loginPassword);
    if (result?.success) {
      const from = location.state?.from?.pathname || "/";
      navigate(result.user.role === "Admin" ? "/admin/dashboard" : from, { replace: true });
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await authService.forgotPassword(resetEmail);
      if (result.status === 200 || result.statusCode === 200 || result.success) {
        toast.success("OTP sent successfully!");
        navigate(`/reset-password?email=${encodeURIComponent(resetEmail)}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
        
        {/* Left Section: Branding & Image */}
        <div className="hidden lg:flex relative flex-col justify-between p-12 bg-cover bg-center" 
             style={{ backgroundImage: `url('https://i.pinimg.com/1200x/cd/54/54/cd5454f908667f54e2198aec9e3891a4.jpg')` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/40 via-black/80 to-black/90" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white mb-8">
              <Zap size={24} className="text-red-500 fill-current" />
              <span className="text-xl font-black italic uppercase tracking-tighter">WolfAthletix</span>
            </div>
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
              Join the <br /><span className="text-red-600">Elite Squad</span>
            </h1>
            <p className="text-gray-300 max-w-sm font-medium leading-relaxed">
              Unlock professional grade gear, personalized training metrics, and exclusive community access.
            </p>
          </div>

          <div className="relative z-10 flex gap-6 text-white/50 text-sm font-bold uppercase tracking-[0.2em]">
            <span>Performance</span>
            <span>Strength</span>
            <span>Speed</span>
          </div>
        </div>

        {/* Right Section: Auth Forms */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[#111]">
          <div className="w-full max-w-md mx-auto">
            
            {/* Tab Navigation */}
            {activeTab !== "forgot" && (
              <div className="flex bg-white/5 p-1 rounded-2xl mb-10 border border-white/5">
                <button
                  onClick={() => setActiveTab("signin")}
                  className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                    activeTab === "signin" ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-gray-500 hover:text-white"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab("signup")}
                  className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                    activeTab === "signup" ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-gray-500 hover:text-white"
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            {/* SIGN IN VIEW */}
            {activeTab === "signin" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Welcome Back</h2>
                <p className="text-gray-500 text-sm mb-8 font-medium">Enter your credentials to access the armory.</p>
                
                {loginError && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-xs mb-6 font-bold">{loginError}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-medium"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input
                      type="password"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-medium"
                      required
                    />
                  </div>
                  <div className="text-right">
                    <button type="button" onClick={() => setActiveTab("forgot")} className="text-xs font-black text-gray-500 uppercase tracking-widest hover:text-red-500 transition-colors">Forgot Password?</button>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-600 text-white py-4 rounded-xl font-black italic uppercase tracking-widest hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-red-900/20"
                  >
                    {isLoading ? "Authenticating..." : "Sign In"}
                  </button>
                </form>
              </div>
            )}

            {/* SIGN UP VIEW */}
            {activeTab === "signup" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">New Recruit</h2>
                <p className="text-gray-500 text-sm mb-8 font-medium">Build your profile and start your journey.</p>
                
                {regError && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-xs mb-6 font-bold">{regError}</div>}

                <form onSubmit={handleRegistration} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={regState.firstName}
                      onChange={(e) => regDispatch({ type: "SET_FIRST_NAME", payload: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 outline-none focus:border-red-500 transition-all font-medium"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={regState.lastName}
                      onChange={(e) => regDispatch({ type: "SET_LAST_NAME", payload: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 outline-none focus:border-red-500 transition-all font-medium"
                      required
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={regState.email}
                    onChange={(e) => regDispatch({ type: "SET_EMAIL", payload: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 outline-none focus:border-red-500 transition-all font-medium"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Create Password"
                    value={regState.password}
                    onChange={(e) => regDispatch({ type: "SET_PASSWORD", payload: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 outline-none focus:border-red-500 transition-all font-medium"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={regState.confirmPassword}
                    onChange={(e) => regDispatch({ type: "CONFIRM_PASSWORD", payload: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 outline-none focus:border-red-500 transition-all font-medium"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-black py-4 rounded-xl font-black italic uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoading ? "Registering..." : "Create Account"}
                  </button>
                </form>
              </div>
            )}

            {/* FORGOT PASSWORD VIEW */}
            {activeTab === "forgot" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button onClick={() => setActiveTab("signin")} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 text-xs font-black uppercase tracking-widest">
                  <ArrowLeft size={14} /> Back to Sign In
                </button>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Reset Password</h2>
                <p className="text-gray-500 text-sm mb-8 font-medium">We'll send an OTP to your email to verify identity.</p>
                
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter Registered Email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 outline-none focus:border-red-500 transition-all font-medium"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-600 text-white py-4 rounded-xl font-black italic uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-900/20"
                  >
                    {isLoading ? "Sending OTP..." : "Request Reset OTP"}
                  </button>
                </form>
              </div>
            )}

            {/* Social Auth (Optional but styled for consistency) */}
            {activeTab !== "forgot" && (
              <div className="mt-10">
               
               
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;