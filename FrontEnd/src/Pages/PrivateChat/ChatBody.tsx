import { useCallback, useEffect, useRef } from "react";
import { skipToken, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImSpinner3 } from "react-icons/im";
import { ICashedConversations } from "../../types/privateChatTypes";
import { showPopup } from "../../context/StateManeger";
import { handleApiError } from "../../utils/common";
import { fetchPrivateChatMessages, makeRequest } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import SendMessagePrivateChat from "./SendMessagePrivateChat";
import PrivateMessageItem from "./PrivateMessageItem";
import UserImage from "../../components/Shared/Common/UserImage";

const ChatBody = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const onlineUsers = useAppSelector((state) => state.stateManeger.onlineUsers);
  const activeConversation = useAppSelector((state) => state.stateManeger.activeConversation);
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const {
    data = { messages: [], secondUser: null },
    status,
    error,
  } = useQuery({
    queryKey: ["conversation-messages", activeConversation],
    queryFn: activeConversation
      ? () => fetchPrivateChatMessages({ secondUserId: activeConversation })
      : skipToken,
    staleTime: 60 * 60 * 1000,
  });

  const markAsReaded = useCallback(async () => {
    const isUnReadMsgs = data.messages.some((msg) => !msg.isRead && msg.sender._id === activeConversation);
    if (data.messages.length === 0 || !isUnReadMsgs) return;

    socket?.emit("conversation-readed", {
      reciever: activeConversation,
      sender: currentUser?._id,
    });

    try {
      await makeRequest.get(`api/conversations/${activeConversation}/mark-as-read`);
      queryClient.setQueryData(["conversations"], (previous: ICashedConversations): ICashedConversations => {
        return {
          ...previous,
          pages: previous.pages.map((page) => {
            return {
              ...page,
              conversations: page.conversations.map((conv) => {
                if (conv.secondParty._id === activeConversation) {
                  return { ...conv, unreadedCount: 0 };
                }
                return conv;
              }),
            };
          }),
        };
      });
    } catch (error) {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    }
  }, [activeConversation, data.messages, queryClient, dispatch, socket, currentUser?._id]);

  const scrollToLastMessage = useCallback(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToLastMessage();
    markAsReaded();
  }, [activeConversation, markAsReaded, scrollToLastMessage]);

  if (!activeConversation) return;

  if (status === "pending") {
    return (
      <div className="flex h-full items-center justify-center border border-x border-gray-700 bg-[#332342] 2xl:flex-1">
        <ImSpinner3 className="animate-spin text-4xl md:text-6xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center border border-x border-gray-700 bg-[#332342] px-5 text-center text-[#f12828] 2xl:flex-1">
        {error.response?.data.error}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col border-x border-gray-700 bg-[#332342] 2xl:flex-1">
      <div className="flex items-center justify-center gap-10 border-b border-gray-700 bg-[#1f1f2e9a] py-1 sm:py-2">
        <div className="flex items-center gap-3">
          <div className="h-[25px] w-[30px] sm:h-[32px] sm:w-[37px]">
            <UserImage user={data.secondUser} />
          </div>
          <span className="text-sm font-bold text-[#3785fa] md:text-base">{data.secondUser?.name}</span>
        </div>
        {onlineUsers.includes(activeConversation) ? (
          <span className="text-xs font-bold tracking-wide text-[#68e44a] md:text-sm">online</span>
        ) : (
          <span className="text-xs font-bold tracking-wide text-[#54724c] md:text-sm">offline</span>
        )}
      </div>

      <div className="scrollbar-custom flex-1 overflow-y-auto max-lg:scrollbar-thin">
        {data.messages.map((msg, index) => (
          <PrivateMessageItem
            key={msg._id}
            messagesLength={data.messages.length}
            message={msg}
            index={index}
            lastMessageRef={lastMessageRef}
          />
        ))}
      </div>

      <SendMessagePrivateChat id={activeConversation} />
    </div>
  );
};

export default ChatBody;
