import axios from "axios";

const token = localStorage.getItem("token") || "";

export const makeRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  },
});

export const handleApiError = (error: any) => {
  let errorMessage = "";
  if (
    error?.response?.data?.error &&
    typeof error.response.data.error === "string"
  ) {
    errorMessage = error.response.data.error;
  } else {
    errorMessage = "An unexpected Error occurred";
  }
  return errorMessage;
};
