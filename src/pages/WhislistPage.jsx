import React, { useContext } from "react";
// ✅ Corrected Named Import
import { WishlistContext } from "../Context/WishlistContext";
import { CartContext } from "../Context/CartContext";
import ProductCard from "../Component/CartDesign"; 
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";

function WishlistPage() {
  const { wishlist, addToWishlist, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-500/30">
      
      {/* Premium Header - Matching Armory Style */}
      <div className="relative pt-32 pb-12 px-4 border-b border-white/5 bg-gradient-to-b from-red-900/10 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-red-500">
              <Heart size={18} fill="currentColor" className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Personal Armory</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              Your <span className="text-red-600">Wishlist</span>
            </h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:border-red-600 transition-all duration-300"
            >
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {wishlist.length === 0 ? (
          /* High-End Empty State */
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02] text-center">
            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
              <ShoppingBag size={32} className="text-gray-700" />
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">No gear saved yet</h3>
            <p className="text-gray-500 mt-2 font-medium max-w-xs mx-auto mb-8">
              Explore the professional collection and save your favorites for later.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-10 py-4 bg-red-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-700 transition-all duration-300 shadow-xl shadow-red-900/20 flex items-center gap-3 group"
            >
              Start Shopping <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          /* Responsive Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onAddToWishlist={addToWishlist}
                isInWishlist={isInWishlist}
                viewMode="grid"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;