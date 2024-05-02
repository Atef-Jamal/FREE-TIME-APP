import { useEffect, useState } from "react";
import { User } from "../types/user";
import { handleApiError, makeRequest } from "../utils";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import {
  setAllUnReadedMesseges,
  setRefetchUnReadedMessagesCount,
  showPopup,
} from "../context/StateManeger";
import { TypeNotifications } from "../types/notification";
import { TypeTaskApp } from "../types/others";
import { TypePrivateMessage } from "../types/privateChat";
import { TypePublicChatItem } from "../types/publicChat";

export const useFetchAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getUsersData = async () => {
      setError(null);
      setLoading(true);
      try {
        const response = await makeRequest.get(`/api/users`);
        const data = response.data;
        setUsers(data);
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
    getUsersData();
  }, []);

  return { users, setUsers, loading, error };
};

export const useFetchUser = ({
  userId,
  initialLoading = false,
  dependencies = [],
}: {
  userId: string | undefined;
  initialLoading: boolean;
  dependencies?: any[];
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      if (!userId) return;
      setError(null);
      setLoading(true);
      try {
        const response = await makeRequest.get(`/api/users/${userId}`);
        const data = response.data;
        setUser(data);
      } catch (error) {
        const err = handleApiError(error);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    getUserData();
  }, dependencies);

  return { user, setUser, loading, error };
};

export const useFetchActivities = ({
  userId,
  initialLoading = false,
  dependencies = [],
}: {
  userId: string | undefined;
  initialLoading?: boolean;
  dependencies?: any[];
}) => {
  const [activities, setActivities] = useState<TypeNotifications[]>([]);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getUserData = async () => {
      if (!userId) return;
      setError(null);
      setLoading(true);
      try {
        const response = await makeRequest.get(`/api/notifications/${userId}`);
        const data = response.data;
        setActivities(data);
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
    getUserData();
  }, dependencies);

  return { activities, loading, error };
};

export const useFetchTaskApp = ({
  appId,
  initialLoading = false,
  dependencies = [],
}: {
  appId: string | undefined;
  initialLoading?: boolean;
  dependencies?: any[];
}) => {
  const [taskApp, setTaskApp] = useState<TypeTaskApp | null>(null);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getApp = async () => {
      if (!appId) return;
      setError(null);
      setLoading(true);
      try {
        const response = await makeRequest.get(`api/tasks/${appId}`);
        const data = response.data;
        setTaskApp(data);
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
    getApp();
  }, dependencies);

  return { taskApp, loading, error };
};

export const useFetchAllApps = ({
  initialLoading = false,
  dependencies = [],
  filterQuery,
  setNoMoreTasks,
  limit,
}: {
  initialLoading?: boolean;
  filterQuery: "ALL" | "POPULAR" | "RAITING" | "REWARD";
  limit: number;
  setNoMoreTasks: React.Dispatch<React.SetStateAction<boolean>>;
  dependencies?: any[];
}) => {
  const [apps, setApps] = useState<TypeTaskApp[]>([]);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getApps = async () => {
      setError(null);
      if (!loading) setLoading(true);
      try {
        const response = await makeRequest.get(
          `api/tasks?filter=${filterQuery}&&page=1&&limitedPerPage=${limit}`
        );
        const data = response.data;
        setNoMoreTasks(data.noApps);
        const sorted = response.data.apps.sort(
          (a: TypeTaskApp, b: TypeTaskApp) => {
            if (a.completedBy.length > b.completedBy.length) {
              return -1;
            }
            return 1;
          }
        );
        setApps(sorted);
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
    getApps();
  }, dependencies);

  return { apps, setApps, loading, error };
};

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
  const { currentUser, socet } = useAppSelector((state) => state.stateManeger);
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
          socet?.emit("conversation-readed", {
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

export const useListenToEvent = <T>({
  eventToListen,
  onUpdate,
  dependencies = [],
}: {
  eventToListen: string;
  onUpdate: (arg: T) => void;
  dependencies?: any[];
}) => {
  const { socet } = useAppSelector((state) => state.stateManeger);

  useEffect(() => {
    if (socet) {
      socet.on(eventToListen, onUpdate);
      return () => {
        socet.off(eventToListen, onUpdate);
      };
    }
  }, [socet, ...dependencies]);
};
