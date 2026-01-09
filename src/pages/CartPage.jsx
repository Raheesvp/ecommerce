// src/Pages/CartPage.jsx
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Lock, Trash2 } from "lucide-react";
import { CartContext } from "../Context/CartContext";
import Swal from "sweetalert2";
import { AuthContext } from "../Context/AuthContext";

function CartPage() {
  const { cart, updateQuantity, removeFromCart,setCart,clearCart } = useContext(CartContext);



  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const estimatedTax = subtotal * 0.08;
  const total = subtotal + estimatedTax;
  const navigate = useNavigate();

const handleClearCart = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626', 
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, clear it!',
      background: '#1f2937', // Dark background for your theme
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await clearCart();
        Swal.fire({
          title: 'Cleared!',
          text: 'Your cart is now empty.',
          icon: 'success',
          background: '#1f2937',
          color: '#fff'
        });
      }
    });
  };


  // Hide scrollbar globally
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-900 to-gray-800 pt-20 pb-10 px-4">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 mt-10 ">
            {[
              { step: 1, label: "Cart", active: true },
              { step: 2, label: "Shipping", active: false },
              { step: 3, label: "Payment", active: false },
              { step: 4, label: "Confirmation", active: false },
            ].map((s, index) => (
              <React.Fragment key={s.step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${s.active ? "bg-red-600 text-black" : "bg-gray-200 text-black"
                      }`}
                  >
                    {s.step}
                  </div>
                  <span
                    className={`text-xs mt-1 ${s.active ? "text-red-600 font-semibold" : "text-gray-500"
                      }`}
                  >
                    {s.label}
                  </span>
                </div>
                {index < 3 && <div className="h-0.5 w-10 bg-gray-300 mt-3" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Cart Content */}
        {cart.length === 0 ? (
          <div className="text-center text-white py-12 mt-50">
            <p className="text-lg">Your Cart is Empty 🛒</p>
            <button
              onClick={() => navigate("/products")}
              className="mt-4 text-red-600 font-semibold hover:underline"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 bg-white shadow-sm rounded-xl p-5 h-[65vh] overflow-y-auto scrollbar-hide">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Shopping Cart</h2>
              <div className="space-y-3">
                     <button
                  onClick={handleClearCart}
                  className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 transition"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 rounded-xl p-3 hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-3 w-full md:w-auto">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-contain rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-black text-sm">
                          {item.name}
                        </h3>
                        {/* <p className="text-xs">
                          {item.size && (
                            <span className="text-black">Size: {item.size}</span>
                          )}
                         
                        </p> */}

                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center font-bold hover:bg-gray-200 transition"
                          >
                            -
                          </button>
                          <span className="mx-3 text-base  text-black font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center font-bold hover:bg-gray-200 transition"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 text-xs mt-2 hover:underline"
                        >
                          Remove
                        </button>
                   
                      </div>
                    </div>
                    <div className="mt-3 md:mt-0 text-base font-semibold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white shadow-sm rounded-xl p-5 h-[65vh] flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-3 text-gray-800">
                  Order Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Estimated Tax</span>
                    <span>${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-800 font-bold text-lg pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => navigate("/Shipping")}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition"
                >
                  Proceed to Shipping
                </button>
                <div className="mt-4 text-xs text-gray-600 space-y-1">
                  <p className="flex items-center">
                    <Check className="w-3.5 h-3.5 mr-2 text-green-500" />
                    Free shipping
                  </p>
                  <p className="flex items-center">
                    <Check className="w-3.5 h-3.5 mr-2 text-green-500" />
                    30-day return policy
                  </p>
                  <p className="flex items-center">
                    <Lock className="w-3.5 h-3.5 mr-2 text-gray-500" />
                    Secure checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
