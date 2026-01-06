// src/components/ProductCard.jsx
import { Heart, ShoppingCart } from "lucide-react";
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
  const { cart, setCartLength } = useContext(CartContext);
  const navigate = useNavigate();



  // Default actions if not passed via props
  const defaultOnAction = (p) => {
    console.log(`Action on: ${p.name}`);
    setCartLength((prev) => prev + 1);
  };
  const defaultIsInWishlist = (id) => id === "product-1";

  const actualOnAddToCart = onAddToCart || defaultOnAction;
  const actualOnAddToWishlist = onAddToWishlist || defaultOnAction;
  const actualIsInWishlist = isInWishlist || defaultIsInWishlist;


  console.log("stock ", product.stock);

  console.log(
  "stock value:", product.stock,
  "type:", typeof product.stock
);




  const isOutOfStock = typeof product.stock === "number" && product.stock === 0;

  const getProductImage = (product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image) {
      return product.image;
    }
    if (product.imageUrl) {
      return product.imageUrl;
    }
    return "https://via.placeholder.com/300x400";
  };




  // Check if product is already in cart
  const isInCart = cart.some((item) => item.id === product.id);

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 group
        ${viewMode === "list"
          ? "flex items-center gap-6 p-4"
          : "hover:shadow-xl hover:-translate-y-1 border border-gray-100"
        }`}
    >
      {/* Image Section */}
      <div
        className={`relative cursor-pointer overflow-hidden ${viewMode === "grid"
          ? "aspect-[3/4] w-full "
          : "h-40 w-40 flex-shrink-0 rounded-lg"
          } bg-gray-50 transition-all duration-300`}
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            actualOnAddToWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10
            ${actualIsInWishlist(product.id)
              ? "bg-red-500 text-white shadow-md"
              : "bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 shadow-sm"
            } hover:scale-110`}
        >
          <Heart
            size={18}
            className={actualIsInWishlist(product.id) ? "fill-current" : ""}
          />
        </button>

        {/* Sale Badge */}
        {product.isExtraSale && (
          <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg uppercase tracking-wider shadow-md">
            Extra 50% OFF
          </div>
        )}
      </div>

      {/* Details Section */}
      <div
        className={`pt-2 pb-4 flex flex-col items-center ${viewMode === "list" ? "flex-1" : "px-2"
          }`}
      >
        {/* Product Name */}
        <h3
          className="font-semibold text-gray-900 text-center mt-2 mb-1 text-sm uppercase tracking-wide cursor-pointer hover:text-blue-700 transition-colors line-clamp-2"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.name}
        </h3>

    


        {/* Optional Player or Team */}
        {product.player && (
          <span className="text-xs text-gray-500 mb-1">{product.player}</span>
        )}

        {/* Price Section */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-bold text-red-600">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          {product.discount && (
            <span className="text-xs font-semibold text-red-600 block mt-1">
              {product.discount} OFF
            </span>
          )}
        </div>

        {/* Add to Cart / Go to Cart Button */}
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
          className={`
    w-full text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2
    text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg
    transform hover:scale-[1.02]

    ${isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : isInCart
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"}
  `}
        >
          <ShoppingCart size={16} />
          {isOutOfStock
            ? "Out of Stock"
            : isInCart
              ? "Go to Cart"
              : "Add to Cart"}
        </button>


      </div>
    </div>
  );
}

export default ProductCard;
