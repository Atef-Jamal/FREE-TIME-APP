import axios from "axios";

let token = localStorage.getItem("token");

if (!token) {
  const tokenFromUrl = new URLSearchParams(location.search);
  if (tokenFromUrl) token = tokenFromUrl.get("token");
}

export const makeRequest = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  headers: {
    authorization: token ? `Bearer ${token}` : null,
  },
});
