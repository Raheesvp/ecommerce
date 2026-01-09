import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { orderService } from "../../../Services/OrderService";
import { toast } from "react-toastify";

const ProfileOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend URL for images
  const BASE_URL = "https://localhost:5174"; 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getMyOrders();
        
        // Ensure we handle the array correctly
        const data = response.data || response;
        setOrders(Array.isArray(data) ? data : []);
        
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCancelOrder  = async (OrderId) =>{
    if(!window.confirm("Are You Sure You Want To Cancel This Order?"))  return ;

    try{
      await orderService.cancelOrder(OrderId);

      setOrders((prevOrders)=>
      prevOrders.map((ord)=>
      ord.id === OrderId ?  {...ord,status: "Cancelled"} :ord
       )
      );


        toast.success("Order Cancelled Successfully");

    }catch(err){
      console.error("Cancel Failed:",err);
      toast.error(err.response?.data?.message || "Failed  to Cancel Order");  
  }

  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full object-cover">
      <h2 className="text-2xl font-bold text-white mb-6">My Orders</h2>

      {!orders || orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-600">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id} // ✅ FIX 1: Use 'id', not 'orderId'
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* --- TOP HEADER --- */}
              <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100">
                <div>
                  {/* ✅ FIX 2: Use 'id' here too */}
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                    Order #{order.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Placed on{" "}
                    {/* ✅ FIX 3: Use 'orderDate' */}
                    {new Date(order.orderDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>


                <span
                  className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    order.status === "SUCCESS" || order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              {/* --- BODY: Product List --- */}
              <div className="p-6 space-y-6">
                {/* ✅ FIX 4: Use 'orderItems' (not 'items') */}
                {order.orderItems?.map((item, index) => {
                  console.log("order item ",item)
                  
                  // Logic for Image URLs
                  let imageUrl = item.imageUrl;
                  if (imageUrl && !imageUrl.startsWith("http")) {
                      imageUrl = `${BASE_URL}${imageUrl}`;
                  }

                  return (
                    <div key={index} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      
                      {/* PRODUCT IMAGE */}
                      <div className="relative flex-shrink-0 w-24 h-24 border rounded-xl overflow-hidden border-gray-700/50">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.productName || "Product"}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150?text=No+Img";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-xs">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* DETAILS */}
                      <div className="flex-grow">
                        <h4 className="text-lg font-bold text-gray-800">{item.productName || item.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md border border-gray-200">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* PRICE */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{item.price * item.quantity}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-500">₹{item.price} each</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* --- FOOTER: Total --- */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Amount</span>
                <span className="text-xl font-bold text-green-700">
                  ₹{order.totalAmount}
                </span>
              </div>
              <div className="flex gap-3">
    {/* Show Cancel button ONLY if order is not Delivered or already Cancelled */}
    {(order.status === "Pending" || order.status === "Processing") && (
      <button
        onClick={() => handleCancelOrder(order.id)}
        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
      >
        Cancel Order
      </button>
    )}
    
    <button 
       className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors"
       onClick={() => {/* Navigate to Details if needed */}}
    >
      View Details
    </button>
  </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileOrders;