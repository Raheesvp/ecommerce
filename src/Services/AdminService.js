import api from "../Api/AxiosInstance"


export const adminService = {

    //users section 
    getAllUsers : async ()=>{
        const response = await api.get("/admin/users");
        return response.data;
    },
    getUserById : async (id)=>{
        const response = await api.get(`/admin/${id}`);
        return response.data;
    },
    deleteUser :async (id)=>{
        const response = await api.delete(`/admin/${id}`);
        return response.data;
    },
    toggleBlockStatus :async (id)=>{
        const response = await api.put(`/admin/${id}/block-status`);
        return response.data;
    },
    getDeletedUsers :async ()=>{
        const response = await api.get("/admin/users/deleted");
        return response.data;
    },

    //order section 

   getOrdersAll: async () => {
    try {
        // Change from "/admin/orders/all" to "/orders/all"
        const response = await api.get("/orders/all"); 
        
   
        return response.data?.data || []; 
    } catch (error) {
        console.error("Error in getOrdersAll:", error);
        throw error;
    }
},

    changeOrderStatus :async(OrderId,newStatus)=>{
        const response = await api.put(`/orders/${OrderId}/status`,{ status:newStatus });
        return response.data;
    },

    //products section 

    createProduct: async (formData) => {
    const response = await api.post("/products/Create-Product-Admin", formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // Explicitly override
        }
    });
    return response.data;
},

   updateProduct: async (id, formData) => {
    // FIX: Add the headers object here just like in createProduct
    const response = await api.patch(`/products/Update/${id}`, formData, {
        headers: { 
            'Content-Type': 'multipart/form-data' 
        }
    });
    return response.data;
},

    deleteProduct :async(id)=>{
        const response = await api.delete(`/admin/${id}-Delete-Admin`);
        return response.data;
    },

    //dashboard service

    getDashBoardStats : async ()=>{
        const response = await api.get("/admin/dashboard-stats");
        return response.data;
    },

    //category service
    getAllCategories: async () => {
    const response = await api.get("/admin/categories");
    return response.data; 
  },

  createCategory: async (categoryData) => {
    const response = await api.post("/admin/categories", categoryData);
    return response.data; 
  },

 
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },





}