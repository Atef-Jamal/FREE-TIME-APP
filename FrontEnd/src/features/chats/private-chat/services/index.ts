import { axiosRequest } from "../../../../lib/axios";
import { IConversation, IPrivateMessage } from "../types";

export const fetchUnreadPrivateMessages = async (): Promise<{ counts: number }> => {
  const response = await axiosRequest.get("api/conversations/unread/count");
  return response.data;
};

export const fetchAllConversations = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{ conversations: IConversation[]; hasMore: boolean }> => {
  const response = await axiosRequest.get(`api/conversations?pageParam=${pageParam}`);
  return response.data;
};

export const fetchPrivateChatMessages = async ({
  pageParam,
  secondUserId,
}: {
  pageParam: number;
  secondUserId: string;
}): Promise<{
  messages: IPrivateMessage[];
  hasMore: boolean;
}> => {
  const response = await axiosRequest.get(`api/conversations/${secondUserId}?pageParam=${pageParam}`);
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
  const response = await axiosRequest.post(`api/conversations`, { messageText: message, receiver });
  return response.data;
};

export const conversationRead = async ({ secondUserId }: { secondUserId: string }) => {
  const response = await axiosRequest.get(`api/conversations/${secondUserId}/read`);
  return response;
};
