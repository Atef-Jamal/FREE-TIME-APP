import axios from "axios";

const token = localStorage.getItem("token") || null;

export const makeRequest = axios.create({
  baseURL: "https://free-time-app.onrender.com/",
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  },
});
