import React, { useState, useEffect } from "react";
import { ShoppingBag, Star, ArrowRight } from "lucide-react";
import { productService } from "../../Services/ProductService";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await productService.getFeaturedProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load featured products", err);
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px] text-white italic animate-pulse">
      LOADING ELITE KITS...
    </div>
  );

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header: Stacks on mobile, side-by-side on tablet+ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-red-600 mb-3">
              <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              <span className="text-xs md:text-sm font-black tracking-widest uppercase italic">2026 Season</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white italic uppercase leading-none">
              Featured <span className="text-red-600">Jerseys</span>
            </h2>
          </div>
          <button className="self-center md:self-end text-gray-400 hover:text-red-500 font-bold text-xs md:text-sm flex items-center gap-2 transition-all group tracking-tighter">
            VIEW ALL COLLECTIONS 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Responsive Grid System:
            1 col on mobile (<640px)
            2 cols on small tablets (sm: 640px+)
            3 cols on laptops (lg: 1024px+)
            4 cols on wide screens (xl: 1280px+) 
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group relative bg-gray-900/50 rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 hover:border-red-600/30 transition-all duration-500 shadow-xl flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={product.image || product.images}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Responsive Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 md:top-5 md:left-5 bg-red-600 text-white text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-full tracking-widest uppercase italic shadow-lg">
                    {product.badge}
                  </span>
                )}

                {/* Desktop-Only Hover Overlay (Hidden on touch devices) */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center">
                   <button className="bg-white text-black px-5 py-3 rounded-xl font-black italic text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform hover:bg-red-600 hover:text-white transition-colors">
                     <ShoppingBag className="w-4 h-4" /> QUICK ADD
                   </button>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-5 md:p-7 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-red-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1 italic">
                    {product.category || "Club Kit"}
                  </p>
                  <h3 className="text-lg md:text-xl font-black text-white mb-3 uppercase italic leading-tight group-hover:text-red-500 transition-colors">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xl md:text-2xl font-black text-white italic">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-600 line-through font-bold">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  {/* Mobile-Friendly Shopping Button (visible on all screens) */}
                  <button className="md:hidden bg-red-600 p-2 rounded-lg text-white">
                    <ShoppingBag className="w-5 h-5" />
                  </button>

                  <div className="hidden md:flex items-center gap-1 text-yellow-500">
                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                    <span className="text-white text-xs md:text-sm font-black italic">{product.rating || "5.0"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;