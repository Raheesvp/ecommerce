import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import Swal from "sweetalert2";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    // 1. Capture the result of the SweetAlert
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the admin panel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Sign Out!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#ffffff",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-lg px-4 py-2",
        cancelButton: "rounded-lg px-4 py-2"
      }
    });

    // 2. Only execute logout if the user clicked "Yes"
    if (result.isConfirmed) {
      await logout();
      navigate('/login');
    }
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