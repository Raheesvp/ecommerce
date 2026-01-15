import React from "react";
import { Edit, Shield } from "lucide-react";

const Header = ({ title, onEdit }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/5">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Shield size={14} className="text-red-600" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
          User Account 
        </span>
      </div>
      <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
        {title}
      </h2>
    </div>

    {onEdit && (
      <button
        onClick={onEdit}
        className="group relative flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all active:scale-95 shadow-lg shadow-red-900/20 overflow-hidden"
      >
        {/* Subtle Shine Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
        
        <Edit size={16} strokeWidth={3} className="relative z-10" />
        <span className="relative z-10 text-xs font-black uppercase tracking-widest">
          Edit Profile
        </span>
      </button>
    )}
  </div>
);

export default Header;