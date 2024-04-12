import axios from "axios";

const token = localStorage.getItem("token") || null;

export const makeRequest = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  },
});
