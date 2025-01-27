import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { makeRequest } from "./config";
import { auth } from "../firebase";
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
  const response = await makeRequest.post(`api/auth/register${query}`, formData);
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

export const signInWithGoogle = async ({ dispatch }: { dispatch: IDispatch }) => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  dispatch(
    openToast({
      message: "signing in....",
      type: "LOADING",
    }),
  );
  const loginUser = await makeRequest.post(`api/auth/login-with-google`, {
    name: result.user.displayName,
    email: result.user.email,
    profilePicture: result.user.photoURL,
    accessToken: await result.user.getIdToken(),
  });
  localStorage.setItem("token", loginUser.data.token);
  window.location.href = `${window.location.origin}/?redirectedfrom=login`;
};
