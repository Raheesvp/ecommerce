import React from "react";
import { User, Package, Shield, Bell, ChevronRight } from "lucide-react";

const ProfileNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "profile", label: "Personnel Profile", icon: <User size={16} /> },
    { key: "orders", label: "Order History", icon: <Package size={16} /> },
    { key: "security", label: "Security Protocol", icon: <Shield size={16} /> },
    { key: "notifications", label: "Comm Settings", icon: <Bell size={16} /> }
  ];

  return (
    <nav className="mt-8 space-y-3">
      {/* Sector Header */}
      <div className="px-4 mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
          Navigation Sectors
        </span>
      </div>

      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`group relative w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-300 border ${
            activeTab === tab.key
              ? "bg-red-600/10 border-red-600/50 text-white shadow-lg shadow-red-900/10"
              : "bg-transparent border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-200"
          }`}
        >
          {/* Active Accent Line */}
          {activeTab === tab.key && (
            <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-red-600 rounded-r-full shadow-[0_0_10px_#dc2626]" />
          )}

          <div className="flex items-center gap-4 relative z-10">
            <span className={`${activeTab === tab.key ? "text-red-500" : "text-gray-600 group-hover:text-gray-400"}`}>
              {tab.icon}
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest italic">
              {tab.label}
            </span>
          </div>

          <ChevronRight 
            size={14} 
            className={`transition-all duration-300 ${
              activeTab === tab.key ? "opacity-100 translate-x-0 text-red-500" : "opacity-0 -translate-x-2"
            }`} 
          />
        </button>
      ))}
    </nav>
  );
};

export default ProfileNavigation;