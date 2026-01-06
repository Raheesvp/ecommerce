// ProductDetails.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../Api/AxiosInstance";
import { ShoppingCart, Star, Heart, Shield, Truck, RotateCcw, Award,
} from "lucide-react";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/WishlistContext";
import ProductCard from "../Component/CartDesign";
import { productService } from "../Services/ProductService";
import { toast } from "react-toastify";
import { orderService } from "../Services/OrderService";

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

  console.log("Product description:", product?.description);


  // 🧩 Wishlist toggle
  const handleWishlist = () => {
    addToWishlist(product);
    setIsWishlisted(!isWishlisted);
  };

  // 🧩 Zoom functionality
  const handleMouseMove = (e) => {
    console.log(e.clientX)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };




  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const isInWishlist = (id) =>
    wishlist ? wishlist.some((item) => item.id === id) : false;

  // 🧩 Fetch product + related products
 useEffect(() => {
  const loadProductPage = async () => {
    try {
      // 1. Fetch data from backend
      const [productData, relatedData] = await Promise.all([
        productService.getById(id),
        productService.getRelatedProducts(id)
      ]);

      // 2. Update state
      setProduct(productData);
      setRelatedProducts(relatedData);

      // 3. Reset UI states
      window.scrollTo(0, 0); // Scroll to top on new product
      setSelectedImage(0);
      setQuantity(1);
    } catch (err) {
      console.error("Error loading product details", err);
      toast.error("Could not load product");
    }
  };

  loadProductPage();
}, [id]); // This triggers whenever the URL ID changes

  const handleBuyNow = async () => {
  try {
    // 1. Call your new Direct Buy endpoint
    const response = await orderService.directBuy( {
      productId: product.id,
      quantity: quantity,
      shippingAddress: userAddress || "Please Update Address in Profile"
    });

    const orderId = response.data.data;

    
    const options = {
      key: "rzp_test_S0goOJJ0kMzST1",
      amount: product.price * selectedQuantity * 100,
      currency: "INR",
      order_id: orderId.razorpay_payment_id,
      handler: async function (response) {
 
        const  verifyPaymentOnBackend=({
          orderId: orderData.orderId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature
        });

        const  verification = await orderService.verifyPayment(verifyPaymentOnBackend);

        if(verification.statusCode ===200){
        navigate("/confirmation", { state: { orderId } });
      }
    }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    toast.error("Failed to initiate direct purchase");
  }
};
  // 🧩 Quantity update logic (syncs with Cart Context)
  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));

    const isInCart = cart.find((item) => item.id === product.id);
    if (isInCart) {
      updateQuantity(product.id, change);
    } else if (change > 0) {
      addToCart(product, 1); // auto-add if not in cart yet
    }
  };
console.log("Product description5:", product?.description);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Product...</p>
        </div>
      </div>
    );
  }


  const productImages = product.images
    ? Array.isArray(product.images)
      ? product.images
      : [product.images]
    : [product.image || "https://via.placeholder.com/600x600"];


  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 pb-10 px-4 text-white">
      <div className="max-w-7xl mx-auto px-4 pt-6 text-white">
        <nav className="text-sm text-gray-500 mb-4"></nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 🖼️ Image Section */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="bg-white rounded-3xl shadow-lg p-8 overflow-hidden mt-12">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-contain transition-transform duration-300 group-hover:scale-105"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: isHovering ? "zoom-in" : "default" }}
                />

                {/* Zoom Preview */}
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

                {/* Wishlist */}
                <button
                  onClick={handleWishlist}
                  className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200"
                >
                  <Heart
                    size={20}
                    className={
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600 hover:text-red-500"
                    }
                  />
                </button>
              </div>
            </div>

            <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedImage === index
                    ? "border-black shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
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
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mt-12">
                  ✓ In Stock
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mt-12">
                  Fast Delivery
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white leading-tight">
                {product.name}
              </h1>
            </div>

            {/* ⭐ Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.floor(product.rating ||3)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>

            {/* 💰 Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">
                ₹{product.price}
              </span>
              <span className="text-xl text-white line-through">
                ₹{Math.floor(product.price * 1.3)}
              </span>
              <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded-lg">
                {Math.floor((1 - product.price / (product.price * 1.3)) * 100)}%
                OFF
              </span>
            </div>

            {/* Product Description */}
  <div className="pt-4 border-t border-gray-700">
 

    <p className="text-gray-300 leading-relaxed">
      {product?.description || "No description available."}
    </p>
  </div>

            {/* 🔢 Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-white">Quantity:</span>
              <div className="flex items-center border-2 border-gray-200 rounded-full">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-full transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-full transition-colors text-white"
                >
                  +
                </button>
              </div>

              {/* Total price */}
              <span className="ml-4 font-semibold text-lg text-white">
                ₹{(product.price * quantity).toFixed(2)}
              </span>
            </div>

            {/* 🛒 Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <ShoppingCart size={24} />
                Add to Cart
              </button>

              <button
                onClick={handleBuy}
                className="w-full bg-gray-100 text-gray-900 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-200 transition-all duration-200"
              >
                Buy Now
              </button>
            </div>

            {/* ✅ Product Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 text-white">
              {[
                {
                  icon: <Truck size={20} className="text-blue-600" />,
                  title: "Free Shipping ",
                  desc: "On orders over ₹500",
                  bg: "bg-blue-100",
                },
                {
                  icon: <RotateCcw size={20} className="text-green-600" />,
                  title: "Easy Returns",
                  desc: "30-day return policy",
                  bg: "bg-green-100",
                },
                {
                  icon: <Shield size={20} className="text-purple-600" />,
                  title: "Secure Payment",
                  desc: "100% secure checkout",
                  bg: "bg-purple-100",
                },
                {
                  icon: <Award size={20} className="text-yellow-600" />,
                  title: "Quality Assured",
                  desc: "Premium materials",
                  bg: "bg-yellow-100",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-sm text-white">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* 🧩 Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-700 pt-10"> {/* Changed border-gray-200 to 700 for dark theme contrast */}
            <h2 className="text-2xl font-bold text-white mb-6"> {/* Changed text-gray-900 to text-white */}
              Related Products
            </h2>

            {/* NEW WRAPPER FOR ARROW POSITIONING */}
            <div className="relative">
              {/* The padding below creates space on the sides for the arrows.
                  We'll use negative margins/transforms on the arrows to sit them
                  in this space.
                */}
              <div className="px-8">
                <div
                  id="relatedScroll"
                  className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
                >

                  {relatedProducts.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-60 lg:w-[22%]"> {/* Using w-60 as a fixed size for better mobile scrolling */}
                      <ProductCard
                        product={item}
                        onAddToCart={addToCart}
                        onAddToWishlist={addToWishlist}
                        isInWishlist={isInWishlist}
                        viewMode="grid"

                    

                        // Ensure navigation works on the new card wrapper
                        onClick={() => navigate(`/product/${item.id}`)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() =>
                  document
                    .getElementById("relatedScroll")
                    .scrollBy({ left: -300, behavior: "smooth" })
                }
                // Adjusted positioning to be absolutely outside the content
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
                           bg-white text-blue-500 w-8 h-8 flex items-center justify-center rounded-full 
                           shadow-lg  hover:cursor-pointer"
              >
                &#8592;
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("relatedScroll")
                    .scrollBy({ left: 300, behavior: "smooth" })
                }
                // Adjusted positioning to be absolutely outside the content
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
                           bg-white text-blue-500 font-bold w-8 h-8 flex items-center justify-center rounded-full 
                           shadow-lg "
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
