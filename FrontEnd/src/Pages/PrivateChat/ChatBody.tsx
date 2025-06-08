import { memo, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ImSpinner3 } from "react-icons/im";
import {
  openToast,
  selectCurrentUser,
  selectOnlineUsers,
  selectSocket,
  selectUserAuth,
} from "../../context/appStateSlice";
import { axiosRequest, handleApiError } from "../../utilities";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import SendMessagePrivateChat from "./SendMessagePrivateChat";
import PrivateMessageItem from "./PrivateMessageItem";
import UserImage from "../../components/Shared/Common/UserImage";
import { useInfiniteConversationMsgs } from "../../tanstackQuery/queryFetch";
import { updateConversationUnreadCountCache } from "../../tanstackQuery/queryCache";

const ChatBody = memo(({ activeChatId }: { activeChatId: string }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const userAuth = useAppSelector(selectUserAuth);
  const onlineUsers = useAppSelector(selectOnlineUsers);
  const socket = useAppSelector(selectSocket);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { data, status, error, hasPreviousPage, fetchPreviousPage } = useInfiniteConversationMsgs({
    userAuth: userAuth === "authenticated",
    activeChatId,
  });

  const messages = data?.pages.map((page) => page.messages).flat();
  const secondUser = data?.pages[0].secondUser;

  const isUnReadMsgs = Boolean(messages?.some((msg) => !msg.isRead && msg.sender._id === activeChatId));

  useEffect(() => {
    if (!isUnReadMsgs || !currentUser?._id) return;
    const markAsReaded = async () => {
      socket?.emit("conversation-readed", {
        reciever: activeChatId,
        sender: currentUser._id,
      });
      try {
        await axiosRequest.get(`api/conversations/${activeChatId}/markAsRead`);
        updateConversationUnreadCountCache({ queryClient, activeChatId });
      } catch (error) {
        dispatch(
          openToast({
            type: "ERROR_GENERAL",
            message: handleApiError(error),
          }),
        );
      }
    };

    markAsReaded();
  }, [isUnReadMsgs, activeChatId, socket, currentUser?._id, dispatch, queryClient]);

  useEffect(() => {
    const scrollToLastMessage = () => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    scrollToLastMessage();
  }, [messages]);
  if (!activeChatId) return;

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
        {onlineUsers.includes(activeChatId) ? (
          <span className="text-xs font-bold tracking-wide text-[#68e44a] md:text-sm">online</span>
        ) : (
          <span className="text-xs font-bold tracking-wide text-[#54724c] md:text-sm">offline</span>
        )}
      </div>

      <div className="scrollbar-custom flex-1 overflow-y-auto max-lg:scrollbar-thin">
        {hasPreviousPage && (
          <button
            onClick={() => fetchPreviousPage()}
            className="w-full rounded-sm bg-[#4cb0c217] py-1 text-center text-sm text-slate-300"
          >
            Load more
          </button>
        )}
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

      <SendMessagePrivateChat activeChatId={activeChatId} />
    </div>
  );
});

export default ChatBody;
