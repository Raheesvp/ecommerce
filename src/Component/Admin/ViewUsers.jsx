// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../../Api/AxiosInstance";
import { toast } from "react-toastify";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
      console.log("Fetched users:", res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = async (userId, isBlocked) => {
    try {
      await api.patch(`/users/${userId}`, { blocked: !isBlocked });
      toast.success(`User ${!isBlocked ? "blocked" : "unblocked"} successfully`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Panel - Users</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["ID", "Name", "Email", "Status", "Actions"].map((title) => (
                <th
                  key={title}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.blocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.blocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button  onClick={() => toggleBlock(user.id, user.blocked)}  className={`px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 ${    user.blocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"  }`}>
                    {user.blocked ? "Unblock" : "Block"}
                  </button>

                  <button  onClick={() => deleteUser(user.id)}  className="px-4 py-2 rounded-md bg-gray-700 text-white font-semibold hover:bg-gray-800 transition-colors duration-200">
                    Delete
                  </button>

                </td>
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewUsers;
