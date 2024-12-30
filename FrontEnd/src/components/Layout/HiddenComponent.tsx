import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import {
  setOnlineUsers,
  showPopup,
  toggleThisEntity,
} from "../../context/StateManeger";
import {
  skipToken,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useListenToSocketEvents } from "../../hooks";
import { User } from "../../types/userTypes";
import {
  TypeCashedPublicChat,
  TypePublicChatItem,
} from "../../types/publicChatTypes";
import { TypeCashedConversations } from "../../types/privateChatTypes";
import { TypeConversationSocketData } from "../../types/othersTypes";
import { TypeCashedChat } from "../../components/Chats/PrivateChat/SendMessagePrivateChat";
import {
  fetchAllConversations,
  fetchPrivateChatMessages,
  fetchPublicChatMessages,
} from "../../utils";
const HiddenComponent = () => {
  // implementing some Logics her better than inside the Layout component, this prevent entire Layout from Re-Rendering unnecessarily
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConversation = useAppSelector(
    (state) => state.stateManeger.activeConversation
  );
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const currentAccountRequestFullfiled = useAppSelector(
    (state) => state.stateManeger.currentAccountRequestFullfiled
  );
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const redirectQuery = searchParams.get("redirectedfrom");
  const refQuery = searchParams.get("referrerUser");

  useInfiniteQuery({
    queryKey: ["conversations"],
    queryFn: ({ pageParam }) => fetchAllConversations({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, pageParam) =>
      lastPage.hasMore ? pageParam + 1 : undefined,
    staleTime: 60 * 60 * 1000,
  });

  useQuery({
    queryKey: ["private-messages", activeConversation],
    queryFn: activeConversation
      ? () => fetchPrivateChatMessages({ secondUserId: activeConversation })
      : skipToken,
    staleTime: 60 * 60 * 1000,
  });

  useInfiniteQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["public-chat-messages"],
    queryFn: ({ pageParam }) =>
      fetchPublicChatMessages({ pageParam, limit: 15 }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage, _, pageParam) => {
      return firstPage.hasOlder ? pageParam + 1 : undefined;
    },
    getNextPageParam: () => undefined,
    staleTime: 60 * 60 * 1000,
  });

  const handleUpdateOnlineUsers = (data: string[]) => {
    const filtered = data.filter((userId) => userId !== "undefined");
    dispatch(setOnlineUsers(filtered));
  };

  const handleRecieveNewPublicChatMessage = (
    newMessage: TypePublicChatItem
  ) => {
    queryClient.setQueryData(
      ["public-chat-messages"],
      (previous: TypeCashedPublicChat): TypeCashedPublicChat => {
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
      }
    );
  };

  const handleUserUpdated = (updatedUser: User) => {
    console.log("i am updated");
    queryClient.invalidateQueries({ queryKey: ["user", updatedUser._id] });
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.setQueryData(
      ["conversations"],
      (previous: TypeCashedConversations): TypeCashedConversations => {
        return {
          ...previous,
          pages: previous.pages.map((page) => {
            return {
              ...page,
              conversations: page.conversations.map((conv) => {
                if (conv.secondParty._id === updatedUser._id) {
                  return { ...conv, secondParty: updatedUser };
                }
                return conv;
              }),
            };
          }),
        };
      }
    );
    queryClient.setQueryData(
      ["private-messages", updatedUser._id],
      (old: TypeCashedChat): TypeCashedChat | undefined => {
        if (!old) return;
        return { ...old, secondUser: updatedUser };
      }
    );
  };

  // const handleAddNewUser = (newUser: User) => {
  //   queryClient.setQueryData(["conversations"], (old: TypeConversation[]) => {
  //     return [
  //       ...old,
  //       { secondParty: newUser, lastMessage: null, unreadedCount: 0 },
  //     ];
  //   });
  //   queryClient.setQueryData(["users"], (previous: User[]) => {
  //     return [...previous, newUser];
  //   });
  // };

  const handleConversationReaded = useCallback(
    (data: TypeConversationSocketData) => {
      queryClient.setQueryData(
        ["private-messages", data.sender],
        (old: TypeCashedChat) => {
          if (old) {
            return {
              ...old,
              messages: old.messages.map((msg) => ({
                ...msg,
                isRead: true,
              })),
            };
          }
        }
      );
    },
    [queryClient]
  );

  useListenToSocketEvents({
    eventsToListen: [],
    handlers: [handleUpdateOnlineUsers],
  });
  useListenToSocketEvents({
    eventsToListen: [
      "online-users",
      "public-message",
      "user-updated",
      // "new-user-joined",
      "conversation-readed",
    ],
    handlers: [
      handleUpdateOnlineUsers,
      handleRecieveNewPublicChatMessage,
      handleUserUpdated,
      // handleAddNewUser,
      handleConversationReaded,
    ],
  });

  useEffect(() => {
    if (redirectQuery) {
      let popupMessage = "";
      if (redirectQuery === "logout") {
        popupMessage = "Logout successfull";
      }
      if (redirectQuery === "login") {
        popupMessage = "Login successfull";
      }
      if (redirectQuery === "signup") {
        popupMessage = "Sign Up successfull";
      }
      if (popupMessage) {
        dispatch(
          showPopup({
            message: popupMessage,
            type: "SUCESS",
          })
        );
        setSearchParams(() => {
          searchParams.delete("redirectedfrom", redirectQuery);
          return searchParams;
        });
      }
    }
  }, [redirectQuery, searchParams, setSearchParams, dispatch]);
  useEffect(() => {
    if (refQuery && !currentUser?._id && currentAccountRequestFullfiled) {
      dispatch(toggleThisEntity({ entity: "openRegisterForm", value: true }));
    }
  }, [dispatch, refQuery, currentUser?._id, currentAccountRequestFullfiled]);
  return <></>;
};

export default HiddenComponent;
