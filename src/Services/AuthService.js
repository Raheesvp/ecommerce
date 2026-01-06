import { Form } from "react-router-dom";
import api from "../Api/AxiosInstance";



export const authService = {

    changePassword: async (data) => {
       
    
        const response = await api.post("/auth/Change-Password",data);
        return response.data;

  },

  logout:async ()=>{
    return await api.post("/auth/logout");
  }

}