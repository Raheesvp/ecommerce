// src/Pages/CartPage.jsx
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Lock, Trash2, ShoppingBag, ArrowRight, Minus, Plus, ShieldCheck } from "lucide-react";
import { CartContext } from "../Context/CartContext";
import Swal from "sweetalert2";

function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const estimatedTax = subtotal * 0.08;
  const total = subtotal + estimatedTax;
  const navigate = useNavigate();

  const handleClearCart = () => {
    Swal.fire({
      title: 'Clear Cart?',
      text: "This will remove all professional items from your cart.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, clear it!',
      background: '#111',
      color: '#fff',
      customClass: {
        popup: 'rounded-[2rem] border border-white/10'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await clearCart();
        toast.success("Cart cleared successfully");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Step Indicator - Modern Minimalist */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-4 md:gap-8">
            {[
              { step: 1, label: "Cart", active: true },
              { step: 2, label: "Shipping", active: false },
              { step: 3, label: "Payment", active: false },
            ].map((s, index) => (
              <React.Fragment key={s.step}>
                <div className="flex flex-col items-center group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all duration-500 ${
                    s.active ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] rotate-3" : "bg-white/5 text-gray-600 border border-white/5"
                  }`}>
                    {s.step}
                  </div>
                  <span className={`text-[10px] mt-3 font-black uppercase tracking-widest ${s.active ? "text-red-500" : "text-gray-600"}`}>
                    {s.label}
                  </span>
                </div>
                {index < 2 && <div className="h-[2px] w-8 md:w-16 bg-white/5 mt-[-18px]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02] text-center">
            <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
              <ShoppingBag size={40} className="text-gray-700" />
            </div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Your bag is empty</h3>
            <p className="text-gray-500 mt-2 font-medium max-w-xs mx-auto mb-8">
              Don't leave the field empty-handed. Grab your gear now.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-10 py-4 bg-red-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-700 transition-all duration-300 shadow-xl shadow-red-900/20 flex items-center gap-3 group"
            >
              Continue Shopping <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* Left: Items List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Your <span className="text-red-600">Inventory</span></h2>
                <button
                  onClick={handleClearCart}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={14} /> Clear All
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4 no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="group bg-white/5 border border-white/5 rounded-3xl p-4 flex flex-col sm:flex-row items-center gap-6 hover:border-white/10 transition-all duration-300">
                    <div className="w-32 h-32 bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0 p-2 border border-white/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight leading-tight mb-1">{item.name}</h3>
                      <p className="text-red-500 font-black italic text-xl mb-4">₹{item.price}</p>
                      
                      <div className="flex items-center justify-center sm:justify-start gap-4">
                        <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/5">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-2 hover:text-red-500 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-2 hover:text-red-500 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="hidden sm:block text-right pr-4">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total</p>
                      <p className="text-lg font-black italic">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Summary Box */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 sticky top-28 backdrop-blur-xl">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 border-b border-white/5 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-tighter text-xs">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="text-white font-black italic text-sm">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-tighter text-xs">
                  <span>Shipping</span>
                  <span className="text-green-500 font-black italic text-sm underline decoration-green-500/30 underline-offset-4">FREE</span>
                </div>
                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-tighter text-xs pb-4 border-b border-white/5">
                  <span>Tax (8%)</span>
                  <span className="text-white font-black italic text-sm">₹{estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Total Payable</span>
                  <span className="text-4xl font-black italic text-white leading-none tracking-tighter">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate("/Shipping")}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black italic uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-red-900/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  Proceed To Shipping <ArrowRight size={18} />
                </button>
                
                <div className="pt-6 grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-[0.1em] text-[9px]">
                    <ShieldCheck size={16} className="text-green-500" /> Secure SSL Encrypted Checkout
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-[0.1em] text-[9px]">
                    <Lock size={16} className="text-gray-400" /> Verified Payment Processor
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Internal Styles for cleanup */}
      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default CartPage;