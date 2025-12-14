import React, { useEffect, useState } from "react";
import api from "../../Api/AxiosInstance";

function OrderAdmin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/users");
        console.log("Users fetched:", res.data);

        const allOrders = res.data.flatMap((user) => {
          return (user.order || []).map((order) => ({   ...order,   user: {     id: user.id,     name: `${user.firstName} ${user.lastName}`,     email: user.email,   }, }));
        });

        setOrders(allOrders);
        console.log("All orders:", allOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-indigo-700">
        📦 All Orders
      </h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-indigo-100 text-indigo-700 text-left">
              <th className="p-3 font-semibold">Order ID</th>
              <th className="p-3 font-semibold">User</th>
              <th className="p-3 font-semibold">Products</th>
              <th className="p-3 font-semibold">Total</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((o, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 font-medium text-gray-700">#{o.orderId}</td>
                  <td className="p-3">
                    <div>
                      <p className="font-semibold text-gray-800">{o.user.name}</p>
                      <p className="text-xs text-gray-500">{o.user.email}</p>
                    </div>
                  </td>
                  <td className="p-3">

                    {Array.isArray(o.items) && o.items.length > 0 ? (
                      <div className="space-y-2">
                        {o.items.map((p, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <img  src={p.image}  alt={p.name}  className="w-10 h-10 object-cover rounded-md border"/>
                            <span className="text-gray-700">

                              {p.name}{" "}
                              <span className="text-xs text-gray-500">
                                (x{p.quantity})
                            </span>
                            </span>
                            </div>
                        ))}
                      </div>

                    ) : (
                      <span className="text-gray-400 italic">No products</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold text-green-600">
                    ₹{o.amount}
                  </td>
                  <td className="p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        o.status === "Delivered" ? "bg-green-100 text-green-700" : o.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700" }`}>
                      {o.status}
                    </span>
                    
                  </td>
                  <td className="p-3 text-gray-600">
                    {new Date(o.date).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-500 italic"
                >
                  No orders found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderAdmin;
