import { axiosRequest } from "../../../lib/axios";
import { IOnlineUser, IUser } from "../types";

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

export const fetchOnlineUsers = async (): Promise<string[]> => {
  const response = await axiosRequest.get("api/users/online-users");
  return response.data;
};
export const fetchOnlineUsersData = async (): Promise<IOnlineUser[]> => {
  const response = await axiosRequest.get("api/users/online-users-data");
  return response.data;
};
