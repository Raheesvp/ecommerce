import React from "react";
import { Lock, ShieldCheck, KeyRound } from "lucide-react";

const PasswordForm = ({ passwordData, setPasswordData, onSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Elite Tactical Styles
  const inputStyle = "w-full bg-black/40 text-white border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20 transition-all placeholder-gray-600 text-sm font-medium tracking-widest";
  const labelStyle = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 mb-1.5 flex items-center gap-2";

  return (
    <div className="max-w-md space-y-6">
      {/* Current Password */}
      <div className="group">
        <label className={labelStyle}>
          <KeyRound size={12} className="text-red-600" /> 
          Authorization: Current Password
        </label>
        <input
          type="password"
          name="currentPassword"
          placeholder="••••••••"
          value={passwordData.currentPassword || ""}
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      {/* New Password */}
      <div className="group">
        <label className={labelStyle}>
          <Lock size={12} className="text-red-600" /> 
          New Security Credential
        </label>
        <input
          type="password"
          name="newPassword"
          placeholder="••••••••"
          value={passwordData.newPassword || ""}
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      {/* Confirm Password */}
      <div className="group">
        <label className={labelStyle}>
          <ShieldCheck size={12} className="text-red-600" /> 
          Verify Security Credential
        </label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={passwordData.confirmPassword || ""}
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      {/* Tactical Update Button */}
      <button
        type="button"
        onClick={onSubmit}
        className="group relative w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-red-900/20 overflow-hidden"
      >
        {/* Shine Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        <span className="relative z-10 text-xs font-black uppercase tracking-[0.3em] italic">
          Update Security Password
        </span>
      </button>
      
    
    </div>
  );
};

export default PasswordForm;