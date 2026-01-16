import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, Users, ShoppingCart, 
  Package, PlusSquare, Settings, 
  Layers, ChevronRight, Activity, Shield,
  RotateCcw // Added for tactical return icon
} from "lucide-react";
import { isAction } from "redux";

const AdminSidebar = ({ sidebarOpen }) => {
  // Navigation items updated with tactical icons and Wolf labels
  const menuItems = [
    { 
      path: "/admin/Dashboard", 
      label: "Command Center", 
      icon: LayoutDashboard 
    },
    { 
      path: "/admin/ViewUsers", 
      label: "Athlete DB", 
      icon: Users 
    },
    { 
      path: "/admin/ViewProducts", 
      label: "Mangage Product", 
      icon: Package 
    },
    { 
      path: "/admin/AddProduct", 
      label: "Add Product", 
      icon: PlusSquare 
    },
    { 
      path: "/admin/ViewOrders", 
      label: "Orders", 
      icon: ShoppingCart 
    },
    {
      path: "/admin/Category",
      label: "Departments",
      icon: Layers
    },
    {
      path: "/admin/Returns",
      label :"Return Product",
      icon: RotateCcw 
    }
  ];

  return (
    <aside 
      className={`bg-[#0A0A0A] border-r border-white/5 transition-all duration-500 flex flex-col z-30 h-full
        ${sidebarOpen ? "w-72" : "w-20"}`}
    >
      {/* Branding Section: Wolf Athletix Logo */}
      <div className="h-20 flex items-center px-6 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="min-w-[40px] h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40 rotate-3 group-hover:rotate-0 transition-transform">
          <Shield className="text-white w-6 h-6" strokeWidth={2.5} />
        </div>
        {sidebarOpen && (
          <div className="ml-4 flex flex-col leading-none animate-in fade-in slide-in-from-left-2 duration-500">
            <span className="font-black italic text-xl text-white tracking-tighter uppercase">
              WOLF<span className="text-red-600">ATHLETIX</span>
            </span>
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] mt-1">
              Admin Protocol
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar">
        <p className={`text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 px-2 ${!sidebarOpen && 'text-center'}`}>
          {sidebarOpen ? 'Main Operations' : 'Ops'}
        </p>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
              ${isActive 
                ? "bg-red-600 text-white shadow-xl shadow-red-900/20" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"}
            `}
          >
            <item.icon 
              size={20} 
              strokeWidth={2.5}
              className={`transition-transform duration-300 ${sidebarOpen ? "mr-4" : "mx-auto group-hover:scale-110"}`} 
            />
            
            {sidebarOpen && (
              <span className="font-bold text-sm uppercase italic tracking-tight whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            )}

            {/* Active Indicator Line */}
            {sidebarOpen && (
              <ChevronRight 
                size={14} 
                className={`ml-auto transition-all duration-300 ${sidebarOpen ? 'opacity-40 group-hover:opacity-100 group-hover:translate-x-1' : 'hidden'}`} 
              />
            )}
            
            {/* Tooltip for collapsed mode */}
            {!sidebarOpen && (
              <div className="fixed left-24 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-2xl border border-white/10 z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / System Status */}
      <div className="p-6 border-t border-white/5 bg-gradient-to-t from-white/[0.02] to-transparent">
        <div className={`flex items-center bg-white/[0.03] border border-white/5 rounded-2xl p-4 ${!sidebarOpen && "justify-center"}`}>
          <div className="relative flex items-center justify-center">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-ping absolute"></div>
             <div className="w-2 h-2 rounded-full bg-green-500 relative"></div>
          </div>
          {sidebarOpen && (
            <div className="ml-4 flex flex-col leading-none">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                System Active
              </span>
              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter mt-1">
                Node: IND-KA-09
              </span>
            </div>
          )}
          {sidebarOpen && <Activity size={14} className="ml-auto text-gray-700" />}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #EF4444;
        }
      `}} />
    </aside>
  );
};

export default AdminSidebar;