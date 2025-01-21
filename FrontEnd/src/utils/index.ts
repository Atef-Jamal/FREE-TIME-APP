import axios from "axios";
import { IUser } from "../types/userTypes";
import { INotifications } from "../types/notificationTypes";
import { IPublicChatItem, IPublicChatMessage } from "../types/publicChatTypes";
import { IFilterByDevice, IFilterByPopularity, IReview, ITask } from "../types/earnTypes";
import { IMusicDetail, ISearchResults, ITestimonial } from "../types/othersTypes";
import { IFrame } from "../types/frameTypes";
import { IConversation, IPrivateMessage } from "../types/privateChatTypes";

type IPublicMsgFieldName = "loves" | "likes" | "dislikes";

const token = localStorage.getItem("token");

export const makeRequest = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  headers: {
    authorization: token ? `Bearer ${token}` : null,
  },
});

export const fetchUserById = async (userId: string): Promise<IUser> => {
  const response = await makeRequest.get(`/api/users/${userId}`);
  const data = response.data;
  return data;
};

export const sendVerificationCode = async (): Promise<void> => {
  await makeRequest.get("api/auth/send-verification-email-code");
};

export const applyCode = async ({ code }: { code: string }): Promise<{ points: number }> => {
  const response = await makeRequest.post("api/coupons", {
    code,
  });
  const updatedPoints = response.data;
  return updatedPoints;
};

export const verifyMyEmail = async ({ enteredCode }: { enteredCode: string }): Promise<void> => {
  await makeRequest.post("api/auth/verifiyemail", { enteredCode });
};

export const changeUserName = async ({ newName }: { newName: string }): Promise<{ name: string }> => {
  const response = await makeRequest.post("api/auth/changename", {
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
  await makeRequest.post("api/auth/changepassword", {
    newPassword,
    enterdOldPass: oldPassword,
  });
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
  const response = await makeRequest.get(`/api/users/live-stats-users?pageParam=${pageParam}`);
  const data = response.data;
  return data;
};

export const getSearchResults = async ({ searchQ }: { searchQ: string }): Promise<ISearchResults> => {
  const deezerUrl = import.meta.env.VITE_DEEZER_MUSICS_URL;
  const musicOptions = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": import.meta.env.VITE_X_RAPIDAPI_KEY,
      "X-RapidAPI-Host": import.meta.env.VITE_X_RAPIDAPI_HOST,
    },
  };
  const musicResponse = await fetch(deezerUrl, musicOptions);
  const musics = await musicResponse.json();
  const res = musics?.data?.filter((item: IMusicDetail) => item.title.toLocaleLowerCase().includes(searchQ));
  const mappedMusics = res?.map((item: IMusicDetail) => ({
    _id: item.id.toString(),
    description: item.title,
    image: item.album.cover,
    title: item.title,
    link: `/musics?to=${item.id.toString()}`,
  }));
  const response = await makeRequest.get(`api/search?q=${searchQ}`);
  const results = {
    ...response.data,
    musics: mappedMusics || [],
  };
  return results;
};

export const getOnlineUsers = async (): Promise<IUser[]> => {
  const response = await makeRequest.get(`/api/users/onlines`);
  const data = response.data;
  return data;
};
export const getLeaderboardUsers = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{ users: IUser[]; allDataLength: number }> => {
  const response = await makeRequest.get(`/api/users/users-leaderboard?pageParam=${pageParam}`);
  const data = response.data;
  return data;
};

export const getUserActivities = async (userId: string): Promise<INotifications[]> => {
  const response = await makeRequest.get(`/api/notifications/${userId}`);
  const data = response.data;
  return data;
};

export const userVisited = async (visitedUserId: string): Promise<void> => {
  await makeRequest.patch(`/api/users/${visitedUserId}/visited`, {
    NOT_IMPORTANT: "NOT_IMPORTANT",
  });
};
export const handleDeleteMessage = async (messageId: string): Promise<IPublicChatMessage> => {
  const response = await makeRequest.patch(`api/publicchat/${messageId}`, {
    isDeleted: true,
  });
  const message = response.data;
  return message;
};
export const handleMessageReaction = async ({
  messageId,
  fieldName,
}: {
  messageId: string;
  fieldName: IPublicMsgFieldName;
  otherFieldOne: IPublicMsgFieldName;
  otherFieldTow: IPublicMsgFieldName;
}): Promise<IPublicChatMessage> => {
  const response = await makeRequest.patch(`api/publicchat/${messageId}/${fieldName}`, {
    FOR_CONSISTENCY: "FOR_CONSISTENCY",
  });
  const updatedMessage = response.data;
  return updatedMessage;
};

export const handleAddReview = async ({
  taskId,
  comment,
}: {
  taskId: string;
  comment: string;
}): Promise<IReview> => {
  const response = await makeRequest.post(`/api/tasks/${taskId}/review`, {
    comment,
  });
  const review = response.data;
  return review;
};

