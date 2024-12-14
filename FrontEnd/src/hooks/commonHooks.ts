import { useEffect, useState, useCallback } from "react";
import { showPopup } from "../context/StateManeger";
import { useAppDispatch } from "../context/Hooks";
import { makeRequest } from "../utils";
import { handleApiError } from "../utils/common";

import { TypeNotifications } from "../types/notificationTypes";
import { User } from "../types/userTypes";
import { useSearchParams } from "react-router-dom";
import {
  TypeMusicDetail,
  TypeUseScrollToElementHook,
} from "../types/othersTypes";

export const useFetchAllUsers = (page?: number) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getUsersData = async () => {
      setError(null);
      setLoading(true);
      try {
        let response;
        if (page) {
          response = await makeRequest.get(`/api/users?page=${page}`);
        } else {
          response = await makeRequest.get(`/api/users`);
        }
        const data = response.data;

        setUsers(data);
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
    getUsersData();
  }, [page, dispatch]);

  return { users, setUsers, loading, error };
};

export const useFetchUser = ({ userId }: { userId: string | undefined }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
  }, [userId]);

  return { user, setUser, loading, error };
};

export const useFetchActivities = ({
  userId,
}: {
  userId: string | undefined;
}) => {
  const [activities, setActivities] = useState<TypeNotifications[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getUserActivities = async () => {
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
            message: handleApiError(error),
            type: "ERROR_GENERAL",
          })
        );
      } finally {
        setLoading(false);
      }
    };
    getUserActivities();
  }, [userId, dispatch]);

  return { activities, loading, error };
};

export const useFetchMusics = () => {
  const [musics, setMusics] = useState<TypeMusicDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchMusics = async () => {
      setError(null);
      setLoading(true);
      const url =
        "https://deezerdevs-deezer.p.rapidapi.com/search?q=amr%20diab";
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "ea97c9aa5amsh33c80843d253d57p13e60ejsn31e5ff47a85c",
          "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        setMusics(result.data);
      } catch (error) {
        setError("an Error occurred");
        dispatch(
          showPopup({
            message: "Failed to Load Musics, try again Later",
            type: "ERROR_GENERAL",
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMusics();
  }, [dispatch]);

  return { musics, loading, error };
};

export const useScrollToElement = ({
  key = "to",
  scrollPosition = "center",
  dependencies = [],
}: TypeUseScrollToElementHook) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [element, setElement] = useState<HTMLElement | null>(null);
  const styles = "activeElement";

  useEffect(() => {
    const queryParam = searchParams.get(key);
    if (queryParam) {
      const targetElement = document.getElementById(queryParam);
      setElement(targetElement);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, searchParams, ...dependencies]);

  const handleRemoveAnimation = useCallback(
    (event: MouseEvent) => {
      const targetElement = event.currentTarget as HTMLElement;
      targetElement.classList.remove(styles);
      if (element?.id === targetElement.id) {
        setSearchParams((prev) => {
          prev.delete(key);
          return prev;
        });
      }
      setElement(null);
    },
    [element, key, setSearchParams]
  );

  useEffect(() => {
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: scrollPosition });
    element.classList.add(styles);
    element.addEventListener("click", handleRemoveAnimation);

    return () => {
      element?.classList.remove(styles);
      element?.removeEventListener("click", handleRemoveAnimation);
    };
  }, [element, handleRemoveAnimation, scrollPosition]);

  return { setElement };
};
