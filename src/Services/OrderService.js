

import api from "../Api/AxiosInstance";


export const orderService = {

    getMyOrders: async () => {
    const response = await api.get("/orders/my-orders");

    return response.data;
  },

  //place order 

  placeOrder: async (orderData) => {
    const response = await api.post("/orders",orderData);
    return response.data;
  },

  getOrderById :async (id) =>{
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  cancelOrder :async (orderId)=>{
    const response = await api.post(`/orders/cancel/${orderId}`);
    return response.data;


},

  verifyPayment: async (paymentData) => {
  const response = await api.post("/orders/verify-payment", paymentData);
  return response.data;
},

directBuy :async (paymentData) =>{
  const response = await api.post("/orders/direct-buy",paymentData);
  return response.data;
}

}