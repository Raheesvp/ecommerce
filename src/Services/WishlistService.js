import api from "../Api/AxiosInstance"


export const wishlistService =  {

    toggleWishlist :async(productId)=>{
        const response = await api.post(`/wishlist/toggle/${productId}`);
        return response.data;
    },

    getWishlist :async()=>{
        const response = await api.get("/wishlist");
        return response.data;
    },

    clearWishlist :async ()=>{
        const response = await api.delete("/wishlist/clear");
        return response.data;
    }
}