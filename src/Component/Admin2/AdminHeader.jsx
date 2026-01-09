import React, { useState } from "react";
import { 
  Search, Bell, ChevronDown, Menu, X, 
  User, Settings, LogOut, Globe 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      
      {/* Left Section: Sidebar Toggle & Search */}
      <div className="flex items-center flex-1">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors lg:hidden"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="relative ml-4 hidden md:block w-full max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search for orders, users or products..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
          />
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center space-x-4">
        
        {/* View Website Button */}
        <button 
          onClick={() => window.open('/', '_blank')}
          className="hidden sm:flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Globe size={18} className="mr-2" />
          Live Site
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                <span className="font-bold text-gray-800">Notifications</span>
                <span className="text-xs text-blue-600 cursor-pointer">Mark all read</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50">
                  <p className="text-sm text-gray-800 font-medium">New order received!</p>
                  <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-gray-800">Admin</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Super Admin</p>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <User size={16} className="mr-3 text-gray-400" />
                My Profile
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Settings size={16} className="mr-3 text-gray-400" />
                Settings
              </button>
              <hr className="my-1 border-gray-50" />
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} className="mr-3" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;