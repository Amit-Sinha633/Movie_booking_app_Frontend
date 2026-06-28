import axios from "axios";

// VITE_API_URL is set to "" in .env.development → the Vite dev-server proxy
// intercepts every /mba/* request and tunnels it to localhost:1000 (backend),
// so local development works exactly as before.
//
// In production (Netlify), VITE_API_URL is baked into the bundle from
// .env.production = "https://movie-booking-app-topaz-eight.vercel.app"
// so all API calls are sent directly to the deployed Vercel backend.
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",  // "" in dev (proxy), Vercel URL in prod
  withCredentials: true,  // always send cookies (httpOnly JWT) — required for cross-origin auth
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

console.log("API URL:", import.meta.env.VITE_API_URL);
export default axiosInstance;
