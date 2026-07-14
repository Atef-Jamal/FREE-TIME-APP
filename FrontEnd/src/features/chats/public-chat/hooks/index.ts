import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPublicChatMessages } from "../services";

export const useInfinitePublicChatMsges = () => {
  return useInfiniteQuery({
    queryKey: ["public-chat-messages"],
    queryFn: ({ pageParam }) => fetchPublicChatMessages({ pageParam, limit: 15 }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage, _, pageParam) => {
      return firstPage.hasMore ? pageParam + 1 : undefined;
    },
    getNextPageParam: () => undefined,
  });
};
