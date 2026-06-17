import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Assign points
export const assignPoints = async (data, token) => {
  const response = await axios.post(
    `${API_URL}/points`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Get points history for one user
export const getUserPoints = async (userId, token) => {
  const response = await axios.get(
    `${API_URL}/points/user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Get all points records
export const getAllPoints = async (token) => {
  const response = await axios.get(
    `${API_URL}/points`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Delete points record
export const deletePoints = async (id, token) => {
  const response = await axios.delete(
    `${API_URL}/points/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};