import { QueryClient } from "@tanstack/react-query";
import { IUser } from "./userTypes";

export interface IPrivateMessage {
  _id: string;
  conversation: string;
  sender: IUser;
  receiver: IUser;
  message: string;
  isRead: boolean;
  isSended?: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
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
  lastMessage?: IPrivateMessage;
  unReadCount: number;
}

export interface ICashedSingleConversation {
  pageParams: number[];
  pages: { messages: IPrivateMessage[]; hasMore: boolean }[];
}

export interface ICashedConversations {
  pageParams: number[];
  pages: { conversations: IConversation[]; hasMore: boolean }[];
}
