import axios from "axios";

// Primary instance for app requests
const api = axios.create({
  baseURL: "https://localhost:57401/api",
  withCredentials: true, // Required to send/receive session cookies
  headers: { "Content-Type": "application/json" },
});

// Instance specifically for refreshing tokens
const refreshClient = axios.create({
  baseURL: "https://localhost:57401/api",
  withCredentials: true, // CRITICAL: Allows browser to send the .AspNetCore.Session cookie
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor: Attach Access Token (JWT)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops if Login or Refresh themselves fail
    if (
      originalRequest.url.includes("/Auth/Login") ||
      originalRequest.url.includes("/Auth/Refresh-Token")
    ) {
      return Promise.reject(error);
    }

    // Check for 401 and ensure we haven't already tried to retry this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // We send an empty body {} because the backend reads the RefreshToken from the Session
        const res = await refreshClient.post("/Auth/Refresh-Token", {});

        // Extract the new access token from your ApiResponse structure
        const newAccessToken = res.data.data.accessToken;
        
        // Update LocalStorage
        localStorage.setItem("accessToken", newAccessToken);

        // Update the header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // If refresh fails, the session is dead. Clear everything and force login.
        console.error("Session expired, logging out...");
        localStorage.clear();
        window.location.replace("/login"); 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;