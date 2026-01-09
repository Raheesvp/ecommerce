import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminService } from "../../Services/AdminService";
import { toast } from "react-toastify";
import { 
  ArrowLeft, Package, User, MapPin, CreditCard, 
  Calendar, Printer, Truck, CheckCircle, Clock 
} from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Fetch specific order details using the ID
        const response = await adminService.getOrderById(id);
        setOrder(response.data);
      } catch (err) {
        toast.error("Failed to load order details");
        navigate("/admin/ViewOrders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await adminService.changeOrderStatus(id, newStatus);
      setOrder({ ...order, status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading invoice...</div>;
  if (!order) return <div className="p-10 text-center">Order not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate("/admin/ViewOrders")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Order #{order.id?.substring(0, 8)}</h2>
            <p className="text-sm text-gray-500 flex items-center">
              <Calendar size={14} className="mr-1" /> {new Date(order.orderDate).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Printer size={18} className="mr-2" /> Print Invoice
          </button>
          <select 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg outline-none font-medium cursor-pointer disabled:bg-blue-400"
            value={order.status}
            disabled={updating}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
              <h3 className="font-bold text-gray-700 flex items-center">
                <Package size={18} className="mr-2" /> Items Summary
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={item.imageUrl} alt="" className="w-16 h-16 object-cover rounded-lg border" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.productName}</h4>
                      <p className="text-sm text-gray-500">Unit Price: ₹{item.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50/30 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600 border-b pb-2">
                <span>Shipping Fee</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                <span>Total Amount</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customer & Payment Info */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
              <User size={18} className="mr-2" /> Customer Details
            </h3>
            <p className="font-semibold">{order.receiverName}</p>
            <p className="text-sm text-gray-600">{order.userEmail}</p>
            <p className="text-sm text-gray-600 mt-1">{order.mobileNumber}</p>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
              <MapPin size={18} className="mr-2" /> Shipping Address
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.shippingAddress},<br />
              {order.city}, {order.state} - {order.pinNumber}
            </p>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
              <CreditCard size={18} className="mr-2" /> Payment Info
            </h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Method:</span>
              <span className="text-sm font-medium">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Status:</span>
              <span className="text-xs font-bold uppercase text-green-600 bg-green-50 px-2 py-1 rounded">Paid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;