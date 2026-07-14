import { axiosRequest } from "../../../lib/axios";
import {
  IEmailVerifiedNotify,
  IGuessCardTaskNotify,
  INotifications,
  IQuizTaskNotify,
  IReferrerNotify,
} from "../types";

export const fetchMyNotifications = async (): Promise<INotifications[]> => {
  const response = await axiosRequest.get("api/notifications/my-notifications");
  const notifications = response.data;
  return notifications;
};

export const collectReward = async (
  notificationId: string,
): Promise<IEmailVerifiedNotify | IReferrerNotify | IQuizTaskNotify | IGuessCardTaskNotify> => {
  const response = await axiosRequest.get(`api/notifications/collect/${notificationId}`);
  return response.data;
};
