import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingCart, Star, Heart, Shield, Truck, RotateCcw, Award, ArrowRight } from "lucide-react";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/WishlistContext";
import ProductCard from "../Component/CartDesign";
import { productService } from "../Services/ProductService";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const { addToCart, updateQuantity, cart } = useContext(CartContext);
  const { addToWishlist, wishlist } = useContext(WishlistContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

const itemsIncart = cart.find((item)=>item.id ===product?.id)

  // 🧩 Wishlist toggle
  const handleWishlist = () => {
    addToWishlist(product);
    setIsWishlisted(!isWishlisted);
  };

  // 🧩 Zoom functionality
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

  // 🧩 Fetch product + related products
  useEffect(() => {
    const loadProductPage = async () => {
      try {
        const [productData, relatedData] = await Promise.all([
          productService.getById(id),
          productService.getRelatedProducts(id),
        ]);

        setProduct(productData);
        setRelatedProducts(relatedData);

        window.scrollTo(0, 0);
        setSelectedImage(0);
        setQuantity(1);
      } catch (err) {
        console.error("Error loading product details", err);
        toast.error("Could not load product");
      }
    };

    loadProductPage();
  }, [id]);

  // ✅ SOLVED: Navigate to Shipping Page instead of calling API directly here
const handleBuyNow = () => {
  // 1. Security Check
  if (!user) {
    toast.warn("Please login to proceed with the purchase");
    navigate("/login");
    return;
  }

  // 2. Prepare the specific item data
  const checkoutItem = {
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity: quantity, // Uses the current local quantity state
    image: productImages[0],
    totalPrice: product.price * quantity
  };

  // 3. Navigate and pass the object
  // We use 'state' so this data isn't visible in the URL bar
  navigate("/shipping", { state: { buyNowItem: checkoutItem } });
};

//   const handleQuantityChange = (change) => {
//   setQuantity((prev) => {
//     const newQty = prev + change;
    
//     // 1. Lower bound check
//     if (newQty < 1) return 1;

//     // 2. Upper bound (Stock) check
//     if (newQty > product.stock) {
//       toast.error(`Only ${product.stock} items available in stock`);
//       return prev; // Don't increase
//     }

//     return newQty;
//   });

//   // Optional: Sync with cart if product already exists there
//   const itemInCart = cart.find((item) => item.id === product?.id);
//   if (itemInCart) {
//     updateQuantity(product.id, change);
//   }
// };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl text-gray-400">Loading Product...</p>
        </div>
      </div>
    );
  }

  const productImages = Array.isArray(product.images) 
    ? product.images 
    : [product.image || "https://via.placeholder.com/600x600"];

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 pb-10 px-4 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
          
          {/* 🖼️ Image Section */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="bg-white rounded-3xl shadow-lg p-8 overflow-hidden">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-contain transition-transform duration-300 group-hover:scale-105"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: isHovering ? "zoom-in" : "default" }}
                />

                {isHovering && (
                  <div
                    className="absolute top-0 left-full ml-4 w-96 h-96 border-4 border-white shadow-2xl rounded-3xl overflow-hidden pointer-events-none z-50 bg-white"
                    style={{
                      backgroundImage: `url(${productImages[selectedImage]})`,
                      backgroundSize: "300%",
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                )}

                <button
                  onClick={handleWishlist}
                  className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200"
                >
                  <Heart
                    size={20}
                    className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}
                  />
                </button>
              </div>
            </div>

            <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 ${
                    selectedImage === index ? "border-blue-500 shadow-lg" : "border-transparent"
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 🧾 Product Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">✓ In Stock</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">Fast Delivery</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight">{product.name}</h1>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={20} className={i < (product.rating || 4) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"} />
              ))}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">₹{product.price}</span>
              <span className="text-xl text-gray-500 line-through">₹{Math.floor(product.price * 1.3)}</span>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-gray-300 leading-relaxed">{product.description || "No description available."}</p>
            </div>

{/*             <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-600 rounded-full">
                <button onClick={() => handleQuantityChange(-1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded-l-full">-</button>
                <span className="w-12 text-center">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded-r-full">+</button>
              </div>
              <span className="ml-4 font-semibold text-lg">Total: ₹{(product.price * quantity).toFixed(2)}</span>
            </div> */}

            <div className="space-y-3 pt-4">
             <button
                onClick={itemsIncart ? () => navigate("/cartpage") : () => addToCart(product, quantity)}
                disabled={product.stock <= 0}
                className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all shadow-lg 
                  ${itemsIncart 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"} 
                  ${product.stock <= 0 && "bg-gray-600 cursor-not-allowed"}`}
              >
                {itemsIncart ? (
                  <>Go to Cart <ArrowRight size={24} /></>
                ) : (
                  <>
                    <ShoppingCart size={24} /> 
                    {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                  </>
                )}
              </button>
{/*               <button
                onClick={handleBuyNow}
                className="w-full bg-white text-gray-900 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all"
              >
                Buy Now
              </button> */}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-700">
              {[
                { icon: <Truck size={20} />, title: "Free Shipping", desc: "On orders over ₹500", color: "text-blue-400" },
                { icon: <RotateCcw size={20} />, title: "Easy Returns", desc: "30-day policy", color: "text-green-400" },
                { icon: <Shield size={20} />, title: "Secure Payment", desc: "100% encrypted", color: "text-purple-400" },
                { icon: <Award size={20} />, title: "Quality Assured", desc: "Premium materials", color: "text-yellow-400" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`${item.color}`}>{item.icon}</div>
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🧩 Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-700 pt-10">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="relative">
              <div className="px-8">
                <div id="relatedScroll" className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide">
                  {relatedProducts.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-64">
                      <ProductCard
                        product={item}
                        onAddToCart={addToCart}
                        onAddToWishlist={addToWishlist}
                        isInWishlist={isInWishlist}
                        viewMode="grid"
                        onClick={() => navigate(`/product/${item.id}`)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => document.getElementById("relatedScroll").scrollBy({ left: -300, behavior: "smooth" })}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-900 w-10 h-10 flex items-center justify-center rounded-full shadow-xl"
              >
                &#8592;
              </button>
              <button
                onClick={() => document.getElementById("relatedScroll").scrollBy({ left: 300, behavior: "smooth" })}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-900 w-10 h-10 flex items-center justify-center rounded-full shadow-xl"
              >
                &#8594;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;



