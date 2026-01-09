import React, { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "../Api/AxiosInstance";
import { orderService } from "../Services/OrderService";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

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

  const placeFinalOrder = async (backendItems, total, typedDetails) => {
    // 1. Extract data safely
    const rawData = typedDetails?.shippingAddress || typedDetails || shippingDetails;

    const orderPayload = {
      ReceiverName: String(rawData.ReceiverName || rawData.receiverName || "").trim(),
      MobileNumber: String(rawData.MobileNumber || rawData.mobileNumber || "").trim(),
      ShippingAddress: String(rawData.ShippingAddress || rawData.shippingAddress || "").trim(),
      City: String(rawData.City || rawData.city || "").trim(),
      State: String(rawData.State || rawData.state || "").trim(),
      PinNumber: String(rawData.PinNumber || rawData.pinNumber || "").replace(/\s/g, ""),
      PaymentMethod: "Online",
      TotalPrice: parseFloat(total),
      OrderItems: backendItems.map(item => ({
        ProductId: Number(item.ProductId || item.productId),
        Quantity: Number(item.Quantity || item.quantity)
      }))
    };

    if (orderPayload.PinNumber.length < 5) throw new Error("Pin Code must be at least 5 digits.");
    if (orderPayload.ShippingAddress.length < 10) throw new Error("Address must be at least 10 characters.");

    console.log("SENDING ORDER PAYLOAD:", orderPayload);

    try {
      const response = await orderService.placeOrder(orderPayload);
      console.log("BACKEND dfdf RESPONSE:", response);

      // EXTRACT ID SAFELY: Handles { id: 1 }, { data: { id: 1 } }, or just the ID number
      const id = 
            (response && typeof response === 'number') ? response : 
            (response?.id) ? response.id : 
            (response?.data?.id) ? response.data.id : 
            (response?.data && typeof response.data === 'number') ? response.data : 
            null;

        if (id === null || id === undefined || isNaN(Number(id))) {
            console.error("ID EXTRACTION FAILED. Server sent:", response);
            return null; // This triggers the error in PaymentPage
        }

        return Number(id); 
    } catch (err) {
        console.error("ORDER CREATION FAILED:", err.response?.data || err.message);
        throw err;
    }
  };

  const verifyPaymentOnBackend = async (verificationData) => {
    try {
      // Ensure keys are strictly PascalCase as per your C# DTO
      const response = await orderService.verifyPayment(verificationData);
      return response;
    } catch (err) {
      console.error("PAYMENT VERIFICATION FAILED:", err.response?.data || err.message);
      throw err;
    }
  };

  const saveShippingDetails = async (details) => {
    setShippingDetails(details);
    if (user?.id) {
      try {
        await api.patch(`/users/${user.id}`, { shippingaddress: details });
      } catch (err) {
        console.warn("Could not persist shipping info.");
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