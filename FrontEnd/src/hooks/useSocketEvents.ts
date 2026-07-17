/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useAppSelector } from "../context/hooks";
import { selectSocket } from "../context/appStateSlice";
import { IOnlineUser, IUser } from "../features/user/types";
import { IPublicChatItem } from "../features/chats/public-chat/types";
import { INotifications } from "../features/notifications/types";
import { IPrivateMessage } from "../features/chats/private-chat/types";

export interface ServerToClientEvents {
  connected_guests: (totalGuests: number) => void;
  public_chat_typing_start: () => void;
  public_chat_typing_stop: () => void;
  public_chat_message: (publicMessage: IPublicChatItem) => void;
  online_users: (usersIds: IOnlineUser[]) => void;
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

export const useSocketEvents = (eventHandlers: {
  [K in keyof ServerToClientEvents]?: ServerToClientEvents[K];
}) => {
  const socket = useAppSelector(selectSocket);
  useEffect(() => {
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      return socket?.on(event as any, handler);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        return socket?.off(event as any, handler);
      });
    };
  }, [eventHandlers, socket]);
};
