import React, { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "../Api/AxiosInstance";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);

  const [shippingDetails, setShippingDetails] = useState(
    user?.shippingaddress || {
      name: "",
      address: "",
      phone: "",
      city: "",
      pincode: "",
    }
  );



  const [totalAmount, setTotalAmount] = useState(0);

  const deductStockAfterOrder = async (cartItems) => {
    try {
      for (const item of cartItems) {
        // 1. Get latest product details
        const response = await api.get(`/products/${item.id}`);
        const product = response.data;

        // 2. Check if stock exists
        if (product.stock < item.quantity) {
          console.warn(`Not enough stock for: ${product.name}`);
          continue;
        }

        // 3. New stock value
        const newStock = product.stock - item.quantity;

        // 4. Update stock in backend
        await api.patch(`/products/${item.id}`, { stock: newStock });
      }

      console.log("Stock successfully updated after order");
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };



  const saveShippingDetails = async (details) => {
   try {

    const response = await api.patch(`/users/${user.id}`, {
      shippingaddress: details,
    });

    const UpdatedUser = response.data;
  

      // const updatedUser = await res.json();

      setShippingDetails(details);
      setUser(UpdatedUser);
      localStorage.setItem("user", JSON.stringify(UpdatedUser));
    } catch (err) {
      console.error("Error saving shipping details:", err);
    }
  };

  const addCartPayment = (paymentId, amount) => {
    console.log("Cart Payment Success:", { paymentId, amount });
  };

  const addBuyNowPayment = (paymentId, amount, productId) => {
    console.log("Buy Now Payment Success:", { paymentId, amount, productId });
  };

  return (
    <OrderContext.Provider
      value={{
        shippingDetails,
        setShippingDetails: saveShippingDetails, 
        totalAmount,
        setTotalAmount,
        addCartPayment,
        addBuyNowPayment,
        deductStockAfterOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
