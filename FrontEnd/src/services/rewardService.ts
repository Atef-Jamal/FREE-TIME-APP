import { INotificationModelName } from "../types/notificationTypes";
import { axiosRequest } from "../utilities";

export const collectReward = async (notificationId: string, modelName: INotificationModelName) => {
  const response = await axiosRequest.get(`api/notifications/collect/${notificationId}/${modelName}`);
  return response.data;
};

export const applyCode = async ({ code }: { code: string }): Promise<{ points: number }> => {
  const response = await axiosRequest.post("api/coupons", {
    code,
  });
  const updatedPoints = response.data;
  return updatedPoints;
};
