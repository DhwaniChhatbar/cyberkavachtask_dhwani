import axios from "axios";
import API_BASE_URL from "../config/api";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;