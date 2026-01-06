
import { data } from "react-router-dom";
import api from "../Api/AxiosInstance";


export const productService = {

    getAllProducts: async () => {
    const response = await api.get("/products");

    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct :async (data) =>{
    const response = await api.post(`/products`,data);
    return response.data;
  },

  updateProduct :async (id,data)=>{
    const response = await api.put(`/products/${id}`,data);
    return response.data;
  },
  
  removeProduct :async (id)=>{
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
  getProductByFilter :async(params) =>{
    const response = await api.get("/products/Filtered-Products",{ params});
      return response.data;
  

  },
  searchProducts :async (query) =>{
    try{
      const response = await api.get(`/products/search?query=${query}`);
      return response.data.data;
    }catch(error){
      console.log("Search API response",error);
      throw error;
    }
  },
  getProductDetails :async (id)=>{
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  },

  getById:async (id) =>{
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  },

  getRelatedProducts:async(id)=>{
    const res = await api.get(`/products/${id}/related`);
    return res.data.data;
  }







};
