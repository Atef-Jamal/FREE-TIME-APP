import { QueryClient } from "@tanstack/react-query";
import { ICashedPublicChat, IPublicChatItem, IPublicChatMessage } from "../types";
import { v4 as uuidV4 } from "uuid";

export const addNewPublicMsgCache = ({
  queryClient,
  newMessage,
}: {
  queryClient: QueryClient;
  newMessage: IPublicChatItem;
}) => {
  return queryClient.setQueryData(
    ["public-chat-messages"],
    (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page, index) => {
          if (index === previous.pages.length - 1) {
            return {
              ...page,
              messages: [...page.messages, newMessage],
            };
          }
          return page;
        }),
      };
    },
  );
};

export const deletePublicMsgCache = ({
  queryClient,
  deletedMessage,
}: {
  queryClient: QueryClient;
  deletedMessage: IPublicChatMessage;
}) => {
  return queryClient.setQueryData(
    ["public-chat-messages"],
    (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page) => {
          return {
            ...page,
            messages: page.messages.map((msg) => {
              if (msg._id === deletedMessage._id) {
                return { ...deletedMessage, _id: uuidV4() };
              }
              return msg;
            }),
          };
        }),
      };
    },
  );
};

export const updatePublicMsgCache = ({
  queryClient,
  newMessage,
}: {
  queryClient: QueryClient;
  newMessage: IPublicChatMessage;
}) => {
  return queryClient.setQueryData(
    ["public-chat-messages"],
    (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
      if (!previous) return;

      return {
        ...previous,
        pages: previous.pages.map((page) => {
          return {
            ...page,
            messages: page.messages.map((msg) => {
              if (msg._id === newMessage._id) {
                return newMessage;
              }
              return msg;
            }),
          };
        }),
      };
    },
  );
};

export const addPendingPublicMsgCache = ({
  queryClient,
  optimisticMsg,
}: {
  queryClient: QueryClient;
  optimisticMsg: IPublicChatMessage;
}) => {
  return queryClient.setQueryData(
    ["public-chat-messages"],
    (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page, index) => {
          if (index === previous.pages.length - 1) {
            return { ...page, messages: [...page.messages, optimisticMsg] };
          }
          return page;
        }),
      };
    },
  );
};

export const addSuccessPublicMsgCache = ({
  queryClient,
  uniqeIdForRollback,
  newMessage,
}: {
  queryClient: QueryClient;
  newMessage: IPublicChatMessage;
  uniqeIdForRollback: string;
}) => {
  return queryClient.setQueryData(
    ["public-chat-messages"],
    (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page, index) => {
          if (index === previous.pages.length - 1) {
            return {
              ...page,
              messages: page.messages.map((msg) => {
                if (msg.type === "MESSAGE" && msg._id === uniqeIdForRollback) {
                  return { ...newMessage, isSended: "SUCCESS" };
                }
                return msg;
              }),
            };
          }
          return page;
        }),
      };
    },
  );
};

export const addFailedPublicMsgCache = ({
  queryClient,
  failedMessage,
  uniqeIdForRollback,
}: {
  queryClient: QueryClient;
  failedMessage: IPublicChatItem;
  uniqeIdForRollback: string;
}) => {
  return queryClient.setQueryData(
    ["public-chat-messages"],
    (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page, index) => {
          if (index === previous.pages.length - 1) {
            return {
              ...page,
              messages: page.messages.map((msg) => {
                if (msg._id === uniqeIdForRollback) {
                  return failedMessage;
                }
                return msg;
              }),
            };
          }
          return page;
        }),
      };
    },
  );
};
