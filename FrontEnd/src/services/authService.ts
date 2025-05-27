import { makeRequest } from "./config";
import { openToast } from "../context/appStateSlice";
import { ILoginProps, IRegisterProps } from "../types/reduxTypes";

export const register = async ({ formData, dispatch, referrerUser }: IRegisterProps) => {
  dispatch(
    openToast({
      message: "Registering....",
      type: "LOADING",
    }),
  );
  const query = referrerUser ? `?referrerUser=${referrerUser}` : "";

  const response = await makeRequest.post(`api/auth/register${query}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  localStorage.setItem("token", response.data.token);
  window.location.href = `${window.location.origin}/?redirectedfrom=signup`;
};

export const login = async ({ formData, dispatch }: ILoginProps) => {
  dispatch(
    openToast({
      message: "Logging In....",
      type: "LOADING",
    }),
  );
  const { email, password } = formData;
  const response = await makeRequest.post(`api/auth/login`, {
    email,
    password,
  });
  localStorage.setItem("token", response.data.token);
  window.location.href = `${window.location.origin}/?redirectedfrom=login`;
};
