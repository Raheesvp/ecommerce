import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, Truck, Home, ArrowLeft } from "lucide-react";
import React from "react";

function ConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;


  
  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No Order Found</h2>
          <p className="text-gray-400 mb-6">It seems you arrived here without completing an order.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
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
          
          {/* Order Details Section */}
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
                  <p className="font-bold text-gray-800">#{order.orderId}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-bold text-green-600">₹{order.amount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-bold text-gray-800">{order.paymentMethod}</p>
                </div>
              </div>

              {order.paymentId && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600">Payment ID</p>
                  <p className="font-mono text-gray-800">{order.paymentId}</p>
                </div>
              )}
            </div>

            {/* Ordered Items */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-red-600" />
                Ordered Items
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <img 
                      src={item.image || "https://via.placeholder.com/100"} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg shadow-sm mb-3"
                    />
                    <p className="text-sm font-medium text-gray-800 text-center mb-1">{item.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-red-600 mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-red-600" />
                  Shipping Details
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="font-bold text-gray-800 text-lg mb-2">
                    {order.shippingAddress.firstname} {order.shippingAddress.lastname}
                  </p>
                  <p className="text-gray-700">{order.shippingAddress.address}</p>
                  {order.shippingAddress.apartment && (
                    <p className="text-gray-700">{order.shippingAddress.apartment}</p>
                  )}
                  <p className="text-gray-700">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalcode}
                  </p>
                  <p className="text-gray-700">{order.shippingAddress.country}</p>
                  {order.shippingAddress.mobileno && (
                    <p className="text-gray-700 mt-2">📱 {order.shippingAddress.mobileno}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">₹{order.summary?.subtotal || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-800">₹{order.summary?.tax || '0.00'}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-800">Total</span>
                    <span className="text-red-600">₹{order.amount}</span>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="font-semibold text-green-800">Order Status</p>
                    <p className="text-sm text-green-700 capitalize">{order.status || 'Confirmed'}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/products')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition duration-200 flex items-center justify-center"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-semibold transition duration-200 flex items-center justify-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </button>
                <button 
                  onClick={() => navigate(-1)}
                  className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm transition duration-200 flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Previous
                </button>
              </div>

              {/* Support Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  Need help? Contact our support team at{" "}
                  <a href="mailto:support@wolfathletix.com" className="text-red-600 hover:underline">
                    support@wolfathletix.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Timeline */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Estimated Delivery Timeline</h3>
          <div className="flex items-center justify-between">
            {[
              { status: "Order Placed", date: "Today", active: true },
              { status: "Processing", date: "Tomorrow", active: false },
              { status: "Shipped", date: "In 2 days", active: false },
              { status: "Delivered", date: "In 3-5 days", active: false },
            ].map((step, index) => (
              <div key={step.status} className="flex flex-col items-center text-center flex-1">
                <div className={`w-3 h-3 rounded-full mb-2 ${step.active ? 'bg-red-600' : 'bg-gray-300'}`}></div>
                <p className={`text-sm font-medium ${step.active ? 'text-red-600' : 'text-gray-500'}`}>
                  {step.status}
                </p>
                <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                {}
              </div>
            ))}
          </div>
        </div>
      </div>                            
    </div>
  );
}

export default ConfirmationPage;