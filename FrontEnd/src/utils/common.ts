import { makeRequest } from "../utils";

export const validation = (
  values: string[],
  signIn: boolean,
  agreePrivacy?: boolean
) => {
  let result = `Must Be Exist-`;
  values.map((item, index) => {
    let name;
    if (index === 0) name = `${signIn ? "Email" : "Username"} `;
    if (index === 1) name = `${signIn ? "Password" : "Email"} `;
    if (index === 2) name = `Password `;
    if (index === 3) name = `Confirm Password `;
    return item.trim() === "" ? (result += name) : undefined;
  });
  if (values.every((item) => item.trim() !== "") && values[2] !== values[3])
    return (result = `Password doesn't Match`);
  if (values[0].length < 3 && !signIn)
    return (result = `name must be at least 3 character`);
  if (values[0].length > 17 && !signIn)
    return (result = `name must be less than 17 character`);
  if (!signIn) {
    if (!agreePrivacy && values.every((item) => item.trim() !== "")) {
      return (result = `must agree Privacy Policy and terms of service`);
    }
  }
  if (values.every((item) => item.trim() !== "")) {
    return (result = "");
  }
  return result.split("-").reverse().join("");
};

export const formateDate = (date: Date): string => {
  const now: any = new Date();
  const past: any = new Date(date);
  const diffInSeconds: any = Math.floor((now.getTime() - past.getTime()) / 1000);

  if(diffInSeconds < 60 ){
    return `just now`;
  }
  if(diffInSeconds < 3600 ){
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  }
  if(diffInSeconds < 86400 ){
    return `${Math.floor(diffInSeconds / (60 * 60))} hours ago`;
  }
  if(diffInSeconds < 604800 ){
    return `${Math.floor(diffInSeconds / (60 * 60 * 24))} day ago`;
  }
  
  if(diffInSeconds < 2592000 ){
    return `${Math.floor(diffInSeconds / (60 * 60 * 24 * 7))} week ago`;
  }
  if(diffInSeconds < 31536000 ){
    return `${Math.floor(diffInSeconds / (60 * 60 * 24 * 7 * 4))} month ago`;
  }
  
    return `${Math.floor(diffInSeconds / (60 * 60 * 24 * 7 * 4 * 12))} years ago`;
  
  
};

export const handleApiError = (error: any) => {
  let errorMessage = "";
  if (
    error?.response?.data?.error &&
    typeof error.response.data.error === "string"
  ) {
    errorMessage = error.response.data.error;
  } else {
    errorMessage = "An unexpected Error occurred";
  }
  return errorMessage;
};

export const collectReward = async (notificationId: string) => {
  const response = await makeRequest.patch(
    `api/notifications/collect/${notificationId}`,
    {
      FOR_CONSISTENCY: "FOR_CONSISTENCY",
    }
  );

  return response.data;
};
