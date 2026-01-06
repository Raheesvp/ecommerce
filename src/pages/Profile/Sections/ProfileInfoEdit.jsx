import { toast } from "react-toastify";
import EditForm from "../Shared/EditForm";
import SaveCancelButtons from "../Shared/SaveCancelButtons";
import { userService } from "../../../Services/UserService";

const ProfileInfoEdit = ({ user, setUser, onCancel }) => {
const handleSave = async () => {
  try {
    
    const dataToSend = {
      firstName :user.firstName ||user.FirstName ,
      lastName :user.lastName || user.LastName,
      mobileNumber:user.mobileNumber || user.phone,
      profileImageFile:user.profileImageFile
    };

    console.log("📤 Sending Update:", dataToSend);

    await userService.updateProfile(dataToSend)
    toast.success("Profile updated successfully");

    const updatedUser = await userService.getProfile();
    setUser(updatedUser);


 
      if(onCancel) onCancel();

  } catch (err) {
    console.error("Update Failed",err.response?.data)
    toast.error(err.response?.data?.message || "Profile update failed");
  }
};


  return (
    <>
      <EditForm user={user} setUser={setUser} />
      <SaveCancelButtons onSave={handleSave} onCancel={onCancel} />
    </>
  );
};


export default ProfileInfoEdit;