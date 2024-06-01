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
/*
export const formateDate = (dateArg: Date): string => {
  const now: Date = new Date();
  const timestampDate: Date = new Date(dateArg);
  const difference: number = now.toLocaleString("en-US").getTime() - timestampDate.toLocaleString("en-US").getTime();

  const minutes: number = Math.floor(difference / (1000 * 60));
  const hours: number = Math.floor(difference / (1000 * 60 * 60));
  const days: number = Math.floor(difference / (1000 * 60 * 60 * 24));
  const months: number = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));

  if (months > 0) {
    return months + (months === 1 ? " month ago" : " months ago");
  } else if (days > 0) {
    return days + (days === 1 ? " day ago" : " days ago");
  } else if (hours > 0) {
    return hours + (hours === 1 ? " hour ago" : " hours ago");
  } else {
    return (
      (minutes === 0 ? "" : minutes) +
      (minutes === 0
        ? "Just now"
        : minutes === 1
        ? " minute ago "
        : " minutes ago")
    );
  }
};
*/

const formateDate = (date: Date) : string => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const units = [
        { name: 'year', seconds: 31536000 },
        { name: 'month', seconds: 2592000 },
        { name: 'week', seconds: 604800 },
        { name: 'day', seconds: 86400 },
        { name: 'hour', seconds: 3600 },
        { name: 'minute', seconds: 60 },
        { name: 'second', seconds: 1 },
    ];

    for (const unit of units) {
        const count = Math.floor(diffInSeconds / unit.seconds);
        if (count >= 1) {
            return `${count} ${unit.name}${count > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}



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
