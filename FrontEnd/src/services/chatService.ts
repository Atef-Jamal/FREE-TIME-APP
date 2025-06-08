import { axiosRequest } from "../utilities";
import type {
  IUser,
  IConversation,
  IPrivateMessage,
  IPublicChatItem,
  IPublicChatMessage,
  IUnreadPrivateMsgsCache,
} from "../types";

type IPublicMsgFieldName = "loves" | "likes" | "dislikes";

export const fetchPublicChatMessages = async ({
  pageParam,
  limit,
}: {
  pageParam: number;
  limit: number;
}): Promise<{ messages: IPublicChatItem[]; hasOlder: boolean }> => {
  const response = await axiosRequest.get(`api/publicchat?pageParam=${pageParam}&limit=${limit}`);
  const data = response.data;
  return data;
};

export const sendPublicChatMessage = async ({
  message,
  mentionedUsers,
}: {
  message: string;
  mentionedUsers: string[];
}): Promise<IPublicChatMessage> => {
  const response = await axiosRequest.post("api/publicchat", {
    type: "MESSAGE",
    messageText: message,
    mentionedUsers: mentionedUsers,
  });
  const messageData = response.data;
  return messageData;
};

export const handleDeleteMessage = async (messageId: string): Promise<IPublicChatMessage> => {
  const response = await axiosRequest.delete(`api/publicchat/${messageId}`);
  const message = response.data;
  return message;
};

export const handleMessageReaction = async ({
  messageId,
  fieldName,
}: {
  messageId: string;
  fieldName: IPublicMsgFieldName;
  otherField1: IPublicMsgFieldName;
  otherField2: IPublicMsgFieldName;
}): Promise<IPublicChatMessage> => {
  const response = await axiosRequest.get(`api/publicchat/${messageId}/${fieldName}`);
  const updatedMessage = response.data;
  return updatedMessage;
};

export const fetchUnreadPrivateMessages = async (): Promise<IUnreadPrivateMsgsCache> => {
  const response = await axiosRequest.get("api/conversations/unread/count");
  return response.data;
};

export const fetchAllConversations = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{ conversations: IConversation[]; hasMore: boolean }> => {
  const response = await axiosRequest.get(`api/conversations?pageParam=${pageParam}`);
  const data = response.data;
  return data;
};

export const fetchPrivateChatMessages = async ({
  pageParam,
  activeChatId,
}: {
  pageParam: number;
  activeChatId: string;
}): Promise<{
  messages: IPrivateMessage[];
  secondUser: IUser | null;
  hasOlder: boolean;
}> => {
  const response = await axiosRequest.get(`api/conversations/${activeChatId}?pageParam=${pageParam}`);
  const data = response.data;
  return data;
};

export const sendPrivateChatMessage = async ({
  receiver,
  message,
}: {
  receiver: string;
  message: string;
}): Promise<IPrivateMessage> => {
  const response = await axiosRequest.post(`api/conversations`, {
    messageText: message,
    receiver,
  });
  const data = response.data;
  return data;
};
