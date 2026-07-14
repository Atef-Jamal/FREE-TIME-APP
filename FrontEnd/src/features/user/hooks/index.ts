import { skipToken, useQuery } from "@tanstack/react-query";
import { fetchGuestsCount, fetchOnlineUsersData, fetchTopUser, fetchUserById } from "../services";

export const useFetchUser = ({ userId }: { userId: string | undefined }) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: userId ? () => fetchUserById({ userId }) : skipToken,
  });
};

export const useFetchOnlineUsersData = () => {
  return useQuery({
    queryKey: ["onlines-users-data"],
    queryFn: fetchOnlineUsersData,
  });
};

export const useFetchActiveGuestsCount = () => {
  return useQuery<number>({
    queryKey: ["total-guests"],
    queryFn: fetchGuestsCount,
  });
};

export const useFetchTopUser = () => {
  return useQuery({
    queryKey: ["top-user"],
    queryFn: fetchTopUser,
  });
};
