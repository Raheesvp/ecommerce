import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { orderService } from "../../../Services/OrderService";
import { reviewService } from "../../../Services/ReviewServie";
import { productService } from "../../../Services/ProductService";
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
  History,
  Star,
  MessageSquare,
  Image as ImageIcon,
  Upload,
  User
} from "lucide-react";

const ProfileOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [productReviews, setProductReviews] = useState({}); // Stores reviews keyed by ProductId
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://localhost:57401"; 

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

  const getStatusStep = (status) => {
    const s = status?.toString().toUpperCase();
    if (s === "PENDING" || s === "0") return 1;
    if (s === "PROCESSING" || s === "1") return 2;
    if (s === "SHIPPING" || s === "2") return 3;
    if (s === "DELIVERED" || s === "3") return 4;
    return 0;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getMyOrders();
        const data = response.data || response;
        const ordersArray = Array.isArray(data) ? data : [];
        setOrders(ordersArray);

        // Fetch reviews for all products in these orders to show existing "Field Reports"
        const productIds = [...new Set(ordersArray.flatMap(o => o.orderItems.map(i => i.productId)))];
        productIds.forEach(async (id) => {
           try {
             const reviews = await productService.getReviewsByProductId(id);
             setProductReviews(prev => ({ ...prev, [id]: reviews }));
           } catch (e) { console.error("Review fetch error", e); }
        });

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

  const handleOpenReviewModal = async (productId, productName) => {
    const { value: formValues } = await Swal.fire({
      title: `<span class="italic uppercase font-black tracking-tighter text-white">Review Product</span>`,
      html:
        `<div class="flex flex-col gap-4 p-4 text-left overflow-x-hidden">
          <p class="text-[10px] text-red-500 font-black uppercase tracking-widest mb-2">Target: ${productName}</p>
          <label class="text-[9px] font-black uppercase text-gray-500 tracking-widest">1. Overall Rating</label>
          <select id="swal-rating" class="bg-black border border-white/10 text-white p-3 rounded-xl outline-none focus:border-red-600 text-sm">
            <option value="5">5 ★★★★★ </option>
            <option value="4">4 ★★★★☆ </option>
            <option value="3">3 ★★★☆☆ </option>
            <option value="2">2 ★★☆☆☆ </option>
            <option value="1">1 ★☆☆☆☆ </option>
          </select>
          <label class="text-[9px] font-black uppercase text-gray-500 tracking-widest mt-2">2. Field Report (Comment)</label>
          <textarea id="swal-comment" class="bg-black border border-white/10 text-white p-3 rounded-xl h-32 outline-none focus:border-red-600 text-sm" placeholder="Analyze quality and performance..."></textarea>
          <label class="text-[9px] font-black uppercase text-gray-500 tracking-widest mt-2">3. Visual Intelligence (Upload Images)</label>
          <input id="swal-file" type="file" multiple accept="image/*" class="bg-black border border-white/10 text-white p-3 rounded-xl outline-none focus:border-red-600 text-xs">
        </div>`,
      focusConfirm: false,
      background: "#0a0a0a",
      showCancelButton: true,
      confirmButtonText: 'LOG DEBRIEF',
      confirmButtonColor: '#dc2626',
      customClass: { popup: 'rounded-[2.5rem] border border-white/10' },
      preConfirm: () => {
        const rating = document.getElementById('swal-rating').value;
        const comment = document.getElementById('swal-comment').value;
        const files = document.getElementById('swal-file').files;
        if (!comment) Swal.showValidationMessage('Field Report is mandatory');
        return { rating, comment, files }
      }
    });

    if (formValues) {
      try {
        const formData = new FormData();
        formData.append("ProductId", productId);
        formData.append("Rating", formValues.rating);
        formData.append("Comment", formValues.comment);
        if (formValues.files) {
          Array.from(formValues.files).forEach((file) => formData.append("ReviewImages", file));
        }
        await productService.submitReview(formData);
        toast.success("Operational Report Saved");
        // Refresh reviews for this product
        const updatedReviews = await productService.getReviewsByProductId(productId);
        setProductReviews(prev => ({ ...prev, [productId]: updatedReviews }));
      } catch (err) {
        toast.error(err.response?.data?.message || "Communication Error");
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

        {orders.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-24 text-center backdrop-blur-xl">
            <Package className="mx-auto text-gray-800 mb-6 opacity-50" size={80} />
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Manifest Empty</h3>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map((order) => {
              const displayStatus = getStatusDisplay(order.status);
              const isDelivered = ["DELIVERED", "3", 3].includes(order.status);
              const canCancel = ["PENDING", "0", 0, "PROCESSING", "1", 1].includes(order.status);
              const activeStep = getStatusStep(order.status);

              return (
                <div key={order.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                  {/* Card Header */}
                  <div className="bg-white/[0.02] px-8 py-6 border-b border-white/5 flex flex-wrap justify-between items-center gap-6">
                    <div className="flex items-center gap-8">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Log Code</span>
                        <span className="text-sm font-bold text-white tabular-nums tracking-tight">#{order.id.toString().slice(-8)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Timestamp</span>
                        <span className="text-sm font-bold text-white">
                          {new Date(order.orderDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                      isDelivered ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                    }`}>
                      {displayStatus}
                    </div>
                  </div>

                  {/* Stepper */}
                  <div className="px-8 pt-10 pb-6 bg-black/20">
                    <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                      <div className="absolute top-[15px] left-0 w-full h-[2px] bg-white/5" />
                      <div className="absolute top-[15px] left-0 h-[2px] bg-red-600 transition-all duration-1000" style={{ width: `${activeStep > 0 ? ((activeStep - 1) / 3) * 100 : 0}%` }} />
                      {['Pending', 'Processing', 'Shipped', 'Delivered'].map((label, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 ${activeStep > idx ? "bg-red-600 border-red-600 text-white" : "bg-gray-900 border-white/10 text-gray-700"}`}>
                            {idx === 0 && <Clock size={14} />} {idx === 1 && <Box size={14} />} {idx === 2 && <Truck size={14} />} {idx === 3 && <CheckCircle size={14} />}
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-widest mt-3">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Items & Reviews Section */}
                  <div className="p-8 space-y-12">
                    {order.orderItems?.map((item, index) => {
                      const reviews = productReviews[item.productId] || [];
                      const myReview = reviews.find(r => r.userName === user?.firstName + " " + user?.lastName) || reviews[0];

                      return (
                        <div key={index} className="space-y-6">
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gray-900 rounded-2xl overflow-hidden border border-white/10 p-2">
                              <img src={item.imageUrl?.startsWith('http') ? item.imageUrl : `${BASE_URL}${item.imageUrl}`} className="w-full h-full object-contain" alt="" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="text-white font-bold text-lg uppercase tracking-tight">{item.productName}</h4>
                              <p className="text-[10px] font-black text-gray-500 uppercase">Qty: {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              {isDelivered && (
                                <button onClick={() => handleOpenReviewModal(item.productId, item.productName)} className="bg-white/5 hover:bg-red-600 text-white p-3 rounded-xl border border-white/10 transition-all flex items-center gap-2">
                                  <MessageSquare size={16} /> <span className="text-[9px] font-black uppercase">Add Review</span>
                                </button>
                              )}
                              <p className="text-xl font-black italic text-white tracking-tighter">₹{item.price * item.quantity}</p>
                            </div>
                          </div>

                          {/* --- REVIEW DETAILS SECTION --- */}
                          {myReview && (
                            <div className="ml-24 bg-white/[0.02] border border-white/5 rounded-2xl p-4 animate-in fade-in slide-in-from-left-2">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex text-red-600">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < myReview.rating ? "currentColor" : "none"} />)}
                                  </div>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Field Report Logged</span>
                                </div>
                                <span className="text-[8px] text-gray-600 font-bold">{new Date(myReview.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-400 text-xs italic leading-relaxed">"{myReview.comment}"</p>
                              {myReview.imageUrls?.length > 0 && (
                                <div className="flex gap-2 mt-3">
                                  {myReview.imageUrls.map((url, i) => (
                                    <img key={i} src={`${BASE_URL}${url}`} className="w-12 h-12 object-cover rounded-lg border border-white/10" alt="" />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="bg-white/[0.02] px-8 py-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">Total Payload</span>
                      <span className="text-4xl font-black italic text-red-600 tracking-tighter leading-none">₹{order.totalAmount}</span>
                    </div>
                    {canCancel ? (
                      <button onClick={() => handleCancelOrder(order.id)} className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-red-900/20 flex items-center gap-3">
                        <XCircle size={14} /> Cancel Mission
                      </button>
                    ) : (
                      <div className="flex flex-col items-end border-l border-white/10 pl-6">
                        <div className="flex items-center gap-2 text-green-500 mb-1">
                          <ShieldCheck size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">{isDelivered ? "Secured" : "Locked"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileOrders;