import { useState } from "react";
import PasswordForm from "../Shared/PasswordForm";
import { toast } from "react-toastify";
import { authService } from "../../../Services/AuthService";

const ProfileSecurity = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""

  });

  const [loading,setLoading] = useState(false);

  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword) {
      toast.error("All Fields are Required");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords Do Not Match");
      return ;
    }

    if(passwordData.newPassword.length<8){
      toast.error("Pasword must be at least 8 characters");
      return ;
    }

    try {
      setLoading(true);

      const payload = {
    CurrentPassword: passwordData.currentPassword, 
    NewPassword: passwordData.newPassword  ,
    ConfirmPassword : passwordData.confirmPassword      
  };
      
        await authService.changePassword(payload);
      toast.success("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });

    } catch (err) {
   console.log("Server Error Message:", err.response?.data); 
    toast.error("Error: " + (err.response?.data?.message || "Something went wrong"));




    }finally{
      setLoading(false);
    }
  };


  return <PasswordForm passwordData={passwordData} setPasswordData={setPasswordData} onSubmit={handlePasswordUpdate} loading={loading} />;
};


export default ProfileSecurity;