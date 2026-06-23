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

    // 🔥 DEBUG (REMOVE LATER)
    console.log("➡️ API REQUEST:", config.method?.toUpperCase(), config.url);

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================
// RESPONSE INTERCEPTOR
// ==========================
api.interceptors.response.use(
  (response) => {
    // 🔥 DEBUG (REMOVE LATER)
    console.log("⬅️ API RESPONSE:", response.status, response.config.url);

    return response;
  },
  (error) => {
    console.error(
      "❌ API ERROR:",
      error.response?.status,
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      console.warn("Unauthorized - token invalid or expired");
    }

    return Promise.reject(error);
  }
);

export default api;