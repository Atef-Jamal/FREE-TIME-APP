import { axiosRequest } from "../../../lib/axios";
import { IUser } from "../../../features/user/types";

export const fetchUserById = async ({ userId }: { userId: string }): Promise<IUser> => {
  const response = await axiosRequest.get(`/api/users/${userId}`);
  const data = response.data;
  return data;
};

export const fetchTopUser = async (): Promise<{ userId: string }> => {
  const response = await axiosRequest.get(`/api/users/top-user`);
  const data = response.data;
  return data;
};

export const fetchGuestsCount = async (): Promise<number> => {
  const response = await axiosRequest.get("/api/users/guestsCount");
  const data = response.data;
  return data;
};

export const fetchOnlineUsersData = async (): Promise<IUser[]> => {
  const response = await axiosRequest.get(`/api/users/onlines`);
  const data = response.data;
  return data;
};
