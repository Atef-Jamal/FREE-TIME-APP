import axios from "axios";

const token = localStorage.getItem("token") || "";

export const makeRequest = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  headers: {
    authorization: `Bearer ${token}`,
  },
});
