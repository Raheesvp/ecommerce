import { useContext } from "react";
import { OrderContext } from "../../../Context/OrderContext";
import { WishlistContext } from "../../../Context/WishlistContext";
import { CartContext } from "../../../Context/CartContext";
import { Package, Heart, ShoppingCart } from "lucide-react";

const ProfileStats = () => {
  const { orders } = useContext(OrderContext);
  const { wishlist } = useContext(WishlistContext);
  const { cart } = useContext(CartContext);

  // Calculate counts safely
  const ordersCount = orders?.length || 0;
  const wishlistCount = wishlist?.length || 0;
  const cartCount = cart?.length || 0;

  const statItems = [
    { 
      label: "Deployments", 
      count: ordersCount, 
      icon: <Package size={18} />, 
      color: "text-blue-500",
      glow: "group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
    },
    { 
      label: "Watchlist", 
      count: wishlistCount, 
      icon: <Heart size={18} />, 
      color: "text-red-500",
      glow: "group-hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
    },
    { 
      label: "Loadout", 
      count: cartCount, 
      icon: <ShoppingCart size={18} />, 
      color: "text-emerald-500",
      glow: "group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]"
    },
  ];

  return (
    <div className="flex items-center justify-center gap-4 py-4 w-full">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className="group relative flex flex-col items-center gap-1 min-w-[70px]"
          title={item.label}
        >
          {/* Icon Orb */}
          <div className={`relative flex items-center justify-center w-12 h-12 rounded-full bg-black/40 border border-white/10 transition-all duration-300 group-hover:border-white/30 group-hover:-translate-y-1 ${item.glow}`}>
            <span className={`${item.color} group-hover:scale-110 transition-transform`}>
              {item.icon}
            </span>
            
            {/* Count Badge - Floating Top Right */}
            <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black italic w-5 h-5 flex items-center justify-center rounded-full border-2 border-black shadow-lg">
              {item.count}
            </div>
          </div>

          {/* Label - Tactical Style */}
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-300 transition-colors">
            {item.label}
          </span>

          {/* Bottom Active Indicator Line */}
          <div className="w-0 h-[1px] bg-red-600 group-hover:w-full transition-all duration-300 opacity-50" />
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;