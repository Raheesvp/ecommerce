import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, Users, ShoppingCart, 
  Package, PlusSquare, Settings, 
  ChevronLeft, ChevronRight 
} from "lucide-react";

const AdminSidebar = ({ sidebarOpen }) => {
  // Define navigation links to match your App.jsx routes exactly
  const menuItems = [
    { 
      path: "/admin/Dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard 
    },
    { 
      path: "/admin/ViewUsers", 
      label: "Customers", 
      icon: Users 
    },
    { 
      path: "/admin/ViewProducts", 
      label: "Inventory", 
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
    }
  ];

  return (
    <aside 
      className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-20
        ${sidebarOpen ? "w-64" : "w-20"}`}
    >
      {/* Branding Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="min-w-[32px] h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Settings className="text-white w-5 h-5 animate-spin-slow" />
        </div>
        {sidebarOpen && (
          <span className="ml-3 font-bold text-xl text-gray-800 tracking-tight transition-opacity">
            Admin<span className="text-blue-600">Pro</span>
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-3 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"}
            `}
          >
            <item.icon 
              size={22} 
              className={`transition-colors ${sidebarOpen ? "mr-4" : "mx-auto"}`} 
            />
            {sidebarOpen && (
              <span className="font-medium whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            )}
            
            {/* Tooltip for collapsed mode */}
            {!sidebarOpen && (
              <div className="fixed left-20 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Version info */}
      <div className="p-4 border-t border-gray-100">
        <div className={`flex items-center bg-gray-50 rounded-xl p-3 ${!sidebarOpen && "justify-center"}`}>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          {sidebarOpen && (
            <span className="ml-3 text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Server Online
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;