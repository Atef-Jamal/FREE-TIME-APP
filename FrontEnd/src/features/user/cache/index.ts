import { QueryClient } from "@tanstack/react-query";
import { IUser } from "../types";
import { ICashedConversations } from "../../chats/private-chat/types";
import { ICashedPublicChat } from "../../chats/public-chat/types";

export const updateUserCache = ({
  queryClient,
  updatedUser,
}: {
  queryClient: QueryClient;
  updatedUser: IUser;
}) => {
  queryClient.invalidateQueries({ queryKey: ["live-stats-users"] });
  queryClient.invalidateQueries({ queryKey: ["leaderboard-users"] });

  queryClient.setQueryData(["user", updatedUser._id], () => {
    return updatedUser;
  });

  queryClient.setQueryData(
    ["public-chat-messages"],
    (previous: ICashedPublicChat | undefined): ICashedPublicChat | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page) => ({
          ...page,
          messages: page.messages.map((message) => {
            if (message.sender._id === updatedUser._id) {
              return {
                ...message,
                sender: updatedUser,
              };
            }
            return message;
          }),
        })),
      };
    },
  );

  queryClient.setQueryData(
    ["conversations"],
    (previous: ICashedConversations | undefined): ICashedConversations | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page) => {
          return {
            ...page,
            conversations: page.conversations.map((conv) => {
              if (conv.secondUser._id === updatedUser._id) {
                return { ...conv, secondUser: updatedUser };
              }
              return conv;
            }),
          };
        }),
      };
    },
  );
  return;
};

export const updateTotalGuestsCache = ({
  queryClient,
  totalGuests,
}: {
  queryClient: QueryClient;
  totalGuests: number;
}) => {
  queryClient.setQueryData(["total-guests"], () => {
    return totalGuests;
  });
};
