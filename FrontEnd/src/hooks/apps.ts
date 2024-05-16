import { useEffect, useState } from "react";
import { showPopup } from "../context/StateManeger";
import { makeRequest } from "../utils";
import { handleApiError } from "../utils/common";

import { useAppDispatch } from "../context/Hooks";
import { TypeTaskApp } from "../types/earn";

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
        const data: { apps: TypeTaskApp[]; noApps: boolean } = response.data;
        setNoMoreTasks(data.noApps);
        data.apps.sort((a, b) => {
          if (
            a.isAvailable === "AVAILABLE" &&
            b.isAvailable === "UNAVAILABLE"
          ) {
            return -1;
          } else if (
            a.isAvailable === "UNAVAILABLE" &&
            b.isAvailable === "AVAILABLE"
          ) {
            return 1;
          } else {
            return 0;
          }
        });
        setApps(data.apps);
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
