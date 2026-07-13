import axios from "axios";

export const axiosRequest = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        return axiosRequest(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("isLoggedIn");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
