import { IUser } from "./user";

export interface IPrivateMessage {
  _id: string;
  conversation: string;
  sender: IUser;
  receiver: IUser;
  message: string;
  isSended?: "PENDING" | "SUCCESS" | "FAILED";
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUnreadPrivateMsgsCache {
  counts: number;
}

export interface IConversation {
  _id: string;
  conversationName: string;
  secondUser: Pick<IUser, "_id" | "name" | "profilePicture" | "activeFrame">;
  lastMessage?: IPrivateMessage;
  unreadCounts: Record<string, number>;
}

export interface ICashedSingleConversation {
  pageParams: number[];
  pages: { messages: IPrivateMessage[]; hasMore: boolean }[];
}

export interface ICashedConversations {
  pageParams: number[];
  pages: { conversations: IConversation[]; hasMore: boolean }[];
}
