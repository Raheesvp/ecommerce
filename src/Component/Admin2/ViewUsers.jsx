import React, { useState, useEffect } from "react";
import { adminService } from "../../Services/AdminService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { 
  Users, Search, ShieldCheck, UserCheck, Mail, Calendar, 
  ShieldAlert, Loader2, RefreshCw, Filter, User
} from "lucide-react";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      
      if (response && response.data) {
        setUsers(response.data); 
      } else {
        setUsers(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      toast.error("Failed to fetch user database");
      console.log("error", err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (user) => {
    const action = user.isBlocked ? "unblock" : "block";
    
    const result = await Swal.fire({
      title: 'Modify Access?',
      text: `You are about to ${action} ${user.firstName || user.email}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: user.isBlocked ? "#10b981" : "#f59e0b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action} them!`,
      background: "#ffffff",
      customClass: {
        popup: 'rounded-3xl border-none shadow-xl'
      }
    });

    if (result.isConfirmed) {
      try {
        await adminService.toggleBlockStatus(user.id);
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u
        ));
        
        Swal.fire({
          title: "Success",
          text: `User has been ${user.isBlocked ? "unblocked" : "blocked"}.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-3xl' }
        });
      } catch (err) {
        toast.error("Failed to update user status");
      }
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const displayName = (user.name || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || displayName.includes(search) || email.includes(search);
  }) : [];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400" size={16} />
      </div>
      <p className="text-gray-500 font-semibold tracking-wide animate-pulse">Loading Member Records...</p>
    </div>
  );

  return (
    <div className="p-2 space-y-8 animate-in fade-in duration-500">
      {/* --- Page Header --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 text-blue-600">
            <div className="bg-blue-100 p-2 rounded-xl">
              <Users size={24} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Member Directory</h2>
          </div>
          <p className="text-gray-500 text-sm ml-12">Manage user permissions and account status</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchUsers}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 transition-all shadow-sm"
          >
            <RefreshCw size={18} />
            <span className="text-sm font-bold">Refresh</span>
          </button>
          <div className="h-10 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>
          <div className="flex bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
            <button className="px-5 py-2 text-xs font-bold bg-white text-blue-600 rounded-xl shadow-sm">All</button>
            <button className="px-5 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">Staff</button>
          </div>
        </div>
      </div>

      {/* --- Utility Bar --- */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Find athlete by name, email or ID..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-[2rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center space-x-2 px-6 py-4 bg-white border border-gray-200 rounded-[2rem] text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
          <Filter size={20} />
          <span className="font-bold text-sm">Filters</span>
        </button>
      </div>

      {/* --- Users Table Card --- */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Athlete Identity</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Authority</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Access Status</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Enlisted On</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.15em] text-center">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={`group hover:bg-blue-50/30 transition-all duration-300 ${user.isBlocked ? 'bg-red-50/40' : ''}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black border-4 border-white shadow-lg shadow-blue-200 uppercase transition-transform group-hover:scale-110">
                          {user.firstName?.charAt(0) || user.email?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                            {user.firstName || user.fullName || user.lastName || "Guest Athlete"}
                          </p>
                          <p className="text-xs text-gray-400 font-medium flex items-center mt-0.5">
                            <Mail size={14} className="mr-1.5 text-blue-400" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black tracking-wider border shadow-sm ${
                        user.role?.toLowerCase() === 'admin' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {user.role?.toLowerCase() === 'admin' ? <ShieldCheck size={14} className="mr-2" /> : <User size={14} className="mr-2" />}
                        {user.role?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-3 border-2 border-white shadow-sm ${
                          user.isBlocked ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                        }`} />
                        <span className={`text-xs font-bold tracking-tight uppercase ${
                          user.isBlocked ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {user.isBlocked ? "Locked" : "Operational"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-sm font-semibold text-gray-500 italic">
                        <Calendar size={16} className="mr-2.5 text-gray-300" />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "---"}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button 
                        onClick={() => handleToggleBlock(user)}
                        className={`p-3 rounded-2xl transition-all shadow-sm border group-active:scale-95 ${
                          user.isBlocked 
                          ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-600 hover:text-white hover:shadow-green-200' 
                          : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-600 hover:text-white hover:shadow-amber-200'
                        }`}
                        title={user.isBlocked ? "Grant Access" : "Revoke Access"}
                      >
                        {user.isBlocked ? <UserCheck size={22} /> : <ShieldAlert size={22} />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center space-y-3 opacity-30">
                      <Users size={64} />
                      <p className="text-xl font-bold">No Records Found</p>
                      <p className="text-sm font-medium">Try adjusting your search filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* --- Footer Stats --- */}
      <div className="flex justify-between items-center px-4 py-2">
        <p className="text-sm text-gray-400 font-medium">
          Showing <span className="text-gray-900 font-bold">{filteredUsers.length}</span> of <span className="text-gray-900 font-bold">{users.length}</span> members
        </p>
        <div className="flex space-x-1">
          <div className="w-8 h-1.5 bg-blue-600 rounded-full"></div>
          <div className="w-2 h-1.5 bg-gray-200 rounded-full"></div>
          <div className="w-2 h-1.5 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;