import { useCallback } from "react";
import notificationSoundSrc from "../assets/audios/notificationSound.wav";
import { useSocketEvents } from "../hooks/useSocketEvents";
import { displaySound } from "../utils";
import messageSoundSrc from "../assets/audios/messageSound.mp3";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../context/hooks";
import {
  selectActiveSecondUserId,
  selectCurrentUser,
  selectIsChatOpen,
  setPublicMsgRedPoint,
} from "../context/appStateSlice";
import { useLocation } from "react-router-dom";
import { IPublicChatItem } from "../features/chats/public-chat/types";
import { ICashedSingleConversation, IPrivateMessage } from "../features/chats/private-chat/types";
import { INotifications } from "../features/notifications/types";
import { IOnlineUser, IUser } from "../features/user/types";
import { addNewPublicMsgCache } from "../features/chats/public-chat/cache";
import {
  addReceivedPrivateMsgCache,
  updateTotalUnReadPrivateMsgsCache,
} from "../features/chats/private-chat/cache";
import { updateTotalGuestsCache, updateUserCache } from "../features/user/cache";
import { addNewNotificationCache } from "../features/notifications/cache";

export const useSocketEventBinds = () => {
  const queryClient = useQueryClient();
  const currentUser = useAppSelector(selectCurrentUser);
  const secondUserId = useAppSelector(selectActiveSecondUserId);
  const location = useLocation();
  const isChatOpen = useAppSelector(selectIsChatOpen);
  const dispatch = useAppDispatch();

  const isPrivateChatPageOpen = location.pathname === "/privatechat";

  const handleUpdateOnlineUsers = useCallback(
    (data: IOnlineUser[]) => {
      queryClient.invalidateQueries({ queryKey: ["live-stats-users"] });
      queryClient.setQueryData(["onlines-users"], () => data);
      queryClient.invalidateQueries({ queryKey: ["online-users-data"] });
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
  };

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
    private_chat_message: handleReceivedPrivateMessage,
    conversation_read: handleConversationReaded,
  });
};
