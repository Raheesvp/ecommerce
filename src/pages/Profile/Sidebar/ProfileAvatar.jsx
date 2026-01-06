import { useContext, useState } from "react"; // Import useState for loading
import { toast } from "react-toastify";
import Avatar from "../Shared/Avatar";
import { userService } from "../../../Services/UserService"; // Use your service!
import { AuthContext } from "../../../Context/AuthContext";

const ProfileAvatar = ({ user, setUser }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setUploading(true); 

      const dataToSend = {
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: user.mobileNumber || user.phone, 
        profileImageFile: file 
      };

      // 3. Call Service (cleaner than api.put manually)
      await userService.updateProfile(dataToSend);

      toast.success("Profile image updated");

      // 4. Refresh User Data to get the new Cloudinary URL
      const updatedUser = await userService.getProfile();
      const newUserState = { ...user, ...updatedUser };

      setUser(newUserState);
      localStorage.setItem("user",JSON.stringify(updatedUser));

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false); // Stop loading
    }
  };

  return (
    <div className={uploading ? "opacity-50 pointer-events-none" : ""}>
      <Avatar
        
        image={user?.profileImageUrl} 
        onChange={handleImageChange}
      />
      {uploading && <p className="text-xs text-center text-blue-400 mt-2">Uploading...</p>}
    </div>
  );
};

export default ProfileAvatar;