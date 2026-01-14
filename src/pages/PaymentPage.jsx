import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { CartContext } from "../Context/CartContext";
import { toast } from "react-toastify";
import { OrderContext } from "../Context/OrderContext";
import { 
  CreditCard, 
  Banknote, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle, 
  ChevronRight, 
  Lock,
  Wallet
} from "lucide-react";

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
  }, [cart, navigate, isProcessing]);

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
          replace: true,
          state: {
            order: { 
              orderId, 
              amount: total.toFixed(2), 
              paymentMethod: 'COD', 
              items: displayItems, 
              shippingAddress: orderData?.shippingAddress 
            }
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

              await verifyPaymentOnBackend(verificationPayload);

              clearCart();
              toast.success("Payment Successful!");
              
              navigate("/confirmation", {
                replace: true,
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
      const backendMsg = err.response?.data?.message;
      toast.error(backendMsg || err.message || "Failed to process order.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-20 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Step Indicator - Consistency with previous pages */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-4 md:gap-8">
            {[
              { step: 1, label: "Cart", active: true },
              { step: 2, label: "Shipping", active: true },
              { step: 3, label: "Payment", active: true },
            ].map((s, index) => (
              <React.Fragment key={s.step}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all duration-500 ${
                    s.step === 3 ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] rotate-3" : 
                    "bg-red-600/20 text-red-500 border border-red-500/50"
                  }`}>
                    {s.step < 3 ? <CheckCircle size={18} /> : s.step}
                  </div>
                  <span className={`text-[10px] mt-3 font-black uppercase tracking-widest ${s.step === 3 ? "text-red-500" : "text-gray-600"}`}>
                    {s.label}
                  </span>
                </div>
                {index < 2 && <div className="h-[2px] w-8 md:w-16 bg-red-600/50 mt-[-18px]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Left: Payment Method Selection */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="bg-red-600 p-2 rounded-lg">
                <Wallet size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Secure <span className="text-red-600">Checkout</span></h2>
            </div>

            <div className="space-y-4">
              {/* Online Payment Option */}
              <div 
                onClick={() => setSelectedPaymentMethod("razorpay")}
                className={`group relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 backdrop-blur-xl flex items-center justify-between ${
                  selectedPaymentMethod === 'razorpay' 
                  ? 'bg-red-600/10 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.1)]' 
                  : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl transition-colors ${selectedPaymentMethod === 'razorpay' ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-500'}`}>
                    <CreditCard size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Pay Online</h3>
                    <p className="text-xs text-gray-500 font-medium">Credit/Debit Cards, UPI, NetBanking (via Razorpay)</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === 'razorpay' ? 'border-red-600' : 'border-gray-600'}`}>
                  {selectedPaymentMethod === 'razorpay' && <div className="w-3 h-3 bg-red-600 rounded-full" />}
                </div>
              </div>

              {/* COD Option */}
              <div 
                onClick={() => setSelectedPaymentMethod("cod")}
                className={`group relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 backdrop-blur-xl flex items-center justify-between ${
                  selectedPaymentMethod === 'cod' 
                  ? 'bg-red-600/10 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.1)]' 
                  : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl transition-colors ${selectedPaymentMethod === 'cod' ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-500'}`}>
                    <Banknote size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Cash On Delivery</h3>
                    <p className="text-xs text-gray-500 font-medium">Pay securely in cash at the time of delivery.</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === 'cod' ? 'border-red-600' : 'border-gray-600'}`}>
                  {selectedPaymentMethod === 'cod' && <div className="w-3 h-3 bg-red-600 rounded-full" />}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
              <button 
                onClick={handleBack} 
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> Back to Shipping
              </button>
              
              <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-6 py-3 rounded-2xl">
                <Lock size={14} className="text-green-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">End-to-End Encrypted</span>
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sticky Card */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
              <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6 border-b border-white/5 pb-4">Order Summary</h3>
              
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 no-scrollbar mb-6">
                {displayItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-800" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate uppercase">{item.name}</p>
                      <p className="text-[10px] text-gray-500 font-black italic">QTY: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <span className="text-xs font-black italic">₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-tighter text-[10px]">
                  <span>Subtotal</span>
                  <span className="text-white italic">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-tighter text-[10px]">
                  <span>GST (8%)</span>
                  <span className="text-white italic">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Grand Total</span>
                  <span className="text-3xl font-black italic text-white tracking-tighter">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                disabled={isProcessing}
                onClick={handleCompleteOrder}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black italic uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-red-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>Complete Order <ChevronRight size={18} /></>
                )}
              </button>
            </div>

            <div className="px-4 py-3 bg-green-600/5 border border-green-500/10 rounded-2xl flex items-center gap-3">
              <ShieldCheck size={20} className="text-green-500 flex-shrink-0" />
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-relaxed">
                Your payment is secure. We use industry-standard encryption to protect your data.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default PaymentPage;