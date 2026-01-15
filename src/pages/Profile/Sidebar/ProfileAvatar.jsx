import { useContext, useState } from "react";
import { toast } from "react-toastify";
import Avatar from "../Shared/Avatar";
import { userService } from "../../../Services/UserService"; 
import { AuthContext } from "../../../Context/AuthContext";
// 1. Import the compression library
import imageCompression from "browser-image-compression";

const ProfileAvatar = ({ user, setUser }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 2. Validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      setUploading(true);

      // 3. Compression Innovation
      // This shrinks the image before it even leaves the user's computer
      const options = {
        maxSizeMB: 1,           // Target size 1MB
        maxWidthOrHeight: 1024, // Resize to 1024px
        useWebWorker: true,     // Improved performance
      };

      const compressedFile = await imageCompression(file, options);

      const dataToSend = {
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: user.mobileNumber || user.phone,
        // Send the compressed version instead of the original raw file
        profileImageFile: compressedFile 
      };

      // 4. Call Service
      await userService.updateProfile(dataToSend);

      toast.success("Profile image updated");

      // 5. Refresh User Data
      const updatedUser = await userService.getProfile();
      const newUserState = { ...user, ...updatedUser };

      localStorage.setItem("user", JSON.stringify(newUserState));
      setUser(newUserState);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={uploading ? "opacity-50 pointer-events-none" : ""}>
      <Avatar
        image={user?.profileImageUrl}
        onChange={handleImageChange}
      />
      {uploading && (
        <div className="mt-4 flex flex-col items-center gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 animate-pulse">
            Scanning Biometrics...
          </span>
          {/* Tactical Red Progress Bar */}
          <div className="w-24 h-[2px] bg-white/5 overflow-hidden rounded-full">
             <div className="w-full h-full bg-red-600 animate-[loading_1.5s_infinite]" />
          </div>
        </div>
      )}

      {/* Adding the animation keyframes directly here */}
      <style jsx="true">{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ProfileAvatar;