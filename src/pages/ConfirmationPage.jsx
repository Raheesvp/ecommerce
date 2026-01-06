import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, ShoppingBag, Truck, Home, ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../Api/AxiosInstance"; // Ensure this path matches your Axios setup
import { toast } from "react-toastify";

function ConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // To handle /confirmation/:id if you add it to App.jsx
  
  const [order, setOrder] = useState(state?.order || null);
  const [loading, setLoading] = useState(!state?.order && !!id);

  // Persistence: Fetch order from backend if state is lost on refresh
  useEffect(() => {
    if (!order && id) {
      const fetchOrderDetails = async () => {
        try {
          const response = await api.get(`/orders/${id}`);
          // Adjust based on your ApiResponse structure (e.g., response.data.data)
          setOrder(response.data.data || response.data);
        } catch (err) {
          console.error("Error fetching order:", err);
          toast.error("Could not retrieve order details.");
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetails();
    }
  }, [id, order]);

  // CALCULATION LOGIC: Calculate based on items to ensure consistency
  const subtotal = order?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <p className="text-xl animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-4">No Order Found</h2>
          <p className="text-gray-400 mb-6">It seems you arrived here without completing an order.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-10 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        
        {/* Step Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[
              { step: 1, label: "Cart", active: true },
              { step: 2, label: "Shipping", active: true },
              { step: 3, label: "Payment", active: true },
              { step: 4, label: "Confirmation", active: true, current: true },
            ].map((s, index) => (
              <React.Fragment key={s.step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      s.active ? "bg-red-600 text-white" : "bg-gray-700 text-gray-400 border border-gray-600"
                    } ${s.current ? "ring-2 ring-red-300 ring-offset-2 ring-offset-gray-900" : ""}`}
                  >
                    {s.current ? <CheckCircle className="w-5 h-5" /> : s.step}
                  </div>
                  <span className={`text-xs mt-2 ${s.active ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                    {s.label}
                  </span>
                </div>
                {index < 3 && <div className="h-0.5 w-16 bg-gray-700 mt-3" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Success Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been successfully placed.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-bold text-gray-800">#{order.orderId || order.id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  {/* Using the consistent total calculation */}
                  <p className="font-bold text-green-600">₹{total.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-bold text-gray-800">{order.paymentMethod || "Online"}</p>
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-red-600" />
                Ordered Items
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <img 
                      src={item.image || "https://via.placeholder.com/100"} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-red-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="text-gray-800">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-800">Total</span>
                    <span className="text-red-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/products')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Shop More
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-semibold transition flex items-center justify-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;