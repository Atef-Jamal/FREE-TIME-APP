import { makeRequest } from "./config";
import { openToast } from "../context/appStateSlice";
import { IDispatch, ILoginProps, IRegisterProps } from "../types/reduxTypes";

export const register = async ({ formData, dispatch, referrerUser }: IRegisterProps) => {
  dispatch(
    openToast({
      message: "Registering....",
      type: "LOADING",
    }),
  );
  const query = referrerUser ? `?referrerUser=${referrerUser}` : "";
  console.log(formData);
  const response = await makeRequest.post(`api/auth/register${query}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
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
  return response;
};
interface IParams {
  provider: "google" | "github";
  dispatch: IDispatch;
}
export const signInWithOauthProvider = async ({ provider, dispatch }: IParams) => {
  dispatch(
    openToast({
      message: "signing in....",
      type: "LOADING",
    }),
  );
  window.location.href = `http://localhost:3000/api/auth/${provider}`;
};
