import { INotifications } from "./notificationTypes";
import { IPrivateMessage } from "./privateChatTypes";
import { IPublicChatItem } from "./publicChatTypes";
import { IUser } from "./userTypes";

export interface ServerToClientEvents {
  connected_guests: (totalGuests: number) => void;
  public_chat_typing_start: () => void;
  public_chat_typing_stop: () => void;
  public_chat_message: (publicMessage: IPublicChatItem) => void;
  online_users: (usersIds: string[]) => void;
  user_registered: (newUser: IUser) => void;
  user_updated: (updatedUser: IUser) => void;
  notification: (updatedUser: INotifications) => void;
  public_chat_message_reaction: (publicMessage: IPublicChatItem) => void;
  private_chat_message: (privateMessage: IPrivateMessage) => void;
  conversation_read: (data: { receiver: string; sender: string }) => void;
}

export interface ClientToServerEvents {
  public_chat_typing_start: () => void;
  public_chat_typing_stop: () => void;
  user_joined_conversation: (data: { firstParty: string; secondParty: string }) => void;
  user_leaved_conversation: (data: { firstParty: string; secondParty: string }) => void;
}
