import { makeRequest } from ".";
import { TypeFormData } from "../types/others";

export const register = async (formData: any, referrerUser?: string | null) => {
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

export const login = async (
  formData: Omit<TypeFormData, "name" | "confirmPassword" | "profilePicture">
) => {
  const { email, password } = formData;
  const response = await makeRequest.post(`api/auth/login`, {
    email,
    password,
  });
  return response;
};
