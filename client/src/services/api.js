import axios from "axios";

export const API_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://job-board-api-e6bb.onrender.com" 
  : "http://localhost:5000";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;