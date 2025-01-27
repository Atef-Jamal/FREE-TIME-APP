import { INotificationModelName } from "../types/notificationTypes";
import { makeRequest } from "./config";

export const collectReward = async (notificationId: string, modelName: INotificationModelName) => {
  const response = await makeRequest.patch(`api/notifications/collect/${notificationId}/${modelName}`, {
    FOR_CONSISTENCY: "FOR_CONSISTENCY",
  });
  return response.data;
};

export const applyCode = async ({ code }: { code: string }): Promise<{ points: number }> => {
  const response = await makeRequest.post("api/coupons", {
    code,
  });
  const updatedPoints = response.data;
  return updatedPoints;
};
