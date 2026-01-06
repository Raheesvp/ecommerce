
// import  } from "../../../Context/WishlistContext";

import { useContext } from "react";
import { OrderContext } from "../../../Context/OrderContext";
import { WishlistContext } from "../../../Context/WishlistContext";





const ProfileStats = () => {

  const {orders} = useContext(OrderContext);

  const {wishlistLength} = useContext(WishlistContext);

  const ordersCount = orders?.length || 0;
  const wishlistCount = wishlistLength ||0;
  
  return (
    <div className="mt-6 bg-gray-800 rounded-lg p-4 text-sm text-gray-300">
      <div className="flex justify-between">
        <span>Orders</span>
        <span className="font-semibold">{ordersCount}</span>
      </div>
      <div className="flex justify-between mt-2">
        <span>Wishlist</span>
        <span className="font-semibold">{wishlistCount}</span>
      </div>
    </div>
  );
};

export default ProfileStats;
