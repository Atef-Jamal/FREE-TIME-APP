import { useEffect, useState } from "react";
import { showPopup } from "../context/StateManeger";
import { useAppDispatch } from "../context/Hooks";
import { makeRequest } from "../utils";
import { handleApiError } from "../utils/common";
import { TypeNotifications } from "../types/notificationTypes";
import { User } from "../types/userTypes";
import { useSearchParams } from "react-router-dom";
import { TypeUseScrollToElementHook } from "../types/othersTypes";

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

export const useScrollToElement = ({
  key = "to",
  scrollPosition = "center",
  dependencies = [],
}: TypeUseScrollToElementHook) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get(key);
  useEffect(() => {
    if (queryParam) {
      const targetElement = document.getElementById(queryParam);
      const handleRemoveAnimation = (event: MouseEvent) => {
        const targetElement = event.currentTarget as HTMLElement;
        targetElement.classList.remove("activeElement");
        setSearchParams((prev) => {
          prev.delete(key);
          return prev;
        });
      };

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: scrollPosition,
        });
        targetElement.classList.add("activeElement");
        targetElement.addEventListener("click", handleRemoveAnimation);
        return () => {
          targetElement.classList.remove("activeElement");
          targetElement.removeEventListener("click", handleRemoveAnimation);
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParam, setSearchParams, key, ...dependencies]);
};
