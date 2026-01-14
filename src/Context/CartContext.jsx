import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "./AuthContext";
import api from "../Api/AxiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { cartService } from "../Services/CartService";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const debounceTimer = useRef(null);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [cartLength, setCartLength] = useState(0);

  // Keep cart length accurate based on unique items (rows)
  useEffect(() => {
    setCartLength(cart.length);
    // Sync localStorage whenever cart changes (for guest users)
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, user]);

  const fetchCart = async () => {
    if (!user) return;

    try {
      const response = await cartService.getCart();
      const cartItems = response.data || response.result || response;

      const formatetedCart = cartItems.map((item) => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        stock: item.stock // Ensure stock is mapped for validation
      }));

      setCart(formatetedCart);
    } catch (err) {
      console.log("Error Loading Cart:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Restore guest cart from localStorage if user logs out
      const saved = localStorage.getItem("cart");
      setCart(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        await cartService.addToCart(product.id, quantity);
        // toast.success("Added To Cart");
        fetchCart();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to add item");
      }
    } else {
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        toast.info("Item Already in Cart");
        return;
      }
      const newItem = { 
        ...product, 
        quantity,
        id: product.id // ensure ID consistency
      };
      setCart([...cart, newItem]);
      // toast.success("Added To Cart");
    }
  };

  const updateQuantity = async (productId, change) => {
    const currentItem = cart.find((item) => item.id === productId);

    if (!currentItem) {
      console.error("Item Not Found in the Cart");
      return;
    }

    const newQuantity = currentItem.quantity + change;

    // Immediate Validations
    if (newQuantity < 1) return;
    if (change > 0 && currentItem.stock && newQuantity > currentItem.stock) {
      toast.warning("Not enough stock available");
      return;
    }

    // --- OPTIMISTIC UPDATE ---
    // Update local state immediately so UI is snappy
    const updated = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updated);

    if (user) {
      // --- DEBOUNCE LOGIC FOR AUTHENTICATED USER ---
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        try {
          await cartService.updateItem(productId, newQuantity);
          console.log(`✅ API Synced: Product ${productId} at Qty ${newQuantity}`);
        } catch (err) {
          console.error("❌ DEBOUNCED UPDATE FAILED!", err);
          var serverMessage = err.response?.data?.message || "Failed to sync quantity";
          toast.error(serverMessage);
       
          fetchCart();
        }
      }, 500); 
    } else {
     
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        await cartService.removeFromCart(productId);
        toast.info("Item Removed");
        fetchCart();
      } catch (err) {
        toast.error("Failed To Remove");
      }
    } else {
      const updated = cart.filter((item) => item.id !== productId);
      setCart(updated);
      toast.info("Item Removed");
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartService.clearCart();
        setCart([]);
      } catch (err) {
        console.log(err);
      }
    } else {
      setCart([]);
      localStorage.removeItem("cart");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
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