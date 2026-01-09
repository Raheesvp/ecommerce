import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../Services/AdminService";
import { toast } from "react-toastify";
import { 
  Eye, ShoppingBag, Search, Filter, 
  Calendar, Download, Loader2 
} from "lucide-react";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await adminService.getOrdersAll();
      setOrders(data || []);
    } catch (err) {
      toast.error("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    // 1. Convert string from select to integer for Backend/DB compatibility
    const statusValue = parseInt(newStatus, 10);

    const currentOrder = orders.find(o => o.id === orderId);
    if (currentOrder?.status === statusValue) return; 

    setUpdatingId(orderId);
    
    try {
      // 2. TRIGGER API: Ensure AdminService.changeOrderStatus uses PUT or PATCH 
      // as defined in your [Http] attribute in C#
      await adminService.changeOrderStatus(orderId, statusValue);
      
      // Update local state so UI reflects change without reload
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: statusValue } : order
        )
      );
      
      const statusMap = { 0: 'Pending', 1: 'Processing', 2: 'Shipped', 3: 'Delivered', 4: 'Cancelled' };
      toast.success(`Order status updated to ${statusMap[statusValue]}`);
      
    } catch (err) {
      console.error("Status Update Error:", err);
      // Logic for 405 Method Not Allowed error identification
      const errorMessage = err.response?.status === 405 
        ? "Error 405: Backend does not allow PUT/PATCH on this route. Check Controller."
        : err.response?.data?.message || "Failed to update status";
      
      toast.error(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    const s = String(status); 
    switch (s) {
      case '3': return 'bg-green-100 text-green-700 border-green-200'; 
      case '1': return 'bg-blue-100 text-blue-700 border-blue-200';  
      case '0': return 'bg-yellow-100 text-yellow-700 border-yellow-200'; 
      case '2': return 'bg-purple-100 text-purple-700 border-purple-200'; 
      case '4': return 'bg-red-100 text-red-700 border-red-200';    
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = (orders || []).filter(order => {
    const orderId = String(order.id || "").toLowerCase();
    const receiver = (order.receiverName || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return orderId.includes(search) || receiver.includes(search);
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-gray-500 font-medium">Loading order records...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
          <Download size={16} className="mr-2" /> Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
          <Filter size={18} className="mr-2" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-blue-600 font-medium">
                      #{String(order.id || "").substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{order.receiverName}</span>
                        <span className="text-xs text-gray-500">{order.userEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={14} className="mr-2 text-gray-400" />
                        {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      ₹{order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={String(order.status)}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border outline-none cursor-pointer transition-all appearance-none text-center ${getStatusStyle(order.status)} ${
                          updatingId === order.id ? "opacity-50 animate-pulse" : ""
                        }`}
                      >
                        <option value="0">Pending</option>
                        <option value="1">Processing</option>
                        <option value="2">Shipped</option>
                        <option value="3">Delivered</option>
                        <option value="4">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/admin/OrderDetails/${order.id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-medium">
                    No orders found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewOrders;