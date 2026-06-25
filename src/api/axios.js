import axios from "axios";

// With the Vite dev-server proxy configured (vite.config.js), all /mba/* requests
// are automatically forwarded from localhost:5173 → localhost:1000 (backend PORT in .env).
// Using an empty baseURL (same-origin) means the browser sends cookies automatically
// because the origin matches — no CORS issue and no need to worry about withCredentials + CORS.
//
// In production, replace the proxy with your deployed backend URL.
const axiosInstance = axios.create({
  baseURL: "",            // same-origin via Vite proxy in dev
  withCredentials: true,  // always send cookies (httpOnly JWT)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — no manual token needed; cookies are sent automatically.
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — global error handling + auto-logout on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data || error.message);

    if (error.response?.status === 401) {
      // Session expired or invalid cookie — clear stored user info
      localStorage.removeItem("user");
      // Optionally force redirect: window.location.href = "/login";
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
