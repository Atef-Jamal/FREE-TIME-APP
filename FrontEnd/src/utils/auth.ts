import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { makeRequest } from ".";
import { auth } from "../firebase";
import { showPopup } from "../context/StateManeger";
import {
  TypeDispatch,
  TypeLoginProps,
  TypeRegisterProps,
} from "../types/reduxTypes";

export const register = async ({
  formData,
  dispatch,
  referrerUser,
}: TypeRegisterProps) => {
  dispatch(
    showPopup({
      message: "Registering....",
      type: "LOADING",
    })
  );
  let response;
  if (referrerUser) {
    response = await makeRequest.post(
      `api/auth/register?referrerUser=${referrerUser}`,
      formData
    );
  } else {
    response = await makeRequest.post(`api/auth/register`, formData);
  }
  return response;
};

export const login = async ({ formData, dispatch }: TypeLoginProps) => {
  dispatch(
    showPopup({
      message: "Logging In....",
      type: "LOADING",
    })
  );
  const { email, password } = formData;
  const response = await makeRequest.post(`api/auth/login`, {
    email,
    password,
  });
  return response;
};

export const signInWithGoogle = async ({
  dispatch,
}: {
  dispatch: TypeDispatch;
}) => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  dispatch(
    showPopup({
      message: "signing in....",
      type: "LOADING",
    })
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
