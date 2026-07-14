import { axiosRequest } from "../../../../lib/axios";
import { IPublicChatItem, IPublicChatMessage } from "../types";

type IPublicMsgFieldName = "loves" | "likes" | "dislikes";

export const fetchPublicChatMessages = async ({
  pageParam,
  limit,
}: {
  pageParam: number;
  limit: number;
}): Promise<{ messages: IPublicChatItem[]; hasMore: boolean }> => {
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

export const fetchSinglePublicMsg = async (messageIdParam: string) => {
  const response = await axiosRequest.get(`/api/publicchat/${messageIdParam}`);
  return response.data;
};
