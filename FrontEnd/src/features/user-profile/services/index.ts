import { axiosRequest } from "../../../lib/axios";
import { INotifications } from "../../notifications/types";

export const fetchUserActivities = async ({ userId }: { userId: string }): Promise<INotifications[]> => {
  const response = await axiosRequest.get(`/api/notifications/${userId}`);
  const data = response.data;
  return data;
};

export const userViewed = async (profileOwnerId: string): Promise<void> => {
  await axiosRequest.get(`/api/users/${profileOwnerId}/view-profile`);
};
