import React, { useContext, useEffect, useState } from "react";
import { useProfile } from "./Hooks/UserProfile";
import ProfileSidebar from "./Sidebar/ProfileSidebar";
import ProfileInfoEdit from "./Sections/ProfileInfoEdit";
import ProfileInfoView from "./Sections/ProfileInfoView";
import ProfileSecurity from "./Sections/ProfileSecurity";
import ProfileNotifications from "./Sections/ProfileNotifications";
import ProfileLoader from "./Shared/ProfileLoader";
import PageLayout from "./Layout/PageLayout";
import { OrderProvider } from "../../Context/OrderContext";
import ProfileOrders from "./Sections/ProfileOrderDetails";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "sonner";

const ProfilePage2 = () => {
  const navigate = useNavigate();
  const { user, setUser, isLoading } = useProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <ProfileLoader />;

  // Elite Tactical Content Container
  const containerStyle = "relative bg-black/40 rounded-[2.5rem] p-8 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group";

  return (
    <PageLayout title="Personal Profile">
      {/* Background Decorative Element - Increased Depth */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <ProfileSidebar
        user={user}
        setUser={setUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="lg:col-span-3 h-[calc(100vh-200px)] overflow-y-auto pr-4 custom-scrollbar space-y-6">
        
        {/* Active Tab Wrapper */}
        <div className={containerStyle}>
          {/* Tactical Decorative Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-600/20 rounded-tl-[2.5rem]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-600/20 rounded-tr-[2.5rem]" />
          
          {/* Animated Scan Line - Subtle system feel */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-red-500/50 shadow-[0_0_15px_#ef4444] animate-scan opacity-20 pointer-events-none" />

          {/* Subtle Top Red Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
          
          {/* Tab Content Rendering */}
          <div className="relative z-10">
            {activeTab === "profile" && (
                isEditing ? (
                  <ProfileInfoEdit
                    user={user}
                    setUser={setUser}
                    onCancel={() => setIsEditing(false)}
                    onSaved={() => setIsEditing(false)}
                  />
                ) : (
                  <ProfileInfoView
                    user={user}
                    onEdit={() => setIsEditing(true)}
                  />
                )
            )}

            {activeTab === "orders" && <ProfileOrders />}
            {activeTab === "security" && <ProfileSecurity />}
            {activeTab === "notifications" && <ProfileNotifications />}
          </div>

          {/* Background Matrix/Grid Overlay Effect */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
        </div>
      </div>

      {/* Inject custom scrollbar and scan animations */}
      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.2);
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.6);
          box-shadow: 0 0 10px rgba(220, 38, 38, 0.4);
        }

        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateY(600px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </PageLayout>
  );
};

export default ProfilePage2;