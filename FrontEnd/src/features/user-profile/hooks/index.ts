import { skipToken, useQuery } from "@tanstack/react-query";
import { fetchUserActivities } from "../services";

export const useFetchUserActivities = ({ userId }: { userId: string | undefined }) => {
  return useQuery({
    queryKey: ["user-activities", userId],
    queryFn: userId ? () => fetchUserActivities({ userId }) : skipToken,
  });
};
