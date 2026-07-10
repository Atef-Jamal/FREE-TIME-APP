import { openToast } from "../context/appStateSlice";
import type { IDispatch, ILoginProps, IRegisterProps } from "../types";
import { axiosRequest, handleApiError } from "../utilities";

export const registerUser = async ({ data, referrerUser }: IRegisterProps) => {
  const query = referrerUser ? `?referrerUser=${referrerUser}` : "";

  const response = await axiosRequest.post(`api/auth/register${query}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (response.status === 201) {
    localStorage.setItem("isLoggedIn", "ok");
    window.location.href = `${window.location.origin}/?comeFrom=signup`;
  }
};

export const login = async ({ data }: ILoginProps) => {
  const { email, password } = data;
  const response = await axiosRequest.post(`api/auth/login`, {
    email,
    password,
  });
  if (response.status === 200) {
    localStorage.setItem("isLoggedIn", "ok");
    window.location.href = `${window.location.origin}/?comeFrom=login`;
  }
};

export const handleSignInWithOauth = async (provider: "google" | "github", dispatch: IDispatch) => {
  try {
    dispatch(
      openToast({
        message: "signing in....",
        type: "LOADING",
      }),
    );
    window.location.href = `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/${provider}`;
  } catch (error) {
    dispatch(
      openToast({
        message: handleApiError(error),
        type: "ERROR_GENERAL",
      }),
    );
  }
};

export const logOut = async () => {
  localStorage.removeItem("isLoggedIn");
  await axiosRequest.post("api/auth/logout");
  window.location.href = `${window.location.origin}/?comeFrom=logout`;
};
