import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { skipToken, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import io from "socket.io-client";
import { IUser } from "../types/userTypes";
import { ICashedPublicChat, IPublicChatItem } from "../types/publicChatTypes";
import { ICashedSingleConversation, ICashedConversations, IPrivateMessage } from "../types/privateChatTypes";
import { IConversationReadedSocketData } from "../types/othersTypes";
import { useAppDispatch, useAppSelector } from "../context/hooks";
import {
  showModal,
  setOnlineUsers,
  setSocket,
  openToast,
  updateThisEntity,
  setCurrentUser,
  updateCurrentUserStatus,
  disconnectSocket,
  updateSidebarUnReadedMsgCount,
} from "../context/appStateSlice";
import { useListenToSocketEvents } from "./useListenToSocketEvents";
import {
  fetchAllConversations,
  fetchPrivateChatMessages,
  fetchPublicChatMessages,
  makeRequest,
} from "../services";
import { debounce, handleApiError } from "../utilities";
import messageSoundSrc from "../assets/images/messageSound.mp3";

export const useInitialization = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChatWithUserId = useAppSelector((state) => state.appState.activeChatWithUserId);
  const currentUserId = useAppSelector((state) => state.appState.currentUser?._id);
  const currentUserStatus = useAppSelector((state) => state.appState.currentUserStatus);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const location = useLocation();

  const userAuth = currentUserStatus === "authenticated";

  const isPrivateChatPageOpen = location.pathname === "/privatechat";
  const redirectQuery = searchParams.get("redirectedfrom");
  const refQuery = searchParams.get("referrerUser");

  const handleUpdateOnlineUsers = useCallback(
    (data: string[]) => {
      const filtered = data.filter((userId) => userId !== "undefined");
      dispatch(setOnlineUsers(filtered));
    },
    [dispatch],
  );

  const handleRecieveNewPublicChatMessage = useCallback(
    (newMessage: IPublicChatItem) => {
      queryClient.setQueryData(["public-chat-messages"], (previous: ICashedPublicChat): ICashedPublicChat => {
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
      });
    },
    [queryClient],
  );

  const handleNewPrivateMessage = useCallback(
    (data: IPrivateMessage) => {
      if (!isPrivateChatPageOpen) {
        dispatch(
          updateSidebarUnReadedMsgCount({
            type: "ADD-ONE",
            userId: data.sender._id,
          }),
        );
        new Audio(messageSoundSrc).play();
      }

      const allConversations: ICashedConversations | undefined = queryClient.getQueryData(["conversations"]);

      const isConversationExistOnTheList = allConversations?.pages.some((page) =>
        page.conversations.some((conv) => conv.secondParty._id === data.sender._id),
      );

      queryClient.setQueryData(["conversations"], (previous: ICashedConversations): ICashedConversations => {
        if (!isConversationExistOnTheList) {
          return {
            ...previous,
            pages: previous.pages.map((page, index) => {
              const firstPage = index === 0;
              const newConversation = {
                _id: data.conversationId,
                lastMessage: data,
                secondParty: data.sender,
                unReadCount: 1,
              };
              if (firstPage) {
                return {
                  ...page,
                  conversations: [newConversation, ...page.conversations],
                };
              } else {
                return page;
              }
            }),
          };
        }
        return {
          ...previous,
          pages: previous.pages.map((page) => {
            return {
              ...page,
              conversations: page.conversations.map((conv) => {
                const isConversationWithUserOpen = conv.secondParty._id === activeChatWithUserId;
                if (conv.secondParty._id === data.sender._id) {
                  return {
                    ...conv,
                    lastMessage: data,
                    unReadCount: isConversationWithUserOpen ? conv.unReadCount : conv.unReadCount + 1,
                  };
                }
                return conv;
              }),
            };
          }),
        };
      });

      queryClient.setQueryData(
        ["conversation-messages", data.sender._id],
        (previous: ICashedSingleConversation): ICashedSingleConversation => {
          return {
            ...previous,
            pages: previous.pages.map((page, index) => {
              if (index === previous.pages.length - 1) return { ...page, messages: [...page.messages, data] };
              return page;
            }),
          };
        },
      );
    },
    [queryClient, activeChatWithUserId, dispatch, isPrivateChatPageOpen],
  );

  const handleUserUpdated = useCallback(
    (updatedUser: IUser) => {
      queryClient.invalidateQueries({ queryKey: ["user", updatedUser._id] });
      queryClient.invalidateQueries({ queryKey: ["live-stats-users"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard-users"] });
      queryClient.setQueryData(["conversations"], (previous: ICashedConversations): ICashedConversations => {
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
      });
      queryClient.setQueryData(
        ["conversation-messages", updatedUser._id],
        (previous: ICashedSingleConversation): ICashedSingleConversation | undefined => {
          if (!previous) return;
          return {
            ...previous,
            pages: previous.pages.map((page) => {
              return { ...page, secondUser: updatedUser };
            }),
          };
        },
      );
    },
    [queryClient],
  );

  const handleConversationReaded = useCallback(
    (data: IConversationReadedSocketData) => {
      queryClient.setQueryData(
        ["conversation-messages", data.sender],
        (previous: ICashedSingleConversation): ICashedSingleConversation | undefined => {
          if (!previous) return;
          return {
            ...previous,
            pages: previous.pages.map((page) => ({
              ...page,
              messages: page.messages.map((msg) => ({ ...msg, isRead: true })),
            })),
          };
        },
      );
    },
    [queryClient],
  );

  const handleNewUserRegistered = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  }, [queryClient]);

  useInfiniteQuery({
    queryKey: ["conversations"],
    queryFn: userAuth ? ({ pageParam }) => fetchAllConversations({ pageParam }) : skipToken,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, pageParam) => (lastPage.hasMore ? pageParam + 1 : undefined),
    staleTime: 60 * 60 * 1000,
  });

  useInfiniteQuery({
    queryKey: ["conversation-messages", activeChatWithUserId],
    queryFn:
      userAuth && activeChatWithUserId
        ? ({ pageParam }) => fetchPrivateChatMessages({ pageParam, activeChatWithUserId })
        : skipToken,
    initialPageParam: 1,
    getPreviousPageParam: (firstPage, _, pageParam) => {
      return firstPage.hasOlder ? pageParam + 1 : undefined;
    },
    getNextPageParam: () => undefined,
    staleTime: 60 * 60 * 1000,
  });

  useInfiniteQuery({
    queryKey: ["public-chat-messages"],
    queryFn: ({ pageParam }) => fetchPublicChatMessages({ pageParam, limit: 15 }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage, _, pageParam) => {
      return firstPage.hasOlder ? pageParam + 1 : undefined;
    },
    getNextPageParam: () => undefined,
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    let token = localStorage.getItem("token");

    if (!token) {
      const googleAuthToken = searchParams.get("token");
      if (googleAuthToken) {
        token = searchParams.get("token");
        localStorage.setItem("token", googleAuthToken);
      }
    }

    const getCurrentUser = async () => {
      try {
        if (token) {
          const response = await makeRequest.get("api/auth/currentuser");
          dispatch(setCurrentUser(response.data));
          dispatch(updateCurrentUserStatus("authenticated"));
        } else {
          dispatch(updateCurrentUserStatus("unauthenticated"));
        }
      } catch (error) {
        dispatch(updateCurrentUserStatus("unauthenticated"));
        dispatch(
          openToast({
            type: "ERROR_GENERAL",
            message: handleApiError(error),
          }),
        );
      }
    };
    getCurrentUser();
  }, [searchParams, dispatch]);

  const events = useMemo(
    () => [
      "online-users",
      "public-message",
      "private-message",
      "user-updated",
      "conversation-readed",
      "new-user-registered",
    ],
    [],
  );
  const handlers = useMemo(
    () => [
      handleUpdateOnlineUsers,
      handleRecieveNewPublicChatMessage,
      handleNewPrivateMessage,
      handleUserUpdated,
      handleConversationReaded,
      handleNewUserRegistered,
    ],
    [
      handleUpdateOnlineUsers,
      handleRecieveNewPublicChatMessage,
      handleNewPrivateMessage,
      handleUserUpdated,
      handleConversationReaded,
      handleNewUserRegistered,
    ],
  );

  useListenToSocketEvents({
    eventsToListen: events,
    handlers: handlers,
  });

  useEffect(() => {
    if (currentUserStatus === "pending") return;

    const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
      query: { userId: currentUserId },
    });
    dispatch(setSocket(socket));
    return () => {
      dispatch(disconnectSocket());
    };
  }, [currentUserStatus, currentUserId, dispatch]);

  useEffect(() => {
    if (refQuery && currentUserStatus === "unauthenticated") {
      dispatch(showModal("register-modal"));
    }
  }, [dispatch, refQuery, currentUserStatus]);

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
          openToast({
            message: popupMessage,
            type: "SUCESS",
          }),
        );
        setSearchParams(() => {
          searchParams.delete("redirectedfrom", redirectQuery);
          return searchParams;
        });
      }
    }
  }, [redirectQuery, searchParams, setSearchParams, dispatch]);

  useEffect(() => {
    const handleNetworkOnline = () => {
      dispatch(openToast({ message: "Back online", type: "SUCESS" }));
    };

    const handleNetworkOffline = () => {
      dispatch(openToast({ message: "No internet connection", type: "ERROR_GENERAL" }));
    };

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        dispatch(updateThisEntity({ entity: "smallScreen", value: true }));
      } else {
        dispatch(updateThisEntity({ entity: "smallScreen", value: false }));
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const debouncedResize: any = debounce(handleResize, 250);

    window.addEventListener("online", handleNetworkOnline);
    window.addEventListener("offline", handleNetworkOffline);
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("online", handleNetworkOnline);
      window.removeEventListener("offline", handleNetworkOffline);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [dispatch]);
};
