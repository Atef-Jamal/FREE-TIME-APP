import { memo, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImSpinner3 } from "react-icons/im";
import { openToast, selectCurrentUser, selectUserAuth } from "../../../../context/appStateSlice";
import { handleApiError } from "../../../../utils";
import { useAppDispatch, useAppSelector } from "../../../../context/hooks";
import SendMessagePrivateChat from "./SendMessagePrivateChat";
import PrivateMessageItem from "./PrivateMessageItem";
import UserImage from "../../../../components/Shared/UserImage";

import { socket } from "../../../../lib/socketIO";
import { useInfiniteConversationMsgs } from "../hooks";
import { conversationRead } from "../services";
import { useFetchUser } from "../../../user/hooks";
import { updateConversationReadCache, updateTotalUnReadPrivateMsgsCache } from "../cache";

const ChatBody = memo(({ secondUserId }: { secondUserId: string }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const userAuth = useAppSelector(selectUserAuth);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { data, status, error, hasPreviousPage, fetchPreviousPage } = useInfiniteConversationMsgs({
    userAuth: userAuth === "authenticated",
    secondUserId,
  });

  const { data: secondUser } = useFetchUser({ userId: secondUserId });

  const { data: onlineUsers } = useQuery<string[]>({ queryKey: ["onlines-users-ids"] });

  const messages = data?.pages.map((page) => page.messages).flat();

  const unreadMessagesExists = messages?.some(
    (msg) => msg.sender._id === secondUserId && msg.isRead === false,
  );

  useEffect(() => {
    if (!currentUser?._id) return;

    const handleReadConversation = async () => {
      try {
        const res = await conversationRead({ secondUserId });
        if (res.status === 200) {
          updateConversationReadCache({ queryClient, currentUserId: currentUser._id, secondUserId });
          updateTotalUnReadPrivateMsgsCache({
            queryClient,
            type: "remove-all",
          });
        }
      } catch (error) {
        dispatch(
          openToast({
            type: "ERROR_GENERAL",
            message: handleApiError(error),
          }),
        );
      }
    };

    if (unreadMessagesExists) {
      handleReadConversation();
    }
  }, [secondUserId, currentUser?._id, dispatch, queryClient, unreadMessagesExists]);

  useEffect(() => {
    const scrollToLastMessage = () => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    scrollToLastMessage();
  }, [messages]);

  useEffect(() => {
    if (secondUserId && currentUser?._id) {
      socket.emit("user_joined_conversation", { firstParty: currentUser._id, secondParty: secondUserId });
    }
    return () => {
      if (secondUserId && currentUser?._id) {
        socket.emit("user_leaved_conversation", { firstParty: currentUser._id, secondParty: secondUserId });
      }
    };
  }, [currentUser?._id, secondUserId]);

  if (!secondUserId || error)
    return (
      <div className="flex h-full items-center justify-center border border-x border-gray-700 bg-[#332342] px-5 text-center 2xl:flex-1">
        select chat
      </div>
    );

  if (status === "pending") {
    return (
      <div className="flex h-full items-center justify-center border border-x border-gray-700 bg-[#332342] 2xl:flex-1">
        <ImSpinner3 className="animate-spin text-4xl md:text-6xl" />
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
        {onlineUsers?.includes(secondUserId) ? (
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
            lastMessageRef={lastMessageRef}
            index={index}
          />
        ))}
      </div>

      <SendMessagePrivateChat secondUserId={secondUserId} />
    </div>
  );
});

export default ChatBody;
