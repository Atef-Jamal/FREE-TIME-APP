import axios from "axios";
import { User } from "../types/userTypes";
import { TypeNotifications } from "../types/notificationTypes";
import {
  TypePublicChatItem,
  TypePublicChatMessage,
} from "../types/publicChatTypes";
import {
  TypeFilterByDevice,
  TypeFilterByPopularity,
  TypeReview,
  TypeTaskApp,
} from "../types/earnTypes";
import { TypeMusicDetail, TypeTestimonial } from "../types/othersTypes";
import { TypeFrame } from "../types/frameTypes";
import {
  TypeConversation,
  TypePrivateMessage,
} from "../types/privateChatTypes";
type TypeFieldName = "loves" | "likes" | "dislikes";

const token = localStorage.getItem("token") || "";

export const makeRequest = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  headers: {
    authorization: `Bearer ${token}`,
  },
});

export const fetchUserById = async (userId: string): Promise<User> => {
  const response = await makeRequest.get(`/api/users/${userId}`);
  const data = response.data;
  return data;
};

export const sendVerificationCode = async (): Promise<void> => {
  await makeRequest.get(`api/auth/send-verification-email-code`);
};

export const applyCode = async ({
  code,
}: {
  code: string;
}): Promise<{ points: number }> => {
  const response = await makeRequest.post("api/coupons", {
    code,
  });
  const updatedPoints = response.data;
  return updatedPoints;
};

export const verifyMyEmail = async ({
  enteredCode,
}: {
  enteredCode: string;
}): Promise<void> => {
  await makeRequest.post("api/auth/verifiyemail", { enteredCode });
};

export const changeUserName = async ({
  newName,
}: {
  newName: string;
}): Promise<{ name: string }> => {
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
  users: User[];
  userHighestPoints: string | undefined;
  hasMore: boolean;
}> => {
  const response = await makeRequest.get(`/api/users?pageParam=${pageParam}`);
  const data = response.data;
  return data;
};

export const getOnlineUsers = async (): Promise<User[]> => {
  const response = await makeRequest.get(`/api/users/onlines`);
  const data = response.data;
  return data;
};
export const getLeaderboardUsers = async (): Promise<User[]> => {
  const response = await makeRequest.get(`/api/users/leaderboard`);
  const data = response.data;
  return data;
};

export const getUserActivities = async (
  userId: string
): Promise<TypeNotifications[]> => {
  const response = await makeRequest.get(`/api/notifications/${userId}`);
  const data = response.data;
  return data;
};

export const userVisited = async (visitedUserId: string): Promise<void> => {
  await makeRequest.patch(`/api/users/${visitedUserId}/visited`, {
    NOT_IMPORTANT: "NOT_IMPORTANT",
  });
};
export const handleDeleteMessage = async (
  messageId: string
): Promise<TypePublicChatMessage> => {
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
  fieldName: TypeFieldName;
  otherFieldOne: TypeFieldName;
  otherFieldTow: TypeFieldName;
}): Promise<TypePublicChatMessage> => {
  const response = await makeRequest.patch(
    `api/publicchat/${messageId}/${fieldName}`,
    {
      FOR_CONSISTENCY: "FOR_CONSISTENCY",
    }
  );
  const updatedMessage = response.data;
  return updatedMessage;
};

export const handleAddReview = async ({
  taskId,
  comment,
}: {
  taskId: string;
  comment: string;
}): Promise<TypeReview> => {
  const response = await makeRequest.post(`/api/tasks/${taskId}/review`, {
    comment,
  });
  const review = response.data;
  return review;
};

export const fetchAppDetails = async ({
  taskId,
}: {
  taskId: string;
}): Promise<TypeTaskApp> => {
  const response = await makeRequest.get(`api/tasks/public/${taskId}`);
  const task = response.data;
  return task;
};

export const fetchTestimonials = async (): Promise<TypeTestimonial[]> => {
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
}): Promise<TypeTestimonial> => {
  const response = await makeRequest.post("api/testimonials", {
    content: comment,
    stars,
  });
  const newTestimonial = response.data;
  return newTestimonial;
};

export const fetchAllFrames = async (): Promise<TypeFrame[]> => {
  const response = await makeRequest.get("api/frames");
  const frames = response.data;
  return frames;
};

export const purshaseFrame = async ({
  frameId,
}: {
  frameId: string;
}): Promise<{ points: number; savedFrame: TypeFrame }> => {
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

export const fetchStatistics = async (): Promise<TypeNotifications[]> => {
  const response = await makeRequest.get("api/notifications/my-notifications");
  const statistics = response.data;
  return statistics;
};

export const fetchMusics = async (): Promise<TypeMusicDetail[]> => {
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

export const changeMyPictureFrame = async ({
  frameId,
}: {
  frameId: string;
}): Promise<TypeFrame> => {
  const response = await makeRequest.get(
    `api/users/select-myphoto-frame/${frameId}`
  );
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
}): Promise<{ messages: TypePublicChatItem[]; hasOlder: boolean }> => {
  const response = await makeRequest.get(
    `api/publicchat?pageParam=${pageParam}&limit=${limit}`
  );
  const data = response.data;
  return data;
};

export const sendPublicChatMessage = async ({
  message,
  mentionedUserId,
}: {
  message: string;
  mentionedUserId: string | undefined;
}): Promise<TypePublicChatMessage> => {
  const response = await makeRequest.post("api/publicchat", {
    type: "MESSAGE",
    messageText: message,
    mentioned: mentionedUserId,
  });
  const messageData = response.data;
  return messageData;
};

// export const fetchAllConversations = async ({
//   onlineUsers,
// }: {
//   onlineUsers: string[];
// }): Promise<TypeConversation[]> => {
//   const response = await makeRequest.get(
//     "api/conversations/all-conversations/allusers"
//   );
//   const sorted = response.data.sort(
//     (a: TypeConversation, b: TypeConversation) => {
//       if (a.lastMessage?.createdAt && b.lastMessage?.createdAt) {
//         if (a.lastMessage?.createdAt > b.lastMessage?.createdAt) {
//           return -1;
//         }
//         if (a.lastMessage?.createdAt < b.lastMessage?.createdAt) {
//           return 1;
//         } else {
//           return 0;
//         }
//       }
//       if (
//         onlineUsers.includes(a.secondParty._id) &&
//         !onlineUsers.includes(b.secondParty._id)
//       ) {
//         return -1;
//       }
//       if (
//         !onlineUsers.includes(a.secondParty._id) &&
//         onlineUsers.includes(b.secondParty._id)
//       ) {
//         return 1;
//       }
//       return 0;
//     }
//   );
//   return sorted;
// };

export const fetchAllConversations = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{ conversations: TypeConversation[]; hasMore: boolean }> => {
  const response = await makeRequest.get(
    `api/conversations/all-conversations/allusers?pageParam=${pageParam}`
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
}): Promise<TypePrivateMessage> => {
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
  messages: TypePrivateMessage[];
  secondUser: User | null;
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
  filterByPopularity: TypeFilterByPopularity;
  filterByDevice: TypeFilterByDevice;
  limitPerPage: number;
  pageParam: number;
}): Promise<{ tasks: TypeTaskApp[]; hasMore: boolean }> => {
  const response = await makeRequest.get(
    `api/tasks?filterByPopularity=${filterByPopularity}&&filterByDevice=${filterByDevice}&&pageParam=${pageParam}&&limitedPerPage=${limitPerPage}`
  );
  const data = response.data;
  return data;
};
