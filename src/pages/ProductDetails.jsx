import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  Shield, 
  Truck, 
  RotateCcw, 
  Award, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  User,
  MessageSquare
} from "lucide-react";

// ✅ Lightbox Imports
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/WishlistContext";
import ProductCard from "../Component/CartDesign";
import { productService } from "../Services/ProductService";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // ✅ Lightbox State
  const [isOpen, setIsOpen] = useState(false);
  const [slides, setSlides] = useState([]);

  const { addToCart, cart } = useContext(CartContext);
  const { addToWishlist, wishlist } = useContext(WishlistContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const BASE_URL = "https://localhost:57401"; // Backend URL for images

  const itemsIncart = cart.find((item) => item.id === product?.id);

  // Logic: Open Lightbox with selected images
  const handleImageClick = (imageUrls, index) => {
    const formattedSlides = imageUrls.map(url => ({ src: `${BASE_URL}${url}` }));
    setSlides(formattedSlides);
    setIsOpen(true);
  };

  const handleWishlist = () => {
    addToWishlist(product);
    setIsWishlisted(!isWishlisted);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const isInWishlist = (prodId) =>
    wishlist ? wishlist.some((item) => item.id === prodId) : false;

  useEffect(() => {
    const loadProductPage = async () => {
      try {
        const [productData, relatedData, reviewData] = await Promise.all([
          productService.getById(id),
          productService.getRelatedProducts(id),
          productService.getReviewsByProductId(id)
        ]);

        setProduct(productData);
        setRelatedProducts(relatedData);
        setReviews(reviewData || []);

        window.scrollTo(0, 0);
        setSelectedImage(0);
        setQuantity(1);
      } catch (err) {
        console.error("Error loading product details", err);
        toast.error("Could not load product specifications");
      }
    };

    loadProductPage();
  }, [id]);

  useEffect(() => {
    if (product && product.id) {
      const savedIds = JSON.parse(localStorage.getItem("wolf_history_ids")) || [];
      const filteredIds = savedIds.filter(id => id !== product.id);
      const updatedIds = [product.id, ...filteredIds].slice(0, 10);
      localStorage.setItem("wolf_history_ids", JSON.stringify(updatedIds));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Syncing Specifications...</p>
      </div>
    );
  }

  const productImages = Array.isArray(product.images) 
    ? product.images 
    : [product.image || "https://via.placeholder.com/600x600"];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 font-sans selection:bg-red-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 🖼️ Image Gallery Section (LHS) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
              <div 
                className="relative aspect-square flex items-center justify-center p-8 overflow-hidden cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className={`w-full h-full object-contain transition-transform duration-500 ${isHovering ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}
                />

                {isHovering && (
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      backgroundImage: `url(${productImages[selectedImage]})`,
                      backgroundSize: "250%",
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                )}

                <div className="absolute top-8 left-8 flex flex-col gap-2">
                   <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-tighter shadow-lg">PRO GRADE</span>
                   {product.stock > 0 && (
                     <span className="bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-tighter backdrop-blur-md">IN STOCK</span>
                   )}
                </div>

                <button
                  onClick={handleWishlist}
                  className={`absolute top-8 right-8 w-12 h-12 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center shadow-2xl ${
                    isInWishlist(product.id) 
                    ? "bg-red-600 border-red-600 text-white scale-110" 
                    : "bg-black/40 border-white/10 text-white hover:bg-white hover:text-black"
                  }`}
                >
                  <Heart size={20} className={isInWishlist(product.id) ? "fill-current" : ""} />
                </button>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-white/5 p-2 ${
                    selectedImage === index ? "border-red-600 scale-105 shadow-lg shadow-red-900/20" : "border-white/5 opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* 🧾 Product Details Section (RHS) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28 h-fit">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-500">
                <Zap size={16} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Wolf Strategic Gear</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={14} className={i < (product.rating || 4) ? "fill-yellow-400 text-yellow-400" : "text-gray-700"} />
                  ))}
                  <span className="text-[10px] font-bold ml-2 text-gray-400">
                    {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "5.0"} / 5.0
                  </span>
                </div>
                <div className="h-4 w-[1px] bg-white/10"></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Model ID: {product.id.toString().slice(-6)}</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-black italic tracking-tighter">₹{product.price}</span>
                <span className="text-xl text-gray-500 line-through decoration-red-500/50">₹{Math.floor(product.price * 1.3)}</span>
                <span className="ml-auto bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1 rounded-md">SAVE 30%</span>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-10 font-medium">
                {product.description || "High-performance equipment optimized for tactical speed and durability."}
              </p>

              <div className="space-y-4">
                <button
                  onClick={itemsIncart ? () => navigate("/CartPage") : () => addToCart(product, quantity)}
                  disabled={product.stock <= 0}
                  className={`w-full group relative overflow-hidden py-5 rounded-2xl font-black italic uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl ${
                    itemsIncart 
                    ? "bg-white text-black hover:bg-gray-200" 
                    : "bg-red-600 text-white hover:bg-red-700 shadow-red-900/20"
                  } ${product.stock <= 0 && "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"}`}
                >
                  {itemsIncart ? (
                    <>GO TO BAG <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" /></>
                  ) : (
                    <>
                      <ShoppingCart size={20} className={product.stock <= 0 ? "opacity-20" : ""} /> 
                      {product.stock <= 0 ? "OUT OF STOCK" : "ADD TO CART"}
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Truck size={16} />, title: "Free Deployment", desc: "Above ₹500", color: "text-blue-500" },
                { icon: <RotateCcw size={16} />, title: "Return Protocol", desc: "30-Day Window", color: "text-green-500" },
                { icon: <ShieldCheck size={16} />, title: "Secure Checkout", desc: "SSL Encrypted", color: "text-purple-500" },
                { icon: <Award size={16} />, title: "Wolf Quality", desc: "Authorized Hub", color: "text-yellow-500" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className={`${item.color}`}>{item.icon}</div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tight text-white">{item.title}</p>
                    <p className="text-[8px] text-gray-500 font-bold uppercase">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ FIELD REPORTS SECTION (REVIEWS) */}
        <div className="mt-24 pt-16 border-t border-white/5">
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-red-600/10 p-3 rounded-2xl border border-red-600/20">
              <MessageSquare className="text-red-500" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Review <span className="text-red-600">Reports</span></h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Direct feedback from the front lines</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl hover:border-red-500/30 transition-all duration-500 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-600/20 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{rev.userName}</h4>
                        <div className="flex items-center gap-2">
                           <ShieldCheck size={12} className="text-green-500" />
                           <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Verified Buyer</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex text-red-600">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <span className="text-[9px] text-gray-600 font-bold uppercase">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed italic mb-6">"{rev.comment}"</p>

                  {/* ✅ User Images Gallery with Lightbox Trigger */}
                  {rev.imageUrls?.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {rev.imageUrls.map((img, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => handleImageClick(rev.imageUrls, idx)}
                          className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-black/40 p-1 group/img hover:border-red-600 transition-all cursor-zoom-in"
                        >
                          <img 
                            src={`${BASE_URL}${img}`} 
                            className="w-full h-full object-cover rounded-xl group-hover/img:scale-110 transition-transform duration-500" 
                            alt="Field Evidence"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
                <Info className="mx-auto text-gray-700 mb-4" size={32} />
                <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">No Reviews yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* 🧩 Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-white/5">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Recommended <span className="text-red-600">Loadout</span></h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Supplementary gear for your journey</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => document.getElementById("relatedScroll").scrollBy({ left: -300, behavior: "smooth" })}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-red-600 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => document.getElementById("relatedScroll").scrollBy({ left: 300, behavior: "smooth" })}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-red-600 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div id="relatedScroll" className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-6">
              {relatedProducts.map((item) => (
                <div key={item.id} className="flex-shrink-0 w-72">
                  <ProductCard
                    product={item}
                    onAddToCart={addToCart}
                    onAddToWishlist={addToWishlist}
                    isInWishlist={isInWishlist}
                    viewMode="grid"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ✅ LIGHTBOX COMPONENT */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .95)" } }}
      />

      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default ProductDetails;