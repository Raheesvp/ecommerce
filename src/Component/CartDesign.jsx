// src/components/ProductCard.jsx
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";

function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
  viewMode = "grid",
}) {
  const { cart = [], setCartLength } = useContext(CartContext);
  const navigate = useNavigate();

  if (!product) return null;

  const { stock = 0 } = product;

  // Logic preservation: Default actions if not passed via props
  const defaultOnAction = (p) => {
    console.log(`Action on: ${p.name}`);
    setCartLength((prev) => prev + 1);
  };
  const defaultIsInWishlist = (id) => id === "product-1";

  const actualOnAddToCart = onAddToCart || defaultOnAction;
  const actualOnAddToWishlist = onAddToWishlist || defaultOnAction;
  const actualIsInWishlist = isInWishlist || defaultIsInWishlist;

  const isOutOfStock = typeof product.stock === "number" && product.stock === 0;

  const getProductImage = (product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image) return product.image;
    if (product.imageUrl) return product.imageUrl;
    return "https://via.placeholder.com/300x400";
  };

  const isInCart = cart.some((item) => item.id === product.id);

  return (
    <div
      className={`group relative bg-gray-900 border border-white/10 overflow-hidden transition-all duration-500
        ${viewMode === "list"
          ? "flex flex-row items-center gap-6 p-4 rounded-2xl"
          : "flex flex-col rounded-3xl hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:-translate-y-2"
        }`}
    >
      {/* Image Container */}
      <div
        className={`relative cursor-pointer overflow-hidden bg-gray-800 ${
          viewMode === "grid" 
            ? "aspect-[4/5] w-full" 
            : "h-44 w-44 flex-shrink-0 rounded-xl"
        }`}
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Action Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isExtraSale && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter shadow-lg ring-1 ring-white/20">
              SALE
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-800/90 backdrop-blur-md text-gray-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter border border-white/10">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Floating Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            actualOnAddToWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 z-10 backdrop-blur-md
            ${actualIsInWishlist(product.id)
              ? "bg-red-500 text-white scale-110 shadow-red-500/50 shadow-lg"
              : "bg-black/40 text-white hover:bg-red-500 border border-white/10"
            }`}
        >
          <Heart
            size={18}
            className={actualIsInWishlist(product.id) ? "fill-current" : ""}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className={`flex flex-col p-5 ${viewMode === "list" ? "flex-1 justify-center" : "items-start"}`}>
        {/* Player/Category Tag */}
        {product.player && (
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1 opacity-80">
            {product.player}
          </span>
        )}

        {/* Product Title */}
        <h3
          className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2 cursor-pointer group-hover:text-red-400 transition-colors"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.name}
        </h3>

        {/* Price Area */}
        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-xl font-black text-white italic">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through decoration-red-500/50">
              ₹{product.originalPrice}
            </span>
          )}
          {product.discount && (
            <span className="ml-auto text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">
              {product.discount} OFF
            </span>
          )}
        </div>

        {/* Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isInCart) {
              navigate("/cartpage");
            } else if (!isOutOfStock) {
              actualOnAddToCart(product);
            }
          }}
          disabled={isOutOfStock}
          className={`w-full group/btn relative overflow-hidden px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300
            ${isOutOfStock
              ? "bg-gray-800 text-gray-600 cursor-not-allowed border border-white/5"
              : isInCart
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20"
            }`}
        >
          {isInCart ? (
            <>
              <span>Go to Cart</span>
              <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
            </>
          ) : (
            <>
              <ShoppingCart size={16} className={isOutOfStock ? "opacity-20" : ""} />
              <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;