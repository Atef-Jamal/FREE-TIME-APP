import { IUser } from "./userTypes";

export interface IPrivateMessage {
  sender: IUser;
  message: string;
  _id: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  isSended?: "PENDING" | "SUCCESS" | "FAILED";
}
export interface IConversation {
  secondParty: IUser;
  lastMessage: IPrivateMessage | null;
  unreadedCount: number;
}
export interface ICashedConversation {
  secondUser: IUser;
  messages: IPrivateMessage[];
}
export interface ICashedConversations {
  pageParams: number[];
  pages: { conversations: IConversation[]; hasMore: boolean }[];
}
