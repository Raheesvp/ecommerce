import { useContext } from "react";
import { OrderContext } from "../../../Context/OrderContext";
import { WishlistContext } from "../../../Context/WishlistContext";
import { CartContext } from "../../../Context/CartContext"; // 1. Import CartContext

const ProfileStats = () => {
  const { orders } = useContext(OrderContext);
  const { wishlist } = useContext(WishlistContext); // 2. Use wishlist array
  const { cart } = useContext(CartContext); // 3. Get cart array

  // Calculate counts safely
  const ordersCount = orders?.length || 0;
  const wishlistCount = wishlist?.length || 0;
  const cartCount = cart?.length || 0; // 4. Calculate cart length

  return (
    <div className="mt-6 bg-gray-800/50 rounded-xl p-5 text-sm text-gray-300 border border-gray-700/50 shadow-inner">
      <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">Account Activity</h3>
      
      <div className="space-y-3">
        {/* Orders Stat */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Total Orders</span>
          </div>
          <span className="font-bold text-white bg-gray-700 px-2 py-0.5 rounded-md min-w-[24px] text-center">
            {ordersCount}
          </span>
        </div>

        {/* Wishlist Stat */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            <span>Wishlist Items</span>
          </div>
          <span className="font-bold text-white bg-gray-700 px-2 py-0.5 rounded-md min-w-[24px] text-center">
            {wishlistCount}
          </span>
        </div>

        {/* Cart Stat */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span>Cart Items</span>
          </div>
          <span className="font-bold text-white bg-gray-700 px-2 py-0.5 rounded-md min-w-[24px] text-center">
            {cartCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;