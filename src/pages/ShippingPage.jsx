// src/Pages/ShippingPage.jsx
import React, { useContext, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Api/AxiosInstance";
import { AuthContext } from "../Context/AuthContext";
import { CartContext } from "../Context/CartContext";
import { OrderContext } from "../Context/OrderContext";

const initialState = {
  firstname: "",
  lastname: "",
  emailaddress: "",
  mobileno: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  postalcode: "",
  country: "",
  shippingMethod: "standard",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

function ShippingPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const {deductStockAfterOrder}=useContext(OrderContext);


  const navigate = useNavigate();
  const location = useLocation();
  const { product, quantity } = location.state || {};

  const handleChange = (e) =>
    dispatch({ type: "UPDATE_FIELD", field: e.target.name, value: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warn("User not logged in");
      return;
    }
    try {
      await api.patch(`/users/${user.id}`, { shippingaddress: state });
      toast.success("Shipping Address Saved Successfully");
      setIsSaved(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to Save Shipping Address");
      navigate('/login')
      toast.success('login first')
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800  pb-10 px-4 pt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="flex justify-center ">
          <div className="flex items-center space-x-4 mt-8">
            {[
              { step: 1, label: "Cart", active: true },
              { step: 2, label: "Shipping", active: true },
              { step: 3, label: "Payment", active: false },
              { step: 4, label: "Confirmation", active: false },
            ].map((s, index) => (
              <React.Fragment key={s.step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      s.active ? "bg-red-600 text-white" : "bg-gray-700 text-gray-400 border border-gray-600"
                    }`}
                  >
                    {s.step}
                  </div>
                  <span className={`text-xs mt-1 ${s.active ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                    {s.label}
                  </span>
                </div>
                {index < 3 && <div className="h-0.5 w-16 bg-gray-700 mt-3" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
          {/* Left: Shipping Form */}
          <div className="md:col-span-2 bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstname"
                  value={state.firstname}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
                <input
                  type="text"
                  name="lastname"
                  value={state.lastname}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="emailaddress"
                  value={state.emailaddress}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
                <input
                  type="tel"
                  name="mobileno"
                  value={state.mobileno}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <input
                type="text"
                name="address"
                value={state.address}
                onChange={handleChange}
                placeholder="Street Address"
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
              <input
                type="text"
                name="apartment"
                value={state.apartment}
                onChange={handleChange}
                placeholder="Apartment, suite, etc. (optional)"
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  value={state.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
                <input
                  type="text"
                  name="state"
                  value={state.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
                <input
                  type="text"
                  name="postalcode"
                  value={state.postalcode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <input
                type="text"
                name="country"
                value={state.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />

              {/* Save Button */}
              <button
                type="submit"
                className={`w-full py-3 rounded-lg font-semibold ${
                  isSaved ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"
                }`}
                disabled={isSaved}
              >
                {isSaved ? "Shipping Information Saved" : "Save Shipping Information"}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
         <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between h-full text-gray-800">
  <h3 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h3>

  {/* Scrollable list */}
  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
    {product ? (
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={product.image || "https://via.placeholder.com/60"}
            alt={product.name}
            className="w-16 h-16 rounded object-cover border border-gray-200"
          />
          <div>
            <p className="font-medium text-gray-800">{product.name}</p>
            <p className="text-sm text-gray-500">Qty: {quantity}</p>
          </div>
        </div>
        <p className="font-semibold text-gray-800">₹{(product.price * quantity).toFixed(2)}</p>
      </div>
    ) : (
      cart.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={item.image || "https://via.placeholder.com/60"}
              alt={item.name}
              className="w-16 h-16 rounded object-cover border border-gray-200"
            />
            <div>
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
          </div>
          <p className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
        </div>
      ))
    )}
  </div>

  {/* Total & Proceed button */}
  <div className="mt-4 border-t border-gray-200 pt-4">
    <div className="flex justify-between font-bold text-lg text-gray-900">
      <span>Total</span>
      <span>₹{total.toFixed(2)}</span>
    </div>
    <button
      className={`w-full mt-4 py-3 rounded-lg font-semibold ${
        isSaved ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"
      }`}
      disabled={!isSaved}
      onClick={() => navigate("/Payment", { state: { product, quantity, cart } })}
    >
      Proceed to Payment
    </button>
  </div>
</div>

        </div>
      </div>
    </div>
  );
}

export default ShippingPage;
