import { useCallback, useEffect } from "react";
import notificationSoundSrc from "../assets/images/notificationSound.wav";

import {
  addReceivedPrivateMsgCache,
  addNewPublicMsgCache,
  updateTotalUnReadPrivateMsgsCache,
  updateUserCache,
  updateTotalGuestsCache,
  addNewNotificationCache,
  // updateCurrentUserConversationReadCache,
} from "../tanstackQuery/queryCache";

import { useSocketEvents } from "../hooks/useSocketEvents";
import { displaySound } from "../utilities";
import messageSoundSrc from "../assets/images/messageSound.mp3";
import type {
  IUser,
  IPublicChatItem,
  IPrivateMessage,
  INotifications,
  ICashedSingleConversation,
} from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../context/hooks";
import {
  disconnectSocket,
  selectActiveSecondUserId,
  selectCurrentUser,
  selectIsChatOpen,
  selectUserAuth,
  setPublicMsgRedPoint,
  setSocket,
} from "../context/appStateSlice";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

export const useSocketEventBinds = () => {
  const queryClient = useQueryClient();
  const currentUser = useAppSelector(selectCurrentUser);
  const secondUserId = useAppSelector(selectActiveSecondUserId);
  const location = useLocation();
  const userAuth = useAppSelector(selectUserAuth);
  const isChatOpen = useAppSelector(selectIsChatOpen);
  const dispatch = useAppDispatch();

  const isPrivateChatPageOpen = location.pathname === "/privatechat";

  const handleUpdateOnlineUsers = useCallback(
    (data: string[]) => {
      queryClient.invalidateQueries({ queryKey: ["live-stats-users"] });
      queryClient.invalidateQueries({ queryKey: ["onlines-users-data"] });
      queryClient.setQueryData(["onlines-users-ids"], () => data);
    },
    [queryClient],
  );

  const handleRecieveNewPublicChatMessage = useCallback(
    (newMessage: IPublicChatItem) => {
      addNewPublicMsgCache({ queryClient, newMessage });
      if (location.pathname !== "/chat" && !isChatOpen) {
        dispatch(setPublicMsgRedPoint(true));
      }
    },
    [queryClient, isChatOpen, dispatch, location.pathname],
  );

  const handleReceivedPrivateMessage = useCallback(
    (newMessage: IPrivateMessage) => {
      if (!currentUser?._id) return;
      addReceivedPrivateMsgCache({
        queryClient,
        secondUserId,
        newMessage,
        currentUserId: currentUser._id,
        isPrivateChatPageOpen,
      });

      if (!isPrivateChatPageOpen) {
        updateTotalUnReadPrivateMsgsCache({ queryClient, type: "add-one" });
      }
      if (newMessage.sender._id !== secondUserId) displaySound(messageSoundSrc);
    },
    [queryClient, isPrivateChatPageOpen, currentUser?._id, secondUserId],
  );

  const handleUserUpdated = useCallback(
    (updatedUser: IUser) => {
      updateUserCache({ queryClient, updatedUser });
    },
    [queryClient],
  );

  const handleConversationReaded = (data: { receiver: string; sender: string }) => {
    if (!currentUser?._id) return;
    queryClient.setQueryData(
      ["conversation-messages", data.sender],
      (previous: ICashedSingleConversation | undefined): ICashedSingleConversation | undefined => {
        if (!previous) return;
        return {
          ...previous,
          pages: previous.pages.map((page) => ({
            ...page,
            messages: page.messages.map((msg) => {
              if (msg.sender._id === currentUser._id) {
                return { ...msg, isRead: true };
              }
              return msg;
            }),
          })),
        };
      },
    );
    // updateCurrentUserConversationReadCache({
    //   queryClient,
    //   secondUserId: data.sender,
    //   currentUserId: currentUser?._id,
    // });
  };

  const handleNewUserRegistered = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  }, [queryClient]);

  useEffect(() => {
    if (userAuth === "pending") return;

    const socketIo = io(import.meta.env.VITE_SERVER_BASE_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    dispatch(setSocket(socketIo));

    return () => {
      dispatch(disconnectSocket());
      dispatch(setSocket(null));
    };
  }, [userAuth, dispatch]);

  const handleTotalGuests = (totalGuests: number) => {
    updateTotalGuestsCache({ queryClient, totalGuests });
  };

  const handleAddNewNotification = useCallback(
    (newNotification: INotifications) => {
      addNewNotificationCache({ queryClient, newNotification });
      displaySound(notificationSoundSrc);
    },
    [queryClient],
  );

  useSocketEvents({
    connected_guests: handleTotalGuests,
    online_users: handleUpdateOnlineUsers,
    notification: handleAddNewNotification,
    public_chat_message: handleRecieveNewPublicChatMessage,
    user_updated: handleUserUpdated,
    user_registered: handleNewUserRegistered,
    private_chat_message: handleReceivedPrivateMessage,
    conversation_read: handleConversationReaded,
  });
};
