import { User } from "./userTypes";

export interface TypeConversation {
  secondParty: User;
  lastMessage: TypePrivateMessage | null;
  unreadedCount: number;
}

export interface TypePrivateMessage {
  sender: User;
  message: string;
  _id: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  isSended?: "PENDING" | "SUCCESS" | "FAILED";
}
