import React, { useState, useEffect } from "react";
import { 
  Users, ShoppingCart, IndianRupee, TrendingUp, AlertCircle,
  BarChart3, Calendar, ArrowUpRight, ArrowDownRight, Package,
  Zap
} from "lucide-react";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { adminService } from "../../Services/AdminService";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashBoardStats();
        // Backend returns response.data containing our DashBoardResponse DTO
        setStats(response.data || response);
      } catch (err) {
        toast.error("Failed to load Wolf Performance data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs italic">
          Syncing Wolf Athletix Manifest...
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 font-bold uppercase">
        <AlertCircle className="mr-2" /> System Error: Data Unavailable
      </div>
    );
  }

  /* ---------- NIVO DATA ADAPTERS (MAPPING C# DTOs) ---------- */
  
  // Mapping SalesHistory -> Nivo Line
  const revenueLineData = [
    {
      id: "Revenue",
      data: (stats.salesHistory || []).map(item => ({
        x: item.date, // x: "2024-05-20"
        y: item.revenue
      }))
    }
  ];

  // Mapping LowStockProducts -> Nivo Bar
  const inventoryBarData = (stats.lowStockProducts || []).map(p => ({
    product: p.productName.length > 8 ? p.productName.substring(0, 8) + '..' : p.productName,
    stock: p.value
  }));

  const statCards = [
    { title: "Today's Revenue", value: `₹${(stats.todayRevenue || 0).toLocaleString()}`, icon: IndianRupee, trend: "+12.5%", positive: true },
    { title: "Today's Orders", value: stats.todayOrders || 0, icon: ShoppingCart, trend: "+5.2%", positive: true },
    { title: "Total Athletes", value: stats.totalUsers || 0, icon: Users, trend: "+2.1%", positive: true },
    { title: "Net Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, trend: "+18.3%", positive: true }
  ];

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
            Performance <span className="text-red-600">Command</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium italic">
            Alpha Analytics for Wolf Athletix Operations
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border shadow-sm">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-xs font-black text-gray-600 uppercase">
            {new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-red-200 transition-all group">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-red-50 transition-colors">
                <card.icon className="w-6 h-6 text-red-600" />
              </div>
              <div className={`flex items-center text-[10px] font-black ${card.positive ? "text-green-600" : "text-red-600"}`}>
                {card.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {card.trend}
              </div>
            </div>
            <p className="text-[10px] mt-6 font-black uppercase tracking-[0.2em] text-gray-400">{card.title}</p>
            <p className="text-3xl font-bold text-gray-900 tracking-tighter mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* REVENUE LINE CHART (Nivo) */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-black italic uppercase mb-8 flex items-center tracking-tight">
            <BarChart3 className="mr-2 text-red-600" size={20} /> Revenue Velocity (7-Day Cycle)
          </h3>

          <div className="h-[350px]">
            <ResponsiveLine
              data={revenueLineData}
              margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                orient: "bottom",
                tickSize: 5,
                tickPadding: 10,
                tickRotation: -30,
                legend: "Date",
                legendOffset: 50,
                legendPosition: "middle",
              }}
              axisLeft={{
                orient: "left",
                tickSize: 5,
                tickPadding: 10,
                tickRotation: 0,
                legend: "Amount (₹)",
                legendOffset: -50,
                legendPosition: "middle",
              }}
              colors={["#ef4444"]}
              pointSize={8}
              pointColor="#ffffff"
              pointBorderWidth={3}
              pointBorderColor={{ from: "serieColor" }}
              pointLabelYOffset={-12}
              enableArea={true}
              areaOpacity={0.08}
              useMesh={true}
              enableGridX={false}
              theme={{
                axis: { ticks: { text: { fontSize: 10, fontWeight: 700, fill: "#9ca3af" } } },
                grid: { line: { stroke: "#f3f4f6" } }
              }}
            />
          </div>
        </div>

        {/* INVENTORY MONITOR (Nivo + List) */}
        <div className="space-y-8">
          {/* Low Stock Bar Chart */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-black italic uppercase mb-6 flex items-center">
              <AlertCircle className="mr-2 text-red-600" size={20} /> Stock Critical
            </h3>
            <div className="h-[220px]">
              <ResponsiveBar
                data={inventoryBarData}
                keys={["stock"]}
                indexBy="product"
                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
                padding={0.4}
                valueScale={{ type: "linear" }}
                colors={["#111827"]}
                borderRadius={6}
                axisBottom={{ tickSize: 0, tickPadding: 10 }}
                axisLeft={{ tickSize: 0, tickPadding: 10 }}
                enableLabel={false}
                theme={{
                  axis: { ticks: { text: { fontSize: 9, fontWeight: 800, fill: "#6b7280" } } }
                }}
              />
            </div>
          </div>

          {/* Top Selling List */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-black italic uppercase mb-6 flex items-center">
              <Zap className="mr-2 text-yellow-500" size={20} /> High Velocity Gear
            </h3>
            <div className="space-y-5">
              {stats.topSellingProducts?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-bold text-gray-700 uppercase italic tracking-tighter">
                      {item.productName}
                    </span>
                  </div>
                  <span className="text-[10px] font-black bg-gray-900 text-white px-2 py-1 rounded-md">
                    {item.value} SOLD
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Manifest (Recent Orders Table) */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
          <h3 className="text-lg font-black italic uppercase tracking-tight text-gray-900 flex items-center">
            <Package className="mr-2 text-red-600" size={22} /> Deployment Manifest
          </h3>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing Last 5 Drops</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b">
                <th className="px-10 py-5">Order ID</th>
                <th className="px-10 py-5">Athlete</th>
                <th className="px-10 py-5">Amount</th>
                <th className="px-10 py-5 text-right">Protocol Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentOrders?.map((order) => (
                <tr key={order.orderId} className="hover:bg-red-50/30 transition-colors group">
                  <td className="px-10 py-6 font-mono text-[10px] text-gray-400 group-hover:text-red-600">
                    #{order.orderId}
                  </td>
                  <td className="px-10 py-6 text-sm font-bold text-gray-700 uppercase italic">
                    {order.customerName}
                  </td>
                  <td className="px-10 py-6 font-black text-gray-900 italic">
                    ₹{order.amount.toLocaleString()}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${
                      order.status === "Delivered"
                        ? "bg-green-50 text-green-600 border-green-100"
                        : "bg-yellow-50 text-yellow-600 border-yellow-100"
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
  );
};

export default AdminDashboard;