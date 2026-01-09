import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { wishlistService } from "../Services/WishlistService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();


  const wishlistLength = wishlist.length;


  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setWishlist([]);
        return;
      }

      try {

        const res = await wishlistService.getWishlist();
        setWishlist(res.data || []);
      } catch (err) {
        console.error("Error loading wishlist:", err);
      }
    };

    loadWishlist();
  }, [user]);


  const addToWishlist = async (product) => {
    if (!user) {
      toast.error("Please login to use the wishlist");
      navigate("/login");
      return;
    }


    const isAlreadyInWishlist = wishlist.find((item) => item.productId === product.id || item.id === product.id);
    if (isAlreadyInWishlist) {
      setWishlist((prev) => prev.filter((item) => (item.productId || item.id) !== product.id));
    } else {
      setWishlist((prev) => [...prev, product]);
    }
    try {

      const res = await wishlistService.toggleWishlist(product.id);

      toast.success(res.message);


    } catch (err) {
      console.error("Sync failed", err);
      toast.error("Failed to update wishlist");

    }
  };

  const removeFromWishlist = async (productId) => {
    await addToWishlist({ id: productId }); 
  };


  const clearWishlist = async () => {
    if (!user) return;

    try {
      setWishlist([]);

      await wishlistService.clearWishlist();
      toast.success("Wishlist cleared");
    } catch (err) {
      console.error("Clear failed", err);
      toast.error("Failed to clear wishlist");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistLength,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};