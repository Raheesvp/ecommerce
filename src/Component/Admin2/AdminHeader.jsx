import React, { useState, useEffect } from "react"; // Added useEffect
import { 
  Search, Bell, ChevronDown, Menu, X, 
  User, Settings, LogOut, Globe, Shield, Terminal
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import * as signalR from "@microsoft/signalr"; 

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    // 3. Establish SignalR Connection
   const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:57401/orderHub", {
    withCredentials: true
  })
  .withAutomaticReconnect()
  .build();

  
    connection.start()
      .then(() => {
        console.log("Connected to Tactical Intel Hub");
        
      connection.on("ReceiveOrderNotification", (message, orderId) => {
  // Move the log INSIDE here so it can access the variables
  console.log("real time Intel Received:", message, orderId);

  const newNotif = {
    id: Date.now(),
    message: message,
    orderId: orderId,
    time: new Date().toLocaleTimeString(),
    isRead: false
  };
  
  setNotifications(prev => [newNotif, ...prev]);
  
  toast.info(`INTEL: ${message}`, {
    position: "top-right",
    autoClose: 5000,
    icon: "🔥",
    theme: "dark"
  });
});
      
      })
      .catch(err => console.error("Intel Link Failed: ", err));

    return () => connection.stop();
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "TERMINATE SESSION?",
      text: "You will be logged out of the command center!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#374151",
      confirmButtonText: "YES, LOGOUT",
      cancelButtonText: "CANCEL",
      reverseButtons: true,
      background: "#ffffff",
      customClass: {
        popup: "rounded-[2rem] border-none shadow-2xl",
        confirmButton: "rounded-xl px-6 py-2 font-black tracking-widest uppercase text-xs",
        cancelButton: "rounded-xl px-6 py-2 font-black tracking-widest uppercase text-xs"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        toast.success("Deployment Terminated");
        navigate("/login");
      }
    });
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      
      {/* Left Section */}
      <div className="flex items-center flex-1">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-900 transition-all lg:hidden mr-4"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="relative hidden md:block w-full max-w-lg group">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-red-600 transition-colors">
            <Search size={18} strokeWidth={2.5} />
          </span>
          <input
            type="text"
            placeholder="Execute search protocol..."
            className="block w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-transparent rounded-2xl leading-5 text-sm font-bold placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-red-500/20 transition-all italic"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        <button 
          onClick={() => window.open('/', '_blank')}
          className="hidden sm:flex items-center text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-600 transition-all bg-gray-50 px-4 py-2 rounded-xl"
        >
          <Globe size={14} className="mr-2" /> Live Site
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`p-3 rounded-xl transition-all relative ${notificationsOpen ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            <Bell size={20} strokeWidth={2.5} />
            {notifications.length > 0 && (
              <span className="absolute top-2.5 right-2.5 block h-2.5 w-2.5 rounded-full bg-red-600 ring-4 ring-white animate-pulse"></span>
            )}
          </button>

          {notificationsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)}></div>
              <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-gray-100 py-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-gray-900 flex items-center">
                    <Terminal size={14} className="mr-2 text-red-600" /> System Intel
                  </span>
                  <button onClick={() => setNotifications([])} className="text-[10px] font-bold text-red-600 uppercase hover:underline">Flush All</button>
                </div>
                <div className="max-h-80 overflow-y-auto px-2">
                  {notifications.length === 0 ? (
                    <p className="p-8 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">Zero active alerts</p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                            navigate(`/admin/OrderDetails/${n.orderId}`);
                            setNotificationsOpen(false);
                        }} 
                        className="mx-2 my-1 px-4 py-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-gray-100 group"
                      >
                        <p className="text-sm text-gray-900 font-bold uppercase italic tracking-tight group-hover:text-red-600 line-clamp-1">{n.message}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">ID: #{n.orderId} • {n.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center space-x-3 p-1.5 rounded-2xl transition-all border ${profileOpen ? 'bg-gray-900 border-gray-900 shadow-xl' : 'bg-white border-gray-100 hover:border-gray-300'}`}
          >
            <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200">
              <Shield size={20} strokeWidth={2.5} />
            </div>
            <div className="hidden lg:block text-left pr-2">
              <p className={`text-xs font-black uppercase tracking-tighter ${profileOpen ? 'text-white' : 'text-gray-900'}`}>Admin User</p>
              <p className={`text-[9px] font-bold uppercase tracking-widest ${profileOpen ? 'text-red-400' : 'text-gray-400'}`}>Security Lvl 4</p>
            </div>
            <ChevronDown size={14} className={`transition-transform duration-300 mr-2 ${profileOpen ? 'rotate-180 text-white' : 'text-gray-400'}`} />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}></div>
              <div className="absolute right-0 mt-4 w-56 bg-white rounded-[2rem] shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                <button className="flex items-center w-full px-6 py-3 text-xs font-black text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-all uppercase tracking-widest">
                  <User size={16} className="mr-3 text-gray-400" /> Profile
                </button>
                <button className="flex items-center w-full px-6 py-3 text-xs font-black text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-all uppercase tracking-widest">
                  <Settings size={16} className="mr-3 text-gray-400" /> Settings
                </button>
                <div className="mx-4 my-2 border-t border-gray-50" />
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-6 py-3 text-xs font-black text-red-600 hover:bg-red-50 transition-all uppercase tracking-widest"
                >
                  <LogOut size={16} className="mr-3" /> Terminate
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;