// PaymentPage.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { CartContext } from "../Context/CartContext";
import { toast } from "react-toastify";
import { OrderContext } from "../Context/OrderContext";
import api from "../Api/AxiosInstance";

function PaymentPage() {
  const { user } = useContext(AuthContext);
  const { cart, clearCart } = useContext(CartContext);
  const { deductStockAfterOrder } = useContext(OrderContext);
  const navigate = useNavigate();

  const shippingaddress = user?.shippingaddress || {};

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  const safeCart = cart.map((item) => ({ ...item, quantity: item.quantity || 1 }));

  const subtotal = safeCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleBack = () => window.history.back();

  const saveOrder = async (newOrder) => {
    try {
      const previousOrders = user.order && Array.isArray(user.order) ? user.order : [];
      const response = await api.patch(`/users/${user.id}`, {
        order: [...previousOrders, newOrder],
        cart: [],
      });

      const updatedUser = response.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (clearCart) clearCart();

      setIsProcessing(false);
      navigate("/confirmation", { replace: true, state: { order: newOrder } });
      toast.success("Order Placed Successfully!");
    } catch (err) {
      console.error("Error saving order:", err);
      setIsProcessing(false);
      toast.error("Order placed but failed to save in your profile!");
    }
  };

  // ******** MAKE ASYNC ********
  const handleCompleteOrder = async () => {
    if (safeCart.length === 0) {
      toast.warn("Your cart is empty!");
      return;
    }

    setIsProcessing(true);

    // ---------- COD ORDER ----------
    if (selectedPaymentMethod === "cod") {
      const codOrder = {
        orderId: Date.now(),
        paymentMethod: "COD",
        amount: total.toFixed(2),
        date: new Date().toISOString(),
        status: "Pending",
        shippingAddress: shippingaddress,
        items: safeCart,
        summary: {
          subtotal: subtotal.toFixed(2),
          tax: tax.toFixed(2),
          total: total.toFixed(2),
        },
      };

      await deductStockAfterOrder(safeCart);
      saveOrder(codOrder);
      return;
    }

    // ---------- RAZORPAY ----------
    if (selectedPaymentMethod === "razorpay") {
      if (!window.Razorpay) {
        toast.error("Razorpay SDK not loaded.");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: "rzp_test_edrzdb8Gbx5U5M",
        amount: Math.round(total * 100),
        currency: "INR",
        name: "My Shop",
        description: "Order Payment",
        prefill: {
          name: user?.name || "Guest",
          email: user?.email || "guest@example.com",
          contact: shippingaddress?.mobileno || "9876543210",
        },
        theme: { color: "#dc2626" },
        magic_checkout:true,

        handler: async function (response) {
          await deductStockAfterOrder(safeCart);

          const successOrder = {
            orderId: Date.now(),
            paymentMethod: "Razorpay",
            paymentId: response.razorpay_payment_id,
            amount: total.toFixed(2),
            date: new Date().toISOString(),
            status: "SUCCESS",
            shippingAddress: shippingaddress,
            items: safeCart,
            summary: {
              subtotal: subtotal.toFixed(2),
              tax: tax.toFixed(2),
              total: total.toFixed(2),
            },
          };

          saveOrder(successOrder);
        },

        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.warn("Payment window closed.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  return (
    <>
      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overflow-y: hidden;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-10 px-4 pt-18 hide-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Step Indicator */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4 mt-10">
              {[
                { step: 1, label: "Cart", active: true },
                { step: 2, label: "Shipping", active: true },
                { step: 3, label: "Payment", active: true, current: true },
                { step: 4, label: "Confirmation", active: false },
              ].map((s, index) => (
                <React.Fragment key={s.step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        s.active ? "bg-red-600 text-white" : "bg-gray-700 text-gray-400 border border-gray-600"
                      } ${s.current ? "ring-2 ring-red-300" : ""}`}
                    >
                      {s.step}
                    </div>
                    <span className={`text-xs mt-1 ${s.active ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                      {s.label}
                    </span>
                  </div>
                  {index < 3 && <div className="h-0.5 w-16 bg-gray-700 mt-3" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Payment Section */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
              <p className="text-gray-600 border-b pb-4">Select your preferred payment method to complete the order.</p>

              {/* Razorpay Option */}
              <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={selectedPaymentMethod === "razorpay"}
                    onChange={() => setSelectedPaymentMethod("razorpay")}
                    className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-lg font-medium text-gray-800">Pay Online (Razorpay)</span>
                </label>
              </div>

              {/* COD Option */}
              <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={selectedPaymentMethod === "cod"}
                    onChange={() => setSelectedPaymentMethod("cod")}
                    className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-lg font-medium text-gray-800">Cash on Delivery (COD)</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  onClick={handleBack}
                  className="text-gray-600 hover:text-red-600 font-medium transition duration-150 ease-in-out"
                >
                  ← Return to Shipping
                </button>
                <button
                  onClick={handleCompleteOrder}
                  disabled={isProcessing}
                  className={`px-8 py-3 rounded-lg font-semibold transition duration-150 ease-in-out ${
                    isProcessing ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {isProcessing
                    ? "Processing..."
                    : selectedPaymentMethod === "cod"
                    ? "Place COD Order"
                    : `Complete Order (₹${total.toFixed(2)})`}
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-xl sticky top-8 max-h-[80vh] overflow-y-auto space-y-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

                <div className="max-h-56 overflow-y-auto pr-2">
                  {safeCart.length > 0 ? (
                    safeCart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 mb-3 border-b border-gray-100 pb-2">
                        <img
                          src={item.image || "https://via.placeholder.com/50"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md border border-gray-200"
                        />
                        <div className="flex-1 ml-3">
                          <p className="font-medium text-sm text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-800 text-sm">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No items in your cart.</p>
                  )}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl border-t pt-4 text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {shippingaddress && Object.keys(shippingaddress).length > 0 && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-2 border-b pb-1">Ship To</h3>
                    <p className="text-sm text-black font-bold">
                      {shippingaddress.firstname} {shippingaddress.lastname}
                    </p>
                    <p className="text-sm text-gray-700">
                      {shippingaddress.address} {shippingaddress.apartment}
                    </p>
                    <p className="text-sm text-gray-700">
                      {shippingaddress.city}, {shippingaddress.state} {shippingaddress.postalcode}
                    </p>
                    <p className="text-sm text-gray-700">{shippingaddress.country}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default PaymentPage;
