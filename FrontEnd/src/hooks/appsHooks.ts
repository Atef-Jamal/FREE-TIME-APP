import { useEffect, useState } from "react";
import { showPopup } from "../context/StateManeger";
import { makeRequest } from "../utils";
import { handleApiError } from "../utils/common";

import { useAppDispatch } from "../context/Hooks";
import { TypeFilterQuery, TypeTaskApp } from "../types/earnTypes";

export const useFetchAllApps = ({
  filterQuery,
  page,
  limitPerPage,
}: {
  filterQuery: TypeFilterQuery;
  limitPerPage: number;
  page: number;
}) => {
  const [apps, setApps] = useState<TypeTaskApp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [errorLoadMore, setErrorLoadMore] = useState<string | null>(null);
  const [noMoreApps, setNoMoreApps] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getApps = async () => {
      if (page > 1) setLoadMore(true);
      if (error) setError(null);
      if (errorLoadMore) setErrorLoadMore(null);
      if (page === 1) setLoading(true);

      try {
        const response = await makeRequest.get(
          `api/tasks?filter=${filterQuery}&&page=${page}&&limitedPerPage=${limitPerPage}`
        );
        const data = response.data;
        if (page === 1) setApps(data);
        if (page > 1) setApps((prev) => [...prev, ...data]);
        if (data.length < limitPerPage) {
          setNoMoreApps(true);
        } else {
          setNoMoreApps(false);
        }
      } catch (error) {
        if (page > 1) {
          setErrorLoadMore("Error while loading more apps");
          return;
        }
        const err = handleApiError(error);
        setError(err);
      } finally {
        setLoading(false);
        setLoadMore(false);
      }
    };
    getApps();
  }, [filterQuery, page]);

  return { loading, apps, error, loadMore, noMoreApps, errorLoadMore };
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
