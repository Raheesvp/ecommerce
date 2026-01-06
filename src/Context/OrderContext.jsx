import React, { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "../Api/AxiosInstance";
// Import the service object
import { orderService } from "../Services/OrderService";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  
  const [shippingDetails, setShippingDetails] = useState(
    user?.shippingaddress || {
      ReceiverName: "",
      MobileNumber: "",
      ShippingAddress: "",
      City: "",
      State: "",
      PinNumber: "",
    }
  );

  const [totalAmount, setTotalAmount] = useState(0);

  // 1. PLACE ORDER (Using the service)
// 1. PLACE ORDER
const placeFinalOrder = async (cartItems, total) => {
  const orderPayload = {
    ReceiverName: shippingDetails.ReceiverName || "Default Name",
    ShippingAddress: shippingDetails.ShippingAddress || "Default Address", // MUST BE > 10 chars
    City: shippingDetails.City || "Default City",
    State: shippingDetails.State || "Default State",
    PinNumber: String(shippingDetails.PinNumber || "000000"),
    MobileNumber: String(shippingDetails.MobileNumber || "0000000000"),
    PaymentMethod: "Online", 
    TotalPrice: total, 
    OrderItems: cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
  };

  try {
    // Use the orderService correctly
    const response = await orderService.placeOrder(orderPayload);
    // Return the integer ID from your ApiResponse
    return response.data; 
  } catch (err) {
    if (err.response && err.response.data.errors) {
      // This will show you exactly which field failed (e.g., ShippingAddress)
      console.error("VALIDATION FAILED:", err.response.data.errors);
      console.error("Place Order Error:", err.response?.data || err.message);
    }
    throw err;
  }
};

// 2. VERIFY PAYMENT
const verifyPaymentOnBackend = async (verificationData) => {
  try {
    // Fixed syntax: ensure parentheses are used for the function call
    const response = await orderService.verifyPayment(verificationData);
    return response;
  } catch (err) {
    console.error("PAYMENT VERIFICATION FAILED:", err.response?.data || err.message);
    throw err;
  }
};
  // 3. SAVE SHIPPING DETAILS
  const saveShippingDetails = async (details) => {
    setShippingDetails(details);
    if (user?.id) {
        try {
            await api.patch(`/users/${user.id}`, { shippingaddress: details });
        } catch (err) {
            console.warn("Could not persist shipping info to user profile.");
        }
    }
  };

  return (
    <OrderContext.Provider
      value={{
        shippingDetails,
        setShippingDetails: saveShippingDetails,
        totalAmount,
        setTotalAmount,
        placeFinalOrder,
        verifyPaymentOnBackend,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};