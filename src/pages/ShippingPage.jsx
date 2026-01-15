import React, { useContext, useReducer, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import { CartContext } from "../Context/CartContext";
import { OrderContext } from "../Context/OrderContext";
import { MapPin, Phone, User, Navigation, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";

const initialState = {
  ReceiverName: "",
  MobileNumber: "",
  ShippingAddress: "",
  City: "",
  State: "",
  PinNumber: "",
  PaymentMethod: "COD"
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "LOAD_EXISTING":
      return { ...state, ...action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

function ShippingPage() {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { setShippingDetails } = useContext(OrderContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isSaved, setIsSaved] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const buyNowItem = location.state?.buyNowItem;

  useEffect(() => {
    if (!buyNowItem && cart.length === 0) {
      toast.error("No items found to checkout");
      navigate("/CartPage");
    }
  }, [buyNowItem, cart, navigate]);

  useEffect(() => {
    if (user?.shippingAddress) {
      dispatch({ type: "LOAD_EXISTING", payload: user.shippingAddress });
      setIsSaved(true);
    }
  }, [user]);

  const handleChange = (e) => {
    if (isSaved) setIsSaved(false);
    dispatch({
      type: "UPDATE_FIELD",
      field: e.target.name,
      value: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warn("Please log in first");
      navigate("/login");
      return;
    }

    try {
      await setShippingDetails(state);
      toast.success("Shipping Address Saved Successfully");
      setIsSaved(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to Save Shipping Address");
    }
  };

  const handleProceedToPayment = () => {
    if (!isSaved) {
      toast.error("Please save your shipping information before proceeding.");
      return;
    }

    const orderPayload = {
      isDirectBuy: !!buyNowItem,
      buyNowItem: buyNowItem,
      shippingAddress: state,
      totalAmount: total
    };

    navigate("/Payment", { state: orderPayload });
  };

  const subtotal = buyNowItem
    ? buyNowItem.price * buyNowItem.quantity
    : cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Step Indicator - Consistency with CartPage */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-4 md:gap-8">
            {[
              { step: 1, label: "Cart", active: true },
              { step: 2, label: "Shipping", active: true },
              { step: 3, label: "Payment", active: false },
            ].map((s, index) => (
              <React.Fragment key={s.step}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all duration-500 ${
                    s.step === 2 ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] rotate-3" : 
                    s.active ? "bg-red-600/20 text-red-500 border border-red-500/50" : "bg-white/5 text-gray-600 border border-white/5"
                  }`}>
                    {s.step === 1 ? <CheckCircle size={18} /> : s.step}
                  </div>
                  <span className={`text-[10px] mt-3 font-black uppercase tracking-widest ${s.step === 2 ? "text-red-500" : "text-gray-600"}`}>
                    {s.label}
                  </span>
                </div>
                {index < 2 && <div className={`h-[2px] w-8 md:w-16 mt-[-18px] ${s.step < 2 ? "bg-red-600/50" : "bg-white/5"}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Left: Shipping Form Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="bg-red-600 p-2 rounded-lg">
                <MapPin size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Shipping <span className="text-red-600">Details</span></h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 md:p-10 space-y-6 backdrop-blur-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Receiver Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input
                      type="text"
                      name="ReceiverName"
                      value={state.ReceiverName}
                      onChange={handleChange}
                      placeholder="Enter name"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:border-red-500/50 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Mobile Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input
                      type="tel"
                      name="MobileNumber"
                      value={state.MobileNumber}
                      onChange={handleChange}
                      placeholder="Contact number"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:border-red-500/50 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Full Shipping Address</label>
                <div className="relative group">
                  <Navigation className="absolute left-4 top-6 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
                  <textarea
                    name="ShippingAddress"
                    value={state.ShippingAddress}
                    onChange={handleChange}
                    placeholder="House No, Street, Landmark..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:border-red-500/50 transition-all font-medium min-h-[120px]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="text" name="City" value={state.City} onChange={handleChange} placeholder="City" className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-500/50 transition-all font-medium" required />
                <input type="text" name="State" value={state.State} onChange={handleChange} placeholder="State" className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-500/50 transition-all font-medium" required />
                <input type="text" name="PinNumber" value={state.PinNumber} onChange={handleChange} placeholder="Pincode" className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-500/50 transition-all font-medium" required />
              </div>

              <button
                type="submit"
                className={`w-full py-5 rounded-2xl font-black italic uppercase tracking-[0.2em] transition-all duration-300 ${
                  isSaved 
                  ? "bg-green-600/20 text-green-500 border border-green-500/30" 
                  : "bg-white text-black hover:bg-red-600 hover:text-white"
                }`}
              >
                {isSaved ? "✓ Information Saved" : "Save Shipping Info"}
              </button>
            </form>
          </div>

          {/* Right: Order Summary Sticky Card */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
              <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6 border-b border-white/5 pb-4">Package Summary</h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar mb-6">
                {buyNowItem ? (
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <img src={buyNowItem.image} alt={buyNowItem.name} className="w-14 h-14 rounded-xl object-cover bg-gray-800" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate uppercase">{buyNowItem.name}</p>
                      <p className="text-[10px] text-gray-500 font-black italic">QTY: {buyNowItem.quantity} × ₹{buyNowItem.price}</p>
                    </div>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-gray-800" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate uppercase">{item.name}</p>
                        <p className="text-[10px] text-gray-500 font-black italic">QTY: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                  ))
                )}
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
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Total</span>
                  <span className="text-3xl font-black italic text-white tracking-tighter">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                disabled={!isSaved}
                onClick={handleProceedToPayment}
                className={`w-full py-5 rounded-2xl font-black italic uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
                  isSaved 
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-red-900/20 active:scale-95" 
                  : "bg-gray-800 text-gray-600 cursor-not-allowed border border-white/5"
                }`}
              >
                Proceed to Payment <ArrowRight size={18} />
              </button>
            </div>

            <div className="px-4 space-y-3">
              <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-[0.1em] text-[9px]">
                <ShieldCheck size={16} className="text-green-500" /> Dispatch in 24 Hours
              </div>
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

export default ShippingPage;