import api from "../Api/AxiosInstance";

export const authService = {
  changePassword: async (data) => {
 
    const response = await api.post("/auth/Change-Password", data, { withCredentials: true });
    return response.data;
  },

  logout: async () => {
    return await api.post("/auth/logout", {}, { withCredentials: true });
  },

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email }, { withCredentials: true });
    return response.data;
  },

  resetPassword: async (resetData) => {
    const response = await api.post("/auth/reset-password", resetData, { withCredentials: true });
    return response.data;
  }
};