import React, { useContext } from "react";
import { WishlistContext } from "../Context/WishlistContext";
import { CartContext } from "../Context/CartContext";
import ProductCard from "../Component/CartDesign";
import { useNavigate } from "react-router-dom";

function WishlistPage() {
  const { wishlist, addToWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const navigate = useNavigate()

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-20 pb-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-white"> Wishlist</h1>

      {wishlist.length === 0 ? (
        <div>
        <p className="text-gray-400 text-center mt-75">Your wishlist is empty.</p>
          <div className="flex justify-center mt-4">
  <button
    onClick={() => navigate("/products")}
    className="text-red-600 font-semibold hover:underline"
  >
    Continue Shopping
  </button>
</div>
</div>
        
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
  );
}

export default WishlistPage;
