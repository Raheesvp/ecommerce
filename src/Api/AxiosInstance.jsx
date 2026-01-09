import axios from "axios";

// 1. Move these OUTSIDE the interceptor so they persist
let setIsRefreshingRef = null;
let isRefreshing = false;
let failedQueue = [];

// Exported so AuthContext can "plug in" its setter
export const setRefreshHandler = (handler) => {
  setIsRefreshingRef = handler;
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: "https://localhost:57401/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const refreshClient = axios.create({
  baseURL: "https://localhost:57401/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If a refresh is already happening, wait for it
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      } 

      originalRequest._retry = true;
      isRefreshing = true;

      
      if (setIsRefreshingRef) setIsRefreshingRef(true);

      try {
        const res = await refreshClient.post("api/Auth/Refresh-Token", {});
        const newAccessToken = res.data.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        
        window.location.replace("/login"); 
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        if (setIsRefreshingRef) setIsRefreshingRef(false);
      }
    }
    return Promise.reject(error);
  }
);

export default api;