export const fetchAppDetails = async ({ taskId }: { taskId: string }): Promise<ITask> => {
  const response = await makeRequest.get(`api/tasks/public/${taskId}`);
  const task = response.data;
  return task;
};

export const fetchTestimonials = async (): Promise<ITestimonial[]> => {
  const response = await makeRequest.get("api/testimonials");
  const testimonials = response.data.reverse();
  return testimonials;
};

export const handleSendTestimonial = async ({
  comment,
  stars,
}: {
  comment: string;
  stars: number;
}): Promise<ITestimonial> => {
  const response = await makeRequest.post("api/testimonials", {
    content: comment,
    stars,
  });
  const newTestimonial = response.data;
  return newTestimonial;
};

export const fetchAllFrames = async (): Promise<IFrame[]> => {
  const response = await makeRequest.get("api/frames");
  const frames = response.data;
  return frames;
};

export const purshaseFrame = async ({
  frameId,
}: {
  frameId: string;
}): Promise<{ points: number; savedFrame: IFrame }> => {
  const response = await makeRequest.get(`api/frames/${frameId}`);
  const data = response.data;
  return data;
};

export const purshaseMusic = async ({
  musicId,
}: {
  musicId: string;
}): Promise<{ points: number; musicId: string }> => {
  const response = await makeRequest.get(`api/songs/buy-song/${musicId}`);
  const data = response.data;
  return data;
};

export const fetchMyNotifications = async (): Promise<INotifications[]> => {
  const response = await makeRequest.get("api/notifications/my-notifications");
  const notifications = response.data;
  return notifications;
};

export const fetchMusics = async (): Promise<IMusicDetail[]> => {
  const url = import.meta.env.VITE_DEEZER_MUSICS_URL;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": import.meta.env.VITE_X_RAPIDAPI_KEY,
      "X-RapidAPI-Host": import.meta.env.VITE_X_RAPIDAPI_HOST,
    },
  };
  const response = await fetch(url, options);
  const data = await response.json();
  const musics = data.data;
  return musics;
};

export const changeMyPictureFrame = async ({ frameId }: { frameId: string }): Promise<IFrame> => {
  const response = await makeRequest.get(`api/users/select-myphoto-frame/${frameId}`);
  const data = response.data;
  return data;
};

export const unselectMyPictureFrame = async (): Promise<void> => {
  await makeRequest.get("api/users/unselect-myphoto-frame");
};

export const fetchPublicChatMessages = async ({
  pageParam,
  limit,
}: {
  pageParam: number;
  limit: number;
}): Promise<{ messages: IPublicChatItem[]; hasOlder: boolean }> => {
  const response = await makeRequest.get(`api/publicchat?pageParam=${pageParam}&limit=${limit}`);
  const data = response.data;
  return data;
};

export const sendPublicChatMessage = async ({
  message,
  mentionedUsers,
}: {
  message: string;
  mentionedUsers: IUser[];
}): Promise<IPublicChatMessage> => {
  const response = await makeRequest.post("api/publicchat", {
    type: "MESSAGE",
    messageText: message,
    mentioned: mentionedUsers,
  });
  const messageData = response.data;
  return messageData;
};

export const fetchAllConversations = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{ conversations: IConversation[]; hasMore: boolean }> => {
  const response = await makeRequest.get(
    `api/conversations/all-conversations/allusers?pageParam=${pageParam}`,
  );
  const data = response.data;
  return data;
};

export const sendPrivateChatMessage = async ({
  secondUserId,
  message,
}: {
  secondUserId: string;
  message: string;
}): Promise<IPrivateMessage> => {
  const response = await makeRequest.post(`api/conversations/${secondUserId}`, {
    messageText: message,
  });
  const data = response.data;
  return data;
};

export const fetchPrivateChatMessages = async ({
  secondUserId,
}: {
  secondUserId: string;
}): Promise<{
  messages: IPrivateMessage[];
  secondUser: IUser | null;
}> => {
  const response = await makeRequest.get(`api/conversations/${secondUserId}`);
  const messages = response.data.messages;
  const secondUser = response.data.secondUser;
  return { messages, secondUser };
};

export const fetchAllTasks = async ({
  filterByPopularity,
  filterByDevice,
  pageParam,
  limitPerPage,
}: {
  filterByPopularity: IFilterByPopularity;
  filterByDevice: IFilterByDevice;
  limitPerPage: number;
  pageParam: number;
}): Promise<{ tasks: ITask[]; hasMore: boolean }> => {
  const response = await makeRequest.get(
    `api/tasks?filterByPopularity=${filterByPopularity}&&filterByDevice=${filterByDevice}&&pageParam=${pageParam}&&limitedPerPage=${limitPerPage}`,
  );
  const data = response.data;
  return data;
};
