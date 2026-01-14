import { useContext, useEffect, useState } from "react";
import {useProfile} from "./Hooks/UserProfile";
import ProfileSidebar from "./Sidebar/ProfileSidebar";
import ProfileInfoEdit from "./Sections/ProfileInfoEdit";
import ProfileInfoView from "./Sections/ProfileInfoView";
import ProfileSecurity from "./Sections/ProfileSecurity";
import ProfileNotifications from "./Sections/ProfileNotifications";
import ProfileLoader from "./Shared/ProfileLoader";
import PageLayout from "./Layout/PageLayout";
import { OrderProvider } from "../../Context/OrderContext";
import ProfileOrders from "./Sections/ProfileOrderDetails";
import {  useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

import { toast } from "sonner";
import { collapseToast, ToastContainer } from "react-toastify";



const ProfilePage2 = () => {
  const navigate  = useNavigate();
  const { user, setUser, isLoading } = useProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  // useEffect(() => {
  //   // If we aren't loading and there is no user, redirect to login
  //   if (!user) {
  //     // Toaster.err("Login Required")
  //     toast.error("login needed");
  
  //     navigate("/login"); // Adjust this path to your login route
  //   }
  // }, [ navigate]);

 


  if (isLoading) return <ProfileLoader />;    


  
  

  return (
    <PageLayout>


      <ProfileSidebar
        user={user}
        setUser={setUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
     
     <div className="lg:col-span-3 h-[calc(100vh-180px)] overflow-y-auto pr-2 custom-scrollbar">
  {activeTab === "profile" && (
      <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50">
            {isEditing ? (
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
            )}
          </div>
  )}

  {activeTab === "orders" && (
    <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50">
      <ProfileOrders />
    </div>
  )}
    

       {activeTab === "orders" && (
          <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50 ">
            <ProfileOrders />
          </div>
        )}

        

        
        
        {activeTab === "security" && (
          <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50">
            <ProfileSecurity />
          </div>
        )}
        
        {activeTab === "notifications" && (
          <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50">
            <ProfileNotifications />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ProfilePage2;