import { Edit } from "lucide-react";

const Header = ({ title, onEdit }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    {onEdit && (
      <button
        onClick={onEdit}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl"
      >
        Edit Profile
      </button>
    )}
  </div>
);

export default Header;
