import axios from "axios";

/* ------------------------------------------------------------------
   Shared state (module-level, persists across requests)
------------------------------------------------------------------ */
let isRefreshing = false;
let failedQueue = [];
let setIsRefreshingRef = null;

/* Allow AuthContext (optional) to observe refresh state */
export const setRefreshHandler = (handler) => {
  setIsRefreshingRef = handler;
};

/* Resolve or reject all queued requests */
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

/* ------------------------------------------------------------------
   Axios instances
------------------------------------------------------------------ */
const api = axios.create({
  baseURL: "https://localhost:57401/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const refreshClient = axios.create({
  baseURL: "https://localhost:57401/api",
  withCredentials: true,
});

/* ------------------------------------------------------------------
   REQUEST INTERCEPTOR
------------------------------------------------------------------ */
api.interceptors.request.use(
  (config) => {
    // Do NOT attach Authorization header for refresh endpoint
    if (!config.url.includes("/Auth/Refresh-Token")) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------------------------------------------------------------
   RESPONSE INTERCEPTOR
------------------------------------------------------------------ */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response or not 401 → propagate error
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // NEVER retry refresh endpoint itself
    if (originalRequest.url.includes("Auth/Refresh-Token")) {
      return Promise.reject(error);
    }

    // Prevent infinite loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /* --------------------------------------------------------------
       If refresh already in progress, queue this request
    -------------------------------------------------------------- */
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

    /* --------------------------------------------------------------
       Start refresh flow
    -------------------------------------------------------------- */
    isRefreshing = true;
    if (setIsRefreshingRef) setIsRefreshingRef(true);

    try {
      // Call refresh endpoint (cookie-based)
      const res = await refreshClient.post("Auth/Refresh-Token");

      const newAccessToken = res.data?.data?.accessToken;
      if (!newAccessToken) throw new Error("No access token returned");

      // Persist new token
      localStorage.setItem("accessToken", newAccessToken);

      // Retry queued requests
      processQueue(null, newAccessToken);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);

    } catch (refreshError) {
      // Refresh failed → logout
      processQueue(refreshError, null);

      localStorage.clear();
      window.location.replace("/login");

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
      if (setIsRefreshingRef) setIsRefreshingRef(false);
    }
  }
);

export default api;
