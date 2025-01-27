import { makeRequest } from "./config";
type IPublicMsgFieldName = "loves" | "likes" | "dislikes";
import { IConversation, IPrivateMessage } from "../types/privateChatTypes";
import { IPublicChatItem, IPublicChatMessage } from "../types/publicChatTypes";
import { IUser } from "../types/userTypes";

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
  mentionedUsers: string[];
}): Promise<IPublicChatMessage> => {
  const response = await makeRequest.post("api/publicchat", {
    type: "MESSAGE",
    messageText: message,
    mentionedUsers: mentionedUsers,
  });
  const messageData = response.data;
  return messageData;
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
