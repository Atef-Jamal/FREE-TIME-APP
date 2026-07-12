import type { IUser, IFrame, INotifications, IEmailVerifiedNotify } from "../types";
import { ICashedLeaderboardUsers } from "../types/user";
import { axiosRequest } from "../utilities";

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

export const sendVerificationCode = async (): Promise<void> => {
  await axiosRequest.get("api/auth/send-verification-email-code");
};

export const verifyMyEmail = async ({
  enteredCode,
}: {
  enteredCode: string;
}): Promise<IEmailVerifiedNotify> => {
  const response = await axiosRequest.post("api/auth/verifiyemail", { enteredCode });
  return response.data;
};

export const changeUserName = async ({ newName }: { newName: string }): Promise<{ name: string }> => {
  const response = await axiosRequest.post("api/auth/changename", {
    newName,
  });
  return response.data;
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
export const changeMyPictureFrame = async ({
  frameId,
  action,
}: {
  frameId: string;
  action: "select" | "unselect";
}): Promise<IFrame> => {
  const response = await axiosRequest.get(
    `/api/users/select-unselect-photoFrame/${frameId}?action=${action}`,
  );
  const data = response.data;
  return data;
};

export const fetchLiveStatsUsers = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{
  users: IUser[];
  hasMore: boolean;
}> => {
  const response = await axiosRequest.get(`/api/users/live-stats-users?pageParam=${pageParam}`);
  const data = response.data;
  return data;
};

export const userViewed = async (profileOwnerId: string): Promise<void> => {
  await axiosRequest.get(`/api/users/${profileOwnerId}/view-profile`);
};

export const fetchUserActivities = async ({ userId }: { userId: string }): Promise<INotifications[]> => {
  const response = await axiosRequest.get(`/api/notifications/${userId}`);
  const data = response.data;
  return data;
};

export const fetchOnlineUsersData = async (): Promise<IUser[]> => {
  const response = await axiosRequest.get(`/api/users/onlines`);
  const data = response.data;
  return data;
};

// export const fetchOnlineUsersIds = async (): Promise<string[]> => {
//   const response = await axiosRequest.get(`/api/users/online-users-ids`);
//   return response.data;
// };

export const getLeaderboardUsers = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<ICashedLeaderboardUsers> => {
  const response = await axiosRequest.get(`/api/users/users-leaderboard?pageParam=${pageParam}`);
  const data = response.data;
  return data;
};

export const fetchMyNotifications = async (): Promise<INotifications[]> => {
  const response = await axiosRequest.get("api/notifications/my-notifications");
  const notifications = response.data;
  return notifications;
};
