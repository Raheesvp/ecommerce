import React, { useContext, useReducer, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Api/AxiosInstance";
import { AuthContext } from "../Context/AuthContext";
import { CartContext } from "../Context/CartContext";
import { OrderContext } from "../Context/OrderContext";

const initialState = {
  ReceiverName: "",
  Mobileno: "",
  ShippingAddress: "",
  City: "",
  State: "",
  PinNumber: "",
  PaymentMethod :"COD"

 
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "LOAD_EXISTING":
      return { ...state, ...action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

function ShippingPage() {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { setShippingDetails } = useContext(OrderContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isSaved, setIsSaved] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { product, quantity } = location.state || {};

  // Load existing address if user has one saved
  useEffect(() => {
    if (user?.shippingAddress) {
      dispatch({ type: "LOAD_EXISTING", payload: user.shippingaddress });
      setIsSaved(true);
    }
  }, [user]);

  const handleChange = (e) =>{
    console.log(`Field:${e.target.name} | value :${e.target.value}`)
    if(isSaved) setIsSaved(false)
    dispatch({
       type: "UPDATE_FIELD", 
       field: e.target.name,
        value: e.target.value
       });
      }

  // 1. Save Address to Backend User Profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Saving Shipping Address To Backend",state)
    if (!user) {
      toast.warn("Please log in first");
      navigate("/login");
      return;
    }

    try {
      // Updates user profile in DB and Global Context via OrderContext helper
      await setShippingDetails(state); 
      toast.success("Shipping Address Saved Successfully");
      setIsSaved(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to Save Shipping Address");
    }
  };

  // 2. Prepare Payload and Navigate to Payment
  const handleProceedToPayment = () => {
    if (!isSaved) {
      toast.error("Please save your shipping information before proceeding.");
      return;
    }

    const orderPayload = {
      // This structure should match your C# 'CreateOrderRequest' DTO
      orderItems: product 
        ? [{ productId: product.id, quantity: quantity }] 
        : cart.map(item => ({ productId: item.id, quantity: item.quantity })),
      shippingAddress: state, 
      totalAmount: total
    };

    navigate("/Payment", { state: orderPayload });
  };

  // Calculations
  const subtotal = product 
    ? product.price * quantity 
    : cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-10 px-4 pt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 mt-10">
            {[
              { step: 1, label: "Cart", active: true },
              { step: 2, label: "Shipping", active: true },
              { step: 3, label: "Payment", active: false },
              { step: 4, label: "Confirmation", active: false },
            ].map((s, index) => (
              <React.Fragment key={s.step}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      s.active ? "bg-red-600 text-white" : "bg-gray-700 text-gray-400 border border-gray-600"
                    }`}>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
          {/* Left: Shipping Form */}
          <div className="md:col-span-2 bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="ReceiverName" // Matches initialState
                value={state.ReceiverName}
                onChange={handleChange}
                placeholder="Receiver Name"
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />

        
               
                <input
                  type="tel"
                  name="MobileNumber"
                  value={state.MobileNumber}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
          

              <input
                type="text"
                name="ShippingAddress"
                value={state.ShippingAddress}
                onChange={handleChange}
                placeholder="Address"
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="text" name="City" value={state.City} onChange={handleChange} placeholder="City" className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600" required />
                <input type="text" name="State" value={state.State} onChange={handleChange} placeholder="State" className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600" required />
                <input type="text" name="PinNumber" value={state.PinNumber} onChange={handleChange} placeholder="Postal Code" className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600" required />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  isSaved ? "bg-green-600 text-white cursor-default" : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isSaved ? "✓ Address Saved" : "Save Shipping Information"}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between h-full text-gray-800">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {product ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded object-cover border" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{(product.price * quantity).toFixed(2)}</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover border" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <button
                className={`w-full mt-4 py-3 rounded-lg font-semibold transition-colors ${
                  isSaved ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                disabled={!isSaved}
                onClick={handleProceedToPayment}
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