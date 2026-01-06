import { Camera } from "lucide-react";

const Avatar = ({ image, onChange }) => {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <img
        src={image || "/default-avatar.png"}
        alt="Profile"
        className="w-full h-full rounded-full object-cover border-2 border-gray-600"
      />

      <label className="absolute bottom-2 right-2 bg-black/70 p-2 rounded-full cursor-pointer">
        <Camera size={16} className="text-white" />
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default Avatar;