import React, { useContext, useState, useEffect } from "react";
import { replace, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { CartContext } from "../Context/CartContext";
import { toast } from "react-toastify";
import { OrderContext } from "../Context/OrderContext";

function PaymentPage() {
  const { user } = useContext(AuthContext);
  const { cart, clearCart } = useContext(CartContext);
  const { placeFinalOrder, verifyPaymentOnBackend } = useContext(OrderContext);

  const navigate = useNavigate();
  const location = useLocation();

  const orderData = location.state || {};
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  // Maintain items from cart
  const displayItems = cart.map((item) => ({ 
    ...item, 
    quantity: item.quantity || 1 
  }));

  const subtotal = displayItems.reduce((sum, item) => {
    const price = Number(item?.price) || 0;
    const qty = Number(item?.quantity) || 0;
    return sum + (price * qty);
  }, 0);

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      toast.error("Your cart is empty.");
      navigate("/products");
    }
  }, [cart, navigate]);

  const handleBack = () => navigate(-1);

  const handleCompleteOrder = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const backendItems = displayItems.map(item => ({
        ProductId: Number(item.productId || item.id),
        Quantity: Number(item.quantity)
      }));

      // 1. Create Order
      const rawOrderId = await placeFinalOrder(backendItems, total, orderData);
      const orderId = Number(rawOrderId);

      if (!orderId || isNaN(orderId)) {
        throw new Error("Invalid Order ID received from server.");
      }

      // ---------- CASE: COD ----------
      if (selectedPaymentMethod === "cod") {
        await verifyPaymentOnBackend({
          OrderId: orderId,
          TransactionId: "COD_ORDER",
          Status: "Success",
          ProviderOrderId: "COD_STUB",
          PaymentMethod: "COD"
        });

        clearCart();
        toast.success("Order Placed Successfully!");
        navigate("/confirmation", {
          replace:true,
          state: {
            order: { orderId, amount: total.toFixed(2), paymentMethod: 'COD', items: displayItems, shippingAddress: orderData?.shippingAddress }
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
          key: "rzp_test_S0goOJJ0kMzST1", 
          amount: Math.round(total * 100),
          currency: "INR",
          name: "Wolf Athletix",
          description: "Cart Checkout",
          handler: async function (response) {
            try {
              const verificationPayload = {
                OrderId: orderId,
                TransactionId: response.razorpay_payment_id,
                Status: "Success",
                ProviderOrderId: response.razorpay_order_id,
                PaymentMethod: "Online"
              };

              console.log("Submitting verification:", verificationPayload);
              await verifyPaymentOnBackend(verificationPayload);

              clearCart();
              toast.success("Payment Successful!");
              
              navigate("/confirmation", {
                replace :true,
                state: {
                  order: {
                    orderId,
                    amount: total.toFixed(2),
                    paymentMethod: 'Online',
                    paymentId: response.razorpay_payment_id,
                    items: displayItems,
                    shippingAddress: orderData?.shippingAddress
                  }
                }
              });
            } catch (err) {
              console.error("Verification failed:", err);
              toast.error(err.response?.data?.message || "Verification failed.");
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
      console.error("Order error:", err);
      // Detailed error for "Cart is empty" issue
      const backendMsg = err.response?.data?.message;
      toast.error(backendMsg || err.message || "Failed to process order.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-10">
           <div className="flex items-center space-x-2 text-white">
              <span className="text-red-500 font-bold">Cart</span>
              <span>→</span>
              <span className="text-red-500 font-bold">Shipping</span>
              <span>→</span>
              <span className="bg-red-600 px-3 py-1 rounded text-sm font-bold">Payment</span>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Method</h2>
            
            <div className="space-y-4">
              <div 
                className={`p-5 border-2 rounded-xl cursor-pointer transition ${selectedPaymentMethod === 'razorpay' ? 'border-red-600 bg-red-50' : 'border-gray-200'}`}
                onClick={() => setSelectedPaymentMethod("razorpay")}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-gray-800">Pay Online (Razorpay)</span>
                  <div className={`w-6 h-6 rounded-full border-2 ${selectedPaymentMethod === 'razorpay' ? 'border-red-600 bg-red-600' : 'border-gray-300'}`}></div>
                </div>
              </div>

              <div 
                className={`p-5 border-2 rounded-xl cursor-pointer transition ${selectedPaymentMethod === 'cod' ? 'border-red-600 bg-red-50' : 'border-gray-200'}`}
                onClick={() => setSelectedPaymentMethod("cod")}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-gray-800">Cash on Delivery</span>
                  <div className={`w-6 h-6 rounded-full border-2 ${selectedPaymentMethod === 'cod' ? 'border-red-600 bg-red-600' : 'border-gray-300'}`}></div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-between items-center border-t pt-6">
              <button onClick={handleBack} className="text-gray-500 hover:text-red-600 font-semibold transition">← Back to Shipping</button>
              <button
                onClick={handleCompleteOrder}
                disabled={isProcessing}
                className="bg-red-600 text-white px-12 py-4 rounded-xl font-bold hover:bg-red-700 disabled:bg-gray-400 shadow-lg transform active:scale-95 transition"
              >
                {isProcessing ? "Processing..." : `Complete Order • ₹${total.toFixed(2)}`}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg h-fit border border-gray-100">
            <h3 className="text-xl font-bold border-b pb-4 mb-4 text-gray-800">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {displayItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm items-center">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-10 h-10 object-cover rounded shadow-sm" />
                    <span className="text-gray-700">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                  </div>
                  <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-red-600 pt-2 border-t">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;