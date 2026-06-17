import api from "../utils/api";

// CREATE REQUEST
export const createRequest = async (data) => {
  return await api.post("/requests", data);
};

// GET ALL REQUESTS
export const getRequests = async () => {
  return await api.get("/requests");
};

// GET MY REQUESTS
export const getMyRequests = async () => {
  return await api.get("/requests/my");
};

// APPROVE REQUEST
export const approveRequest = async (id, data) => {
  return await api.put(`/requests/approve/${id}`, data);
};

// REJECT REQUEST
export const rejectRequest = async (id, data) => {
  return await api.put(`/requests/reject/${id}`, data);
};