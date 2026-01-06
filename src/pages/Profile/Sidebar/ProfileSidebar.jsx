import LogoutButton from "./LogoutButton";
import ProfileAvatar from "./ProfileAvatar";
import ProfileNavigation from "./ProfileNavigation";
import ProfileStats from "./ProfileStats";

const ProfileSidebar = ({ user,setUser, activeTab, setActiveTab }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
         <aside>
      <ProfileAvatar user={user} setUser = {setUser} />
      <ProfileNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <ProfileStats />
      <LogoutButton />
    </aside>
    </div>
    </div>
  );
};

export default ProfileSidebar;