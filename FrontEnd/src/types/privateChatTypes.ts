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

export interface IConversation {
  _id: string;
  secondParty: IUser;
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
