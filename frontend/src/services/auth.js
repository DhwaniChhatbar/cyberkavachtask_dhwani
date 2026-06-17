
import api from "../utils/api";

// LOGIN
export const loginUser = async (data) => {
  return await api.post("/auth/login", data);
};

// REGISTER
export const registerUser = async (data) => {
  return await api.post("/auth/register", data);
};