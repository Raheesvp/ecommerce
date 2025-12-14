import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "../Api/AxiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load from localStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [cartLength, setCartLength] = useState(0);

  // Keep cart length accurate and sync localStorage
  useEffect(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartLength(totalItems);
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Load cart from API when user logs in
  useEffect(() => {
    if (!user) {
      setCart([]);
      localStorage.removeItem("cart");
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await api.get(`/users/${user.id}`);
        setCart(res.data.cart || []);

        backendCart = backendCart.filter(item=>item.stock>0);
      } catch (err) {
        console.error("Error loading cart:", err);
      }
    };

    fetchCart();
  }, [user]);

  // Helper to sync backend
  const syncCartWithBackend = async (updatedCart) => {
    if (!user) return;
    try {
      await api.patch(`/users/${user.id}`, { cart: updatedCart });
    } catch (err) {
      console.error("Error syncing cart:", err);
    }
  };

  // Add to cart (prevent duplicate)
  const addToCart = (product, quantity = 1) => {

    if(product.stock<1){
      toast.error(`${product.name} is out of Stock`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      if (existing) {
        toast.info(`${product.name} is already in the cart`);
        return prevCart; 
      }

      const updatedCart = [...prevCart, { ...product, quantity }];
      syncCartWithBackend(updatedCart);
      toast.success(`${product.name} added to cart`);
      return updatedCart;
    });
  };

  // Update quantity
  const updateQuantity = (id, change) => {
     setCart((prevCart) => {
    const updated = prevCart
      .map((item) => {
        if (item.id === id) {
          // If stock not available → stop increase
          if (change > 0 && item.quantity >= item.stock) {
            toast.error("No more stock available");
            return item;
          }
          return { ...item, quantity: item.quantity + change };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
      syncCartWithBackend(updated);
      return updated;
    });
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const updated = prevCart.filter((item) => item.id !== id);
      syncCartWithBackend(updated);
      toast.info("Item removed from cart");
      return updated;
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    syncCartWithBackend([]);
    toast.info("Cart is empty now");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLength,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
