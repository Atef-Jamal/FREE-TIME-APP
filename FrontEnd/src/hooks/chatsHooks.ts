import { useEffect, useState } from "react";
import {
  updateSidebarUnReadedMsgCount,
  handleRefetchUnReadedMsgCount,
  showPopup,
} from "../context/StateManeger";
import { makeRequest } from "../utils";
import { handleApiError } from "../utils/common";

import { useAppDispatch, useAppSelector } from "../context/Hooks";
import { User } from "../types/userTypes";
import { TypePrivateMessage } from "../types/privateChatTypes";
import { TypePublicChatItem } from "../types/publicChatTypes";

export const useFetchPublicMessages = () => {
  const [messages, setMessages] = useState<TypePublicChatItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getPublicChatMessages = async () => {
      setError(null);
      setLoading(true);
      try {
        const response = await makeRequest.get("api/publicchat");
        const data = response.data;
        setMessages(data);
      } catch (error) {
        const err = handleApiError(error);
        setError(err);
        dispatch(
          showPopup({
            status: true,
            message: handleApiError(error),
            type: "ERROR_GENERAL",
          })
        );
      } finally {
        setLoading(false);
      }
    };
    getPublicChatMessages();
  }, []);

  return { messages, setMessages, loading, error };
};

export const useFetchPrivateChatMessages = ({
  secondUserId,
  dependencies = [],
}: {
  secondUserId: string | undefined;
  dependencies?: any[];
}) => {
  const { currentUser, socket } = useAppSelector((state) => state.stateManeger);
  const [messages, setMessages] = useState<TypePrivateMessage[]>([]);
  const [secondUser, setSecondUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getMessages = async () => {
      if (!secondUserId || !currentUser) return;
      setError(null);
      setLoading(true);
      try {
        const response = await makeRequest.get(
          `api/conversations/${secondUserId}`
        );
        setMessages(response.data.messages);
        setSecondUser(response.data.secondUser);
      } catch (error) {
        const err = handleApiError(error);
        setError(err);
        dispatch(
          showPopup({ status: true, message: err, type: "ERROR_GENERAL" })
        );
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, dependencies);

  useEffect(() => {
    const markAsReaded = async () => {
      const lastMessage = messages[messages.length - 1];
      const lastMessageIsnotReaded =
        lastMessage?.sender._id === secondUser?._id &&
        lastMessage?.isRead === false;

      if (secondUserId && messages.length > 0 && lastMessageIsnotReaded) {
        try {
          await makeRequest.patch(`api/conversations/${secondUserId}`, {
            FOR_CONSISTENCY: "FOR_CONSISTENCY",
          });

          socket?.emit("conversation-readed", {
            reciever: secondUserId,
            sender: currentUser?._id,
          });

          dispatch(handleRefetchUnReadedMsgCount(secondUserId));
          dispatch(
            updateSidebarUnReadedMsgCount({
              type: "REMOVE",
              userId: secondUserId,
            })
          );

          console.log("I'am Run");
        } catch (error) {
          dispatch(
            showPopup({
              status: true,
              type: "ERROR_GENERAL",
              message: handleApiError(error),
            })
          );
        }
      }
    };
    markAsReaded();
  }, [messages, secondUserId]);

  return { messages, setMessages, secondUser, setSecondUser, loading, error };
};
