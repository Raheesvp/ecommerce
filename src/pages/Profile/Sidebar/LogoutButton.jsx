import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout =async () => {
    await logout();
    navigate('/login')
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
