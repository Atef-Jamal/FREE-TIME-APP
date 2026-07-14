import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchLiveStatsUsers } from "../services";

export const useInfiniteLiveStatsUsers = () => {
  return useInfiniteQuery({
    queryKey: ["live-stats-users"],
    queryFn: ({ pageParam }) => fetchLiveStatsUsers({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastpage, _, pageParam) => {
      return lastpage.hasMore ? pageParam + 1 : undefined;
    },
  });
};
