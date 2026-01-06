import api from "../Api/AxiosInstance"


export const cartService = {

    getCart:async()=>{
        const response = await api.get("/cart");
        return response.data;
    },

    addToCart :async (productId,quantity=1)=>{
        const response = await api.post(`/cart/add?productId=${productId}&quantitya=${quantity}`);
        return response.data;
    },

    updateItem :async (productId,quantity)=>{
       const response =  await api.put("/cart/update",{
            ProductId :productId,
            Quantity:quantity
        });
        return response.data;
    },

    removeFromCart :async (productId)=>{
        const response = await api.delete(`/cart/remove/${productId}`);
        return response.data;
    },

    clearCart:async()=>{
        const response = await api.delete("/cart/clear");
        return response.data;
    }






};