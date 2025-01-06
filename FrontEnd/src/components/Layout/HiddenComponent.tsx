import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { openModel, setOnlineUsers, setSocet, showPopup } from "../../context/StateManeger";
import { skipToken, useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useListenToSocketEvents } from "../../hooks";
import { User } from "../../types/userTypes";
import { TypeCashedPublicChat, TypePublicChatItem } from "../../types/publicChatTypes";
import { TypeCashedConversations } from "../../types/privateChatTypes";
import { TypeConversationSocketData } from "../../types/othersTypes";
import { TypeCashedChat } from "../../components/Chats/PrivateChat/SendMessagePrivateChat";
import { fetchAllConversations, fetchPrivateChatMessages, fetchPublicChatMessages } from "../../utils";
import io from "socket.io-client";
import RegisterationForm from "../Navebare/Registration/RegisterationForm";

// implementing some Logics her better than inside the Layout component, this prevent entire Layout from Re-Rendering
// unnecessarily

const HiddenComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConversation = useAppSelector((state) => state.stateManeger.activeConversation);
  const currentUserId = useAppSelector((state) => state.stateManeger.currentUser?._id);
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const redirectQuery = searchParams.get("redirectedfrom");
  const refQuery = searchParams.get("referrerUser");

  useInfiniteQuery({
    queryKey: ["conversations"],
    queryFn: ({ pageParam }) => fetchAllConversations({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, pageParam) => (lastPage.hasMore ? pageParam + 1 : undefined),
    staleTime: 60 * 60 * 1000,
  });

  useQuery({
    queryKey: ["conversation-messages", activeConversation],
    queryFn: activeConversation
      ? () => fetchPrivateChatMessages({ secondUserId: activeConversation })
      : skipToken,
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

  const handleUpdateOnlineUsers = (data: string[]) => {
    const filtered = data.filter((userId) => userId !== "undefined");
    dispatch(setOnlineUsers(filtered));
  };

  const handleRecieveNewPublicChatMessage = (newMessage: TypePublicChatItem) => {
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
      },
    );
  };

  const handleUserUpdated = (updatedUser: User) => {
    queryClient.invalidateQueries({ queryKey: ["user", updatedUser._id] });
    queryClient.invalidateQueries({ queryKey: ["live-stats-users"] });
    queryClient.invalidateQueries({ queryKey: ["leaderboard-users"] });
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
      },
    );
    queryClient.setQueryData(
      ["conversation-messages", updatedUser._id],
      (previous: TypeCashedChat): TypeCashedChat | undefined => {
        if (!previous) return;
        return { ...previous, secondUser: updatedUser };
      },
    );
  };

  const handleConversationReaded = useCallback(
    (data: TypeConversationSocketData) => {
      queryClient.setQueryData(["conversation-messages", data.sender], (previous: TypeCashedChat) => {
        if (previous) {
          return {
            ...previous,
            messages: previous.messages.map((msg) => ({
              ...msg,
              isRead: true,
            })),
          };
        }
      });
    },
    [queryClient],
  );

  useListenToSocketEvents({
    eventsToListen: [],
    handlers: [handleUpdateOnlineUsers],
  });
  useListenToSocketEvents({
    eventsToListen: ["online-users", "public-message", "user-updated", "conversation-readed"],
    handlers: [
      handleUpdateOnlineUsers,
      handleRecieveNewPublicChatMessage,
      handleUserUpdated,
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
    if (refQuery && currentUserStatus === "unauthenticated") {
      dispatch(
        openModel({
          status: true,
          children: <RegisterationForm />,
        }),
      );
    }
  }, [dispatch, refQuery, currentUserStatus]);

  useEffect(() => {
    if (currentUserStatus === "pending") return;
    const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
      query: { userId: currentUserId },
    });
    dispatch(setSocet(socket));
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [currentUserStatus, currentUserId, dispatch]);

  return <></>;
};

export default HiddenComponent;
