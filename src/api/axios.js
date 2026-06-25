import axios from "axios";

const API_BASE_URL = "http://localhost:1000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT token if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Return response data directly for ease of use
    return response;
  },
  (error) => {
    console.error("API Error Interceptor:", error.response || error);
    
    // Auto logout if unauthorized (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      // Optional: window.location.href = "/login";
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
