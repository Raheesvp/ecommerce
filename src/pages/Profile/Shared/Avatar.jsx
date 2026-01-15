import { Camera } from "lucide-react";

const Avatar = ({ image, onChange }) => {
  return (
    <div className="relative w-32 h-32 mx-auto group">
      {/* Outer Glow Effect */}
      <div className="absolute inset-0 bg-red-600/20 rounded-full blur-xl group-hover:bg-red-600/30 transition-all duration-500" />
      
      {/* Image Container */}
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-red-600/50 transition-colors duration-300">
        <img
          src={image || "/default-avatar.png"}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=User"; }}
        />
      </div>

      {/* Camera Button - Matching the Red Elite Theme */}
      <label className="absolute bottom-1 right-1 bg-red-600 hover:bg-red-700 p-2.5 rounded-full cursor-pointer shadow-lg shadow-black/50 transition-all active:scale-90 border border-white/20">
        <Camera size={16} className="text-white" strokeWidth={3} />
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