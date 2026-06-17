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
// RESPONSE INTERCEPTOR (OPTIONAL BUT USEFUL)
// ==========================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: handle global errors here
    if (error.response?.status === 401) {
      console.warn("Unauthorized - token may be invalid");
    }

    return Promise.reject(error);
  }
);

export default api;