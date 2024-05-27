import { useEffect, useState } from "react";
import { showPopup } from "../context/StateManeger";
import { makeRequest } from "../utils";
import { handleApiError } from "../utils/common";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import { TypePrivateMessage } from "../types/privateChatTypes";
import { TypePublicChatItem } from "../types/publicChatTypes";
import { User } from "../types/userTypes";

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
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [messages, setMessages] = useState<TypePrivateMessage[]>([]);
  const [secondUser, setSecondUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
        const userRes = await makeRequest.get(`/api/users/${secondUserId}`);
        setSecondUser(userRes.data);
        setMessages(response.data);
      } catch (error) {
        const err = handleApiError(error);
        setError(err);
        dispatch(showPopup({ message: err, type: "ERROR_GENERAL" }));
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, dependencies);

  return { messages, setMessages, secondUser, loading, error };
};
