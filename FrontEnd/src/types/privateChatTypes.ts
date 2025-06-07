import { QueryClient } from "@tanstack/react-query";
import { IUser } from "./userTypes";

export interface IPrivateMessage {
  _id: string;
  conversationId: string;
  sender: IUser;
  receiver: IUser;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  isSended?: "PENDING" | "SUCCESS" | "FAILED";
}

export interface IUnreadPrivateMsgsCache {
  senderIds: string[];
}

export interface IUpdatePrivateMsgsCacheParams {
  queryClient: QueryClient;
  type: "add-one" | "remove-one" | "remove-all";
  userId?: string;
}

export interface IConversation {
  _id: string;
  secondUser: IUser;
  lastMessage: IPrivateMessage | null;
  unReadCount: number;
}

export interface ICashedSingleConversation {
  pageParams: number[];
  pages: { secondUser: IUser; messages: IPrivateMessage[]; hasMore: boolean }[];
}

export interface ICashedConversations {
  pageParams: number[];
  pages: { conversations: IConversation[]; hasMore: boolean }[];
}
