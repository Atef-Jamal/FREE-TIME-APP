import { User } from "./userTypes";

export interface TypePrivateMessage {
  sender: User;
  message: string;
  _id: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  isSent?: boolean;
}
