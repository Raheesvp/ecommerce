import React, { useState, useEffect } from "react";
import { adminService } from "../../Services/AdminService";
import { toast } from "react-toastify";
import { 
  Users, Search, Trash2, ShieldCheck,  UserMinus, UserCheck, Mail, Calendar,  Filter, MoreHorizontal, ShieldAlert 
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
      const response = await adminService.getAllUsers();
      
      // FIX: Extract the actual array from the ApiResponse object
      if (response && response.data) {
        setUsers(response.data); 
      } else {
        setUsers(Array.isArray(response) ? response : []);
      }
      
    } catch (err) {
      toast.error("Failed to fetch users");
      console.log("error", err.message);
      setUsers([]); // Ensure it stays an array
    } finally {
      setLoading(false);
    }
  };
  const handleToggleBlock = async (id) => {
    try {
      await adminService.toggleBlockStatus(id);
      setUsers(users.map(user => 
        user.id === id ? { ...user, isBlocked: !user.isBlocked } : user
      ));
      toast.success("User status updated");
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await adminService.deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error("Failed to delete user");
      }
    }
  };

const filteredUsers = Array.isArray(users) ? users.filter(user => {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
  const email = (user.email || "").toLowerCase();
  const search = searchTerm.toLowerCase();
  return fullName.includes(search) || email.includes(search);
}) : [];
  if (loading) return <div className="p-10 text-center text-gray-500">Loading user database...</div>;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Users className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          <button className="px-4 py-1.5 text-sm font-medium bg-blue-50 text-blue-600 rounded-md">All Users</button>
          <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700">Admins</button>
        </div>
      </div>

      {/* Search & Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">User</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Role</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Joined Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`hover:bg-gray-50/50 transition-colors ${user.isBlocked ? 'bg-red-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Mail size={12} className="mr-1" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center w-fit px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      user.role?.toLowerCase() === 'admin' 
                      ? 'bg-purple-50 text-purple-700 border-purple-100' 
                      : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {user.role?.toLowerCase() === 'admin' && <ShieldCheck size={12} className="mr-1" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isBlocked 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                    }`}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-2" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => handleToggleBlock(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isBlocked 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-amber-600 hover:bg-amber-50'
                        }`}
                        title={user.isBlocked ? "Unblock User" : "Block User"}
                      >
                        {user.isBlocked ? <UserCheck size={18} /> : <ShieldAlert size={18} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;