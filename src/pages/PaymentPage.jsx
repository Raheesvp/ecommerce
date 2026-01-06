import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { CartContext } from "../Context/CartContext";
import { toast } from "react-toastify";
import { OrderContext } from "../Context/OrderContext";

function PaymentPage() {
  const { user } = useContext(AuthContext);
  const { cart, clearCart } = useContext(CartContext);
  const { placeFinalOrder, verifyPaymentOnBackend, shippingDetails } = useContext(OrderContext);
  
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  const safeCart = cart.map((item) => ({ ...item, quantity: item.quantity || 1 }));
  const subtotal = safeCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleBack = () => navigate(-1);

  const handleCompleteOrder = async () => {
    if (safeCart.length === 0) {
      toast.warn("Your cart is empty!");
      return;
    }

    setIsProcessing(true);

    try {
      // STEP 1: Create Order
      // Ensure your context's placeFinalOrder uses shippingDetails internally 
      // and sends 'TotalPrice' to match the C# DTO.
      const orderId = await placeFinalOrder(safeCart, total);

      // Validate that we actually got an ID back
      if (!orderId) {
        throw new Error("Invalid response from server: No Order ID received.");
      }

      // ---------- CASE: COD ----------
      if (selectedPaymentMethod === "cod") {
        await verifyPaymentOnBackend({
          orderId: orderId,
          transactionId: "COD_ORDER",
          status: "Success",
          providerOrderId: "COD_STUB"
        });

        if (clearCart) clearCart();
        toast.success("Order Placed Successfully!");
        navigate("/confirmation", { 
            state: { 
                order: { orderId, amount: total.toFixed(2), paymentMethod: 'COD', items: safeCart } 
            } 
        });
      }

      // ---------- CASE: RAZORPAY ----------
      else if (selectedPaymentMethod === "razorpay") {
        if (!window.Razorpay) {
          toast.error("Razorpay SDK not loaded.");
          setIsProcessing(false);
          return;
        }

        const options = {
          key: "rzp_test_S0goOJJ0kMzST1", // REPLACE WITH REAL KEY
          amount: Math.round(total * 100),
          currency: "INR",
          name: "Wolf Athletix",
          handler: async function (response) {
            try {
              // STEP 2: Verify Online Payment
              await verifyPaymentOnBackend({
                orderId: orderId,
                transactionId: response.razorpay_payment_id,
                status: "Success",
                providerOrderId: response.razorpay_order_id
              });

              if (clearCart) clearCart();
              toast.success("Payment Successful!");
              navigate("/confirmation", { 
                state: { 
                  order: { 
                    orderId, 
                    amount: total.toFixed(2), 
                    paymentMethod: 'Online', 
                    paymentId: response.razorpay_payment_id,
                    items: safeCart
                  } 
                } 
              });
            } catch (err) {
              console.error("Verification failed:", err);
              toast.error("Payment successful but database update failed.");
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: { name: user?.name, email: user?.email },
          theme: { color: "#dc2626" },
          modal: { ondismiss: () => setIsProcessing(false) },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error("Order process error:", err);
      
      // Detailed error logging to see exactly which field failed validation
      if (err.response && err.response.data && err.response.data.errors) {
        console.log("Validation Errors:", err.response.data.errors);
        toast.error("Validation Error: Please check your shipping address details.");
      } else {
        toast.error(err.response?.data?.message || "Failed to process order.");
      }
      
      setIsProcessing(false);
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
              <p className="text-gray-600 border-b pb-4">Select how you want to pay.</p>

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
                  {isProcessing ? "Processing..." : selectedPaymentMethod === "cod" ? "Place COD Order" : `Pay ₹${total.toFixed(2)}`}
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-xl sticky top-8 space-y-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                <div className="max-h-56 overflow-y-auto pr-2">
                  {safeCart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 mb-3 border-b border-gray-100 pb-2">
                      <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-md" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Tax (8%)</span><span>₹{tax.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-xl border-t pt-4 text-gray-900">
                    <span>Total</span><span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentPage;