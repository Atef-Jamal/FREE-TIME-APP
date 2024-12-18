import { useEffect, useState } from "react";
import { makeRequest } from "../utils";
import { handleApiError } from "../utils/common";

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
      setError(null);
      setErrorLoadMore(null);
      if (page === 1) setLoading(true);
      if (page > 1) setLoadMore(true);

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
        } else {
          const err = handleApiError(error);
          setError(err);
        }
      } finally {
        setLoading(false);
        setLoadMore(false);
      }
    };
    getApps();
  }, [filterQuery, page, limitPerPage]);

  return { loading, apps, error, loadMore, noMoreApps, errorLoadMore };
};
