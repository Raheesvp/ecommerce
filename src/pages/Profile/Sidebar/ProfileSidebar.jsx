import React from "react";
import LogoutButton from "./LogoutButton";
import ProfileAvatar from "./ProfileAvatar";
import ProfileNavigation from "./ProfileNavigation";
import ProfileStats from "./ProfileStats";

const ProfileSidebar = ({ user, setUser, activeTab, setActiveTab }) => {
  return (
    <div className="lg:col-span-1">
      {/* Main Sidebar Container:
          - bg-black/40: Transparent deep black for the glass effect
          - backdrop-blur-xl: High intensity blur for the premium look
          - border-white/5: Ultra-thin subtle border
          - sticky: Keeps the sidebar in view during scroll
      */}
      <div className="sticky top-28 bg-black/40 rounded-[2.5rem] p-8 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden relative">
        
        {/* Background Decorative Accent (Subtle Red Glow) */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-600/5 blur-[50px] rounded-full pointer-events-none" />
        
        <aside className="relative z-10">
          {/* Identity Section */}
          <div className="mb-8">
            <ProfileAvatar user={user} setUser={setUser} />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">
                {user?.firstName || "Operator"} {user?.lastName || ""}
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mt-1">
                Verified Personnel
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="border-t border-white/5 pt-2">
            <ProfileNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* System Statistics Section */}
          <div className="mt-8 pt-8 border-t border-white/5">
            <ProfileStats />
          </div>

          {/* Session Termination Section */}
          <div className="mt-4">
            <LogoutButton />
          </div>
        </aside>

        {/* Bottom Decorative Accent */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-900/10 blur-[60px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
};

export default ProfileSidebar;