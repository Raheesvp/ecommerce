import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { LogOut } from "lucide-react";
import Swal from "sweetalert2";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "TERMINATE SESSION?",
      text: "Authorized access will be revoked immediately.",
      icon: "warning",
      iconColor: "#dc2626", // Red-600
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // Red-600
      cancelButtonColor: "transparent",
      confirmButtonText: "DISCONNECT",
      cancelButtonText: "ABORT",
      reverseButtons: true,
      background: "#0a0a0a",
      color: "#ffffff",
      padding: "2rem",
      customClass: {
        popup: "rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl",
        title: "text-2xl font-black italic uppercase tracking-tighter italic",
        htmlContainer: "text-gray-500 font-bold uppercase tracking-widest text-xs",
        confirmButton: "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest italic shadow-lg shadow-red-900/40",
        cancelButton: "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest italic text-gray-400 hover:text-white border border-white/5",
      }
    });

    if (result.isConfirmed) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="group relative mt-8 w-full bg-white/5 hover:bg-red-600/10 border border-white/10 hover:border-red-600/50 text-gray-400 hover:text-red-500 py-3.5 rounded-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 overflow-hidden"
    >
      {/* Subtle background red glow on hover */}
      <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors" />
      
      <LogOut size={16} strokeWidth={2.5} className="relative z-10" />
      <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.3em] italic">
        Log Out
      </span>
    </button>
  );
};

export default LogoutButton;