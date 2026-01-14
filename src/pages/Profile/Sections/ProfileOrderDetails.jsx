import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { orderService } from "../../../Services/OrderService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Box, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  History
} from "lucide-react";

const ProfileOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://localhost:5174";

  // LOGIC PRESERVATION: Status Mapper
  const getStatusDisplay = (status) => {
    const statusMap = {
      0: "Pending", 1: "Processing", 2: "Shipping", 3: "Delivered", 4: "Cancelled",
      "0": "Pending", "1": "Processing", "2": "Shipping", "3": "Delivered", "4": "Cancelled"
    };
    if (isNaN(status)) {
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
    return statusMap[status] || "Pending";
  };

  // Status Step Helper for Visual Stepper
  const getStatusStep = (status) => {
    const s = status?.toString().toUpperCase();
    if (s === "PENDING" || s === "0") return 1;
    if (s === "PROCESSING" || s === "1") return 2;
    if (s === "SHIPPING" || s === "2") return 3;
    if (s === "DELIVERED" || s === "3") return 4;
    return 0; // Cancelled
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getMyOrders();
        const data = response.data || response;
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const handleCancelOrder = async (OrderId) => {
    const result = await Swal.fire({
      title: "Abort Mission?",
      text: "This order will be removed from the deployment queue.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#374151",
      confirmButtonText: "Yes, Cancel Order",
      background: "#111",
      color: "#fff",
      customClass: { popup: 'rounded-[2rem] border border-white/10' }
    });

    if (result.isConfirmed) {
      try {
        await orderService.cancelOrder(OrderId);
        setOrders((prevOrders) =>
          prevOrders.map((ord) =>
            ord.id === OrderId ? { ...ord, status: "Cancelled" } : ord
          )
        );
        toast.success("Order Cancelled Successfully");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to Cancel Order");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 bg-[#0a0a0a] min-h-screen">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Syncing Manifest...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-900/20 rotate-3">
              <History size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
                Order <span className="text-red-600">History</span>
              </h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-1">Deployment Tracking System</p>
            </div>
          </div>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-24 text-center backdrop-blur-xl">
            <Package className="mx-auto text-gray-800 mb-6 opacity-50" size={80} />
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Manifest Empty</h3>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Your history is currently clear.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map((order) => {
              const displayStatus = getStatusDisplay(order.status);
              const currentStatus = displayStatus.toUpperCase().trim();
              const canCancel = ["PENDING", "PROCESSING"].includes(currentStatus);
              const activeStep = getStatusStep(order.status);

              return (
                <div
                  key={order.id}
                  className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-red-500/20 transition-all duration-500 backdrop-blur-xl shadow-2xl"
                >
                  {/* --- CARD HEADER --- */}
                  <div className="bg-white/[0.02] px-8 py-6 border-b border-white/5 flex flex-wrap justify-between items-center gap-6">
                    <div className="flex items-center gap-8">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Log Code</span>
                        <span className="text-sm font-bold text-white uppercase tabular-nums tracking-tight">#{order.id.toString().slice(-8)}</span>
                      </div>
                      <div className="h-10 w-[1px] bg-white/10"></div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Timestamp</span>
                        <span className="text-sm font-bold text-white uppercase tracking-tight">
                          {new Date(order.orderDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border ${
                      ["SUCCESS", "DELIVERED"].includes(currentStatus) ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      currentStatus === "CANCELLED" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                      "bg-orange-500/10 text-orange-500 border-orange-500/20"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                           ["SUCCESS", "DELIVERED"].includes(currentStatus) ? "bg-green-500 shadow-[0_0_8px_#22c55e]" :
                           currentStatus === "CANCELLED" ? "bg-red-500" : "bg-orange-500 shadow-[0_0_8px_#f97316]"
                      }`} />
                      {displayStatus}
                    </div>
                  </div>

                  {/* --- VISUAL TRACKING STEPPER --- */}
                  {currentStatus !== "CANCELLED" && (
                    <div className="px-8 pt-10 pb-6 bg-black/20">
                      <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                        <div className="absolute top-[15px] left-0 w-full h-[2px] bg-white/5 z-0" />
                        <div 
                          className="absolute top-[15px] left-0 h-[2px] bg-red-600 z-0 transition-all duration-1000 shadow-[0_0_10px_#dc2626]" 
                          style={{ width: `${((activeStep - 1) / 3) * 100}%` }} 
                        />
                        
                        {[
                          { icon: Clock, label: 'Pending' },
                          { icon: Box, label: 'Assembly' },
                          { icon: Truck, label: 'Transit' },
                          { icon: CheckCircle, label: 'Deployed' }
                        ].map((step, idx) => {
                          const Icon = step.icon;
                          const isDone = activeStep > idx;
                          const isCurrent = activeStep === idx + 1;
                          return (
                            <div key={idx} className="relative z-10 flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 border-2 ${
                                isDone ? "bg-red-600 border-red-600 text-white" : 
                                isCurrent ? "bg-[#0a0a0a] border-red-600 text-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)]" : 
                                "bg-gray-900 border-white/10 text-gray-700"
                              }`}>
                                <Icon size={14} />
                              </div>
                              <span className={`text-[8px] font-black uppercase tracking-widest mt-3 ${isCurrent ? "text-red-500" : "text-gray-600"}`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* --- ITEM MANIFEST (GRID) --- */}
                  <div className="p-8 space-y-8">
                    {order.orderItems?.map((item, index) => {
                      let imageUrl = item.imageUrl || item.image;
                      if (imageUrl && !imageUrl.startsWith("http")) imageUrl = `${BASE_URL}${imageUrl}`;

                      return (
                        <div key={index} className="flex items-center gap-6 group/item">
                          <div className="w-20 h-20 bg-gray-900 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 p-2 relative group-hover/item:border-red-500/30 transition-colors">
                            <img
                              src={imageUrl}
                              alt={item.productName}
                              className="w-full h-full object-contain group-hover/item:scale-110 transition-transform duration-700"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Img"; }}
                            />
                          </div>

                          <div className="flex-grow min-w-0">
                            <h4 className="text-white font-bold text-lg uppercase tracking-tight truncate group-hover/item:text-red-500 transition-colors">{item.productName || item.name}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Qty: {item.quantity}</span>
                              <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                              <span className="text-[10px] font-black text-red-600 italic uppercase">Pro Specification</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-black italic text-white tracking-tighter tabular-nums">₹{(item.price * item.quantity).toFixed(0)}</p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter mt-1 opacity-60">₹{item.price} / UNIT</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* --- CARD FOOTER --- */}
                  <div className="bg-white/[0.02] px-8 py-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">Total Payload</span>
                      <span className="text-4xl font-black italic text-red-600 tracking-tighter leading-none">₹{order.totalAmount}</span>
                    </div>

                    <div className="flex w-full sm:w-auto items-center gap-6">
                      {canCancel ? (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="w-full sm:w-auto px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-red-900/20 flex items-center justify-center gap-3 group"
                        >
                          <XCircle size={14} className="group-hover:rotate-90 transition-transform" /> Cancel Mission
                        </button>
                      ) : (
                        <div className="flex flex-col items-end border-l border-white/10 pl-6">
                          <div className="flex items-center gap-2 text-green-500 mb-1">
                            <ShieldCheck size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Deployment Locked</span>
                          </div>
                          <span className="text-[9px] text-gray-600 font-bold uppercase italic tracking-tighter">In transit via elite logistics</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Seal */}
        <div className="mt-24 pb-12 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-all duration-700 cursor-default">
          <div className="flex items-center gap-3 bg-white/5 px-8 py-4 rounded-3xl border border-white/10 backdrop-blur-md">
             <AlertCircle size={18} className="text-red-600" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Wolf Athletix Strategic Deployment Registry</span>
          </div>
          <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.5em]">Global Division • Elite Logistics</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileOrders;