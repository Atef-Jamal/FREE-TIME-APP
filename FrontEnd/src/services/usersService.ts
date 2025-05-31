import { IUser } from "../types/userTypes";
import { IFrame } from "../types/frameTypes";
import { INotifications } from "../types/notificationTypes";
import { axiosRequest } from "../utilities";

export const fetchUserById = async ({ userId }: { userId: string }): Promise<IUser> => {
  const response = await axiosRequest.get(`/api/users/${userId}`);
  const data = response.data;
  return data;
};

export const sendVerificationCode = async (): Promise<void> => {
  await axiosRequest.get("api/auth/send-verification-email-code");
};

export const verifyMyEmail = async ({ enteredCode }: { enteredCode: string }): Promise<void> => {
  await axiosRequest.post("api/auth/verifiyemail", { enteredCode });
};

export const changeUserName = async ({ newName }: { newName: string }): Promise<{ name: string }> => {
  const response = await axiosRequest.post("api/auth/changename", {
    newName,
  });
  const name = response.data;
  return name;
};
export const changeUserPassword = async ({
  newPassword,
  oldPassword,
}: {
  newPassword: string;
  oldPassword: string;
}): Promise<void> => {
  await axiosRequest.post("api/auth/changepassword", {
    newPassword,
    enterdOldPass: oldPassword,
  });
};
export const changeMyPictureFrame = async ({ frameId }: { frameId: string }): Promise<IFrame> => {
  const response = await axiosRequest.get(`api/users/select-myphoto-frame/${frameId}`);
  const data = response.data;
  return data;
};

export const unselectMyPictureFrame = async (): Promise<void> => {
  await axiosRequest.get("api/users/unselect-myphoto-frame");
};
export const getUsers = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{
  users: IUser[];
  userHighestPoints: string | undefined;
  hasMore: boolean;
}> => {
  const response = await axiosRequest.get(`/api/users/live-stats-users?pageParam=${pageParam}`);
  const data = response.data;
  return data;
};
export const userVisited = async (visitedUserId: string): Promise<void> => {
  await axiosRequest.get(`/api/users/${visitedUserId}/visited`);
};

export const fetchUserActivities = async ({ userId }: { userId: string }): Promise<INotifications[]> => {
  const response = await axiosRequest.get(`/api/notifications/${userId}`);
  const data = response.data;
  return data;
};

export const getOnlineUsers = async (): Promise<IUser[]> => {
  const response = await axiosRequest.get(`/api/users/onlines`);
  const data = response.data;
  return data;
};
export const getLeaderboardUsers = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{ users: IUser[]; allDataLength: number }> => {
  const response = await axiosRequest.get(`/api/users/users-leaderboard?pageParam=${pageParam}`);
  const data = response.data;
  return data;
};

export const fetchMyNotifications = async (): Promise<INotifications[]> => {
  const response = await axiosRequest.get("api/notifications/my-notifications");
  const notifications = response.data;
  return notifications;
};
