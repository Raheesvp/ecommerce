import api from "../Api/AxiosInstance";

export const reviewService = {

  createReview: async (reviewData) => {
    try {
      const res = await api.post("/reviews", reviewData);
      return res.data; // returns Guid from backend
    } catch (error) {
      console.error("Error creating review", error);
      throw error;
    }
  },

//   getReviewsByProductId: async (productId) => {
//     try {
//       const res = await api.get(`/reviews/product/${productId}`);
//       return res.data;
//     } catch (error) {
//       console.error("Error fetching reviews", error);
//       throw error;
//     }
//   }

};