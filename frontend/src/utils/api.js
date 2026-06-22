import axios from "axios";

// ==========================
// BASE URL (DEV + PROD SAFE)
// ==========================
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ==========================
// AXIOS INSTANCE
// ==========================
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================
// REQUEST INTERCEPTOR
// ==========================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================
// RESPONSE INTERCEPTOR
// ==========================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: handle global errors here
    if (error.response?.status === 401) {
      console.warn("Unauthorized - token may be invalid");

      // Optional future use:
      // localStorage.removeItem("token");
      // localStorage.removeItem("user");
      // window.location.href = "/login";
    }

    console.error(
      "API Error:",
      error.response?.status,
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default api;