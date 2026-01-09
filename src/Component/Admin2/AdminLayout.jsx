import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSideBar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  // Shared state to control sidebar expansion across Header and Sidebar components
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 1. Static Sidebar - Remains on screen during navigation */}
      <AdminSidebar sidebarOpen={sidebarOpen} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* 3. Static Header - Pass state to allow toggling sidebar from header */}
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* 4. Dynamic Content Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* The Outlet is a placeholder. 
               React Router will render AdminDashboard, ViewUsers, etc. here 
            */}
            <Outlet />
          </div>
        </main>
      </div>

      {/* 5. Mobile Overlay (Darkens background when sidebar is open on small screens) */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-10 lg:hidden" 
          onClick={() => setSidebarOpen(true)}
        />
      )}
    </div>
  );
};

export default AdminLayout;