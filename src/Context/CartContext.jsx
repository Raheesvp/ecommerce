import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "../Api/AxiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { cartService } from "../Services/CartService";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);


 
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [cartLength, setCartLength] = useState(0);

  // Keep cart length accurate and sync localStorage
  useEffect(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartLength(totalItems);
  }, [cart]);

  

    const fetchCart = async () => {
      if(!user) return ;
  
   
      try{
        const response = await cartService.getCart();
        console.log("API Data",response)

        const cartItems = response.data || response.result || response;

        const formatetedCart = cartItems.map(item=>({
          id:item.productId,
          name :item.name,
          price: item.price,
          image: item.image,
          quantity:item.quantity 
        }))

        setCart(formatetedCart);

      }catch(err){
        console.log("Error Loading Cart:",err)
      }
        };

        useEffect(()=>{
          if(user){
            fetchCart();
          }else{
            setCart([]);
          }
        },[user])


 
  const addToCart =async (product, quantity = 1) => {

    if(user){

      try{
        await cartService.addToCart(product.id,quantity);
        toast.success("Added To Cart");
        fetchCart();

      }catch(err){
          toast.error(err.response?.data?.message || "Failed to add item");
      }
    }else{
      const existing = cart.find((item)=>item.id === product.id);

      if(existing){
        toast.info("Item Already in Cart");
        return ;
      }
    }

    }
    
//update the quantity

    const updateQuantity = async (productId,change)=>{
      const currentItem  = cart.find(item=>item.id===productId);

      console.log("Current item ",currentItem)

      if(!currentItem) return ;

      const newQuantity = currentItem.quantity+change;

      if (change > 0 && currentItem.stock && newQuantity > currentItem.stock) {
      toast.warning(serverMessage);
      return;
      }

      if(newQuantity<1) return ;

      if(user){
        try{
          await cartService.updateItem(productId,newQuantity);
          fetchCart();
        }catch(err){

          console.error("❌ UPDATE FAILED!", err);
      var serverMessage = err.response?.data?.message || "Failed to update quantity";  toast.error(serverMessage);
 
        }
      }else{

        if (change > 0 && currentItem.stock && newQuantity > currentItem.stock) {
          toast.warning(serverMessage);
          return;
      }
        const updated = cart.map((item)=>{
         return item.id === productId? {...item,quantity:newQuantity}:item
        });
        setCart(updated);
        localStorage.setItem("cart",JSON.stringify(updated));
      }
    }


  //remove item 

  const removeFromCart = async (productId)=>{
    if(user){
      try{
        await cartService.removeFromCart(productId);
        toast.info("Item Removed");
        fetchCart();
      }catch(err){
        toast.error("Failed To Remove")
      }
    }else{
      const updated = cart.filter((item)=>item.id!==productId);
      setCart(updated);
      localStorage.setItem("cart",JSON.stringify(updated));
      toast.info("Item Removed");
    }
  }

  // Clear entire cart
  const clearCart = async ()=>{
    if(user){
      try{
        await cartService.clearCart();
        setCart([]);
        toast.info("Cart Cleared");
      }catch(err){
        console.log(err);
      }
    }else{
      setCart([]);
      localStorage.removeItem("cart");
      toast.info("Cart Cleared");
    }
  }

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
