import { useEffect, useState } from "react";
import {
  setAllUnReadedMesseges,
  setRefetchUnReadedMessagesCount,
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
      if (!secondUserId) {
        return;
      }
      try {
        const response = await makeRequest.patch(
          `api/conversations/${secondUserId}`,
          {
            FOR_CONSISTENCY: "FOR_CONSISTENCY",
          }
        );
        if (response.status === 200) {
          socket?.emit("conversation-readed", {
            reciever: secondUserId,
            sender: currentUser?._id,
          });
          dispatch(setRefetchUnReadedMessagesCount(secondUserId));
          dispatch(
            setAllUnReadedMesseges({ type: "REMOVE", userId: secondUserId })
          );
        }
      } catch (error) {
        dispatch(
          showPopup({
            status: true,
            message: handleApiError(error),
            type: "ERROR_GENERAL",
          })
        );
      }
    };
    markAsReaded();
  }, [messages, secondUserId]);

  return { messages, setMessages, secondUser, setSecondUser, loading, error };
};
