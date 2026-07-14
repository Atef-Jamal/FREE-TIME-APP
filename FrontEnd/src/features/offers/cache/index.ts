import { QueryClient } from "@tanstack/react-query";
import { IUser } from "../../user/types";
import { IOffer } from "../types";

export const updateOfferCache = ({
  queryClient,
  offerId,
  user,
}: {
  queryClient: QueryClient;
  offerId: string;
  user: Pick<IUser, "_id" | "name">;
}) => {
  return queryClient.setQueryData(["offers", offerId], (previous: IOffer | undefined): IOffer | undefined => {
    if (!previous) return;
    return { ...previous, completedBy: [...previous.completedBy, user] };
  });
};
