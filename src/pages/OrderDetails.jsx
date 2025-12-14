import React, { useEffect, useState, useContext } from "react";
import api from "../Api/AxiosInstance";
import { AuthContext } from "../Context/AuthContext";

const OrderDetails = () => {
  const { user } = useContext(AuthContext); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${user.id}`);
      // Filter out empty orders and use only orders with items
      const validOrders = (res.data.order || []).filter(
        (order) => order && order.items && order.items.length > 0
      );
      setOrders(validOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-900 to-gray-800 pt-20 pb-10 px-4">

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mt-25"></h1>
          {/* <p className="text-gray-600">Track and manage all your orders in one place</p> */}
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-600">Start shopping to see your orders here</p>
          </div>
        ) : (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {orders.map((order, index) => (
    <div
      key={order.orderId || index}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        Order #{index + 1}
                      </h2>
                      <p className="text-green-100 text-sm font-mono">{order.orderId}</p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          order.status === "SUCCESS" 
                            ? "bg-white text-green-600" 
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {order.status}
                      </span>
                      <p className="text-green-100 text-sm">
                        {new Date(order.date || order.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  {/* Products List */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Order Items
                    </h3>
                   <div className="max-h-96 overflow-y-auto space-y-4">
    {order.items.map((p) => (
      <div 
        key={p.id} 
        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
      >
                          <div className="flex-shrink-0">
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-20 h-20 object-cover rounded-lg shadow-md" 
                            />
                          </div>
                          <div className="flex-grow">
                            <p className="font-semibold text-gray-800 mb-1">{p.name}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-600">
                                Qty: <span className="font-medium text-gray-800">{p.quantity}</span>
                              </span>
                              <span className="text-gray-600">
                                Price: <span className="font-medium text-gray-800">₹{p.price}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="text-lg font-bold text-green-600">
                              ₹{p.price * p.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

               
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;