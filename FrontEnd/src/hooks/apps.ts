import { useEffect, useState } from "react";
import { showPopup } from "../context/StateManeger";
import { handleApiError, makeRequest } from "../utils";
import { useAppDispatch } from "../context/Hooks";
import { TypeTaskApp } from "../types/others";

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
