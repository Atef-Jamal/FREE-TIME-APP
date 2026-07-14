import { axiosRequest } from "../../../lib/axios";
import { IFrame } from "../../marketplace/types";
import { IEmailVerifiedNotify } from "../../notifications/types";
import { IProfileView } from "../../user/types";

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

export const getProfileViews = async (): Promise<{ points: number; viewers: IProfileView[] }> => {
  const response = await axiosRequest.get("/api/users/profile-views");
  return response.data;
};
