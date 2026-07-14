import { skipToken, useQuery } from "@tanstack/react-query";
import { fetchMyNotifications } from "../services";

export const useFetchNotifications = ({ userAuth }: { userAuth: boolean }) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: userAuth ? fetchMyNotifications : skipToken,
  });
};
