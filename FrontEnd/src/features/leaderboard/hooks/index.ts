import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getLeaderboardUsers } from "../services";

export const useFetchLeaderboardUsers = ({ pageParam }: { pageParam: number }) => {
  return useQuery({
    queryKey: ["leaderboard-users", pageParam],
    queryFn: () => getLeaderboardUsers({ pageParam }),
    placeholderData: keepPreviousData,
  });
};
