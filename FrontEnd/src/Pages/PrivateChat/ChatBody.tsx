import { memo, useCallback, useEffect, useRef } from "react";
import { skipToken, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { ImSpinner3 } from "react-icons/im";
import { ICashedConversations } from "../../types/privateChatTypes";
import { openToast } from "../../context/appStateSlice";
import { handleApiError } from "../../utilities";
import { fetchPrivateChatMessages, makeRequest } from "../../services";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import SendMessagePrivateChat from "./SendMessagePrivateChat";
import PrivateMessageItem from "./PrivateMessageItem";
import UserImage from "../../components/Shared/Common/UserImage";

const ChatBody = memo(({ activeChatWithUserId }: { activeChatWithUserId: string }) => {
  const currentUserId = useAppSelector((state) => state.appState.currentUser?._id);
  const onlineUsers = useAppSelector((state) => state.appState.onlineUsers);
  const socket = useAppSelector((state) => state.appState.socket);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { data, status, error } = useInfiniteQuery({
    queryKey: ["conversation-messages", activeChatWithUserId],
    queryFn: activeChatWithUserId
      ? ({ pageParam }) => fetchPrivateChatMessages({ pageParam, activeChatWithUserId })
      : skipToken,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, pageParam) => (lastPage.hasMore ? pageParam + 1 : undefined),
    staleTime: 60 * 60 * 1000,
  });

  const messages = data?.pages.map((page) => page.messages).flat();
  const secondUser = data?.pages[0].secondUser;

  const markAsReaded = useCallback(async () => {
    const isUnReadMsgs = messages?.some((msg) => !msg.isRead && msg.sender._id === activeChatWithUserId);
    if (messages?.length === 0 || !isUnReadMsgs) return;

    socket?.emit("conversation-readed", {
      reciever: activeChatWithUserId,
      sender: currentUserId,
    });

    try {
      await makeRequest.get(`api/conversations/${activeChatWithUserId}/mark-as-read`);
      queryClient.setQueryData(["conversations"], (previous: ICashedConversations): ICashedConversations => {
        return {
          ...previous,
          pages: previous.pages.map((page) => {
            return {
              ...page,
              conversations: page.conversations.map((conv) => {
                if (conv.secondParty._id === activeChatWithUserId) {
                  return { ...conv, unReadCount: 0 };
                }
                return conv;
              }),
            };
          }),
        };
      });
    } catch (error) {
      dispatch(
        openToast({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    }
  }, [activeChatWithUserId, messages, queryClient, dispatch, socket, currentUserId]);

  const scrollToLastMessage = useCallback(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToLastMessage();
    markAsReaded();
  }, [activeChatWithUserId, markAsReaded, scrollToLastMessage]);

  if (!activeChatWithUserId) return;

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
            <UserImage user={secondUser ? secondUser : null} />
          </div>
          <span className="text-sm font-bold text-[#3785fa] md:text-base">{secondUser?.name}</span>
        </div>
        {onlineUsers.includes(activeChatWithUserId) ? (
          <span className="text-xs font-bold tracking-wide text-[#68e44a] md:text-sm">online</span>
        ) : (
          <span className="text-xs font-bold tracking-wide text-[#54724c] md:text-sm">offline</span>
        )}
      </div>

      <div className="scrollbar-custom flex-1 overflow-y-auto max-lg:scrollbar-thin">
        {messages?.map((msg, index) => (
          <PrivateMessageItem
            key={msg._id}
            messagesLength={messages.length}
            message={msg}
            index={index}
            lastMessageRef={lastMessageRef}
          />
        ))}
      </div>

      <SendMessagePrivateChat activeChatWithUserId={activeChatWithUserId} />
    </div>
  );
});

export default ChatBody;
