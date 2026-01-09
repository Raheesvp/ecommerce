import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from "recharts";
import { 
  Users, ShoppingCart, Package, IndianRupee, TrendingUp, Eye, Download, PieChart as PieChartIcon, BarChart3 
} from "lucide-react";
import { adminService } from "../../Services/AdminService";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashBoardStats();
        
        // FIX: Extract the nested 'data' object from the response
        // response is { data: {...}, success: true, message: "..." }
        if (response && response.data) {
          setStats(response.data); 
        } else {
          setStats(response); // Fallback if your service already extracts it
        }
        
      } catch (err) {
        toast.error("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [])

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;
  if (!stats) return <div className="p-10 text-center text-red-500">Error loading data.</div>;
  if(loading || !stats) return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-500">Loading Dashboard Data...</p>
      </div>

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-green-600", bg: "bg-green-50" },
    { title: "Total Products", value: stats.totalProducts, icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Total Revenue", value: `₹${(stats?.totalRevenue??0).toLocaleString()}`, icon: IndianRupee, color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
              </div>
              <div className={`p-3 ${card.bg} rounded-lg`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview (Mocking chart data based on revenue) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={[{day: 'Mon', sales: 400}, {day: 'Tue', sales: 300}, {day: 'Wed', sales: stats.totalRevenue / 10}]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products or Categories */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Order Status</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
              
                {stats.recentOrders?.map((order) => (
                  <tr key={order.orderId}>
                    <td className="py-4 font-medium">#{order.orderId}</td>
                    <td className="py-4">{order.customerName}</td>
                    <td className="py-4 font-bold">₹{order.amount}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;