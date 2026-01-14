import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../Services/AdminService";
import { toast } from "react-toastify";
import { 
  Eye, ShoppingBag, Search, Filter, 
  Calendar, Download, Loader2, ChevronRight,
  TrendingUp, Clock, CheckCircle, XCircle
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
      toast.error("Failed to fetch order manifest");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const statusValue = parseInt(newStatus, 10);
    const currentOrder = orders.find(o => o.id === orderId);
    if (currentOrder?.status === statusValue) return; 

    setUpdatingId(orderId);
    
    try {
      await adminService.changeOrderStatus(orderId, statusValue);
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: statusValue } : order
        )
      );
      
      const statusMap = { 0: 'Pending', 1: 'Processing', 2: 'Shipped', 3: 'Delivered', 4: 'Cancelled' };
      toast.success(`Protocol Updated: Order is now ${statusMap[statusValue]}`);
      
    } catch (err) {
      const errorMessage = err.response?.status === 405 
        ? "Endpoint Error: Method not allowed by server."
        : err.response?.data?.message || "Status update failed";
      toast.error(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    const s = String(status); 
    switch (s) {
      case '3': return 'bg-green-50 text-green-600 border-green-200'; // Delivered
      case '1': return 'bg-blue-50 text-blue-600 border-blue-200';   // Processing
      case '0': return 'bg-amber-50 text-amber-600 border-amber-200'; // Pending
      case '2': return 'bg-purple-50 text-purple-600 border-purple-200'; // Shipped
      case '4': return 'bg-red-50 text-red-600 border-red-200';       // Cancelled
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const filteredOrders = (orders || []).filter(order => {
    const orderId = String(order.id || "").toLowerCase();
    const receiver = (order.receiverName || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return orderId.includes(search) || receiver.includes(search);
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing Logistics Database...</p>
    </div>
  );

  return (
    <div className="space-y-8 p-2 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <ShoppingBag size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deployment Tracking</span>
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
            Order <span className="text-blue-600">Manifest</span>
          </h2>
        </div>
        <button className="flex items-center px-6 py-3 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 hover:border-blue-200 transition-all shadow-sm">
          <Download size={16} className="mr-2 text-blue-600" /> Export Data
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-2 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center px-8 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-all">
          <Filter size={18} className="mr-2" /> Filter Ops
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <th className="px-8 py-6">ID Signature</th>
                <th className="px-8 py-6">Athlete / Client</th>
                <th className="px-8 py-6">Timestamp</th>
                <th className="px-8 py-6">Investment</th>
                <th className="px-8 py-6 text-center">Status Protocol</th>
                <th className="px-8 py-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-8 py-6">
                      <span className="font-mono text-xs text-blue-600 font-black bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                        #{String(order.id || "").substring(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 uppercase italic tracking-tight">{order.receiverName}</span>
                        <span className="text-[10px] font-medium text-gray-400 lowercase">{order.userEmail}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-xs font-bold text-gray-500 italic">
                        <Calendar size={14} className="mr-2 text-blue-400" />
                        {new Date(order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-lg font-black text-gray-900 italic">
                        ₹{order.totalAmount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="relative inline-block">
                        <select
                          value={String(order.status)}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className={`pl-4 pr-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 outline-none cursor-pointer transition-all appearance-none text-center shadow-sm hover:shadow-md ${getStatusStyle(order.status)} ${
                            updatingId === order.id ? "opacity-50 animate-pulse" : ""
                          }`}
                        >
                          <option value="0">Pending</option>
                          <option value="1">Processing</option>
                          <option value="2">Shipped</option>
                          <option value="3">Delivered</option>
                          <option value="4">Cancelled</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                            <ChevronRight size={12} className="rotate-90" />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => navigate(`/admin/OrderDetails/${order.id}`)}
                        className="p-3 text-gray-400 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all shadow-sm"
                        title="Open Details"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center opacity-20">
                        <ShoppingBag size={64} strokeWidth={1} className="mb-4" />
                        <p className="text-sm font-black uppercase tracking-[0.3em]">Manifest Empty</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats Mockup */}
      <div className="flex justify-between items-center px-4 py-2">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Showing {filteredOrders.length} operations in current manifest
        </p>
        <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrders;