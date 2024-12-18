import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import UserImage from "../../Others/UserImage";
import PrivateMessageItem from "./PrivateMessageItem";
import SendMessagePrivateChat from "./SendMessagePrivateChat"; // TypeCashedChat,
import { TypeConversation } from "../../../types/privateChatTypes";
import { showPopup } from "../../../context/StateManeger";
import { handleApiError } from "../../../utils/common";
import { fetchPrivateChatMessages, makeRequest } from "../../../utils";
import { ImSpinner3 } from "react-icons/im";
import { skipToken, useQuery, useQueryClient } from "@tanstack/react-query";

const ChatBody = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const onlineUsers = useAppSelector((state) => state.stateManeger.onlineUsers);
  const activeConversation = useAppSelector(
    (state) => state.stateManeger.activeConversation
  );
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const {
    data = { messages: [], secondUser: null },
    status,
    error,
  } = useQuery({
    queryKey: ["private-messages", activeConversation],
    queryFn: activeConversation
      ? () => fetchPrivateChatMessages({ secondUserId: activeConversation })
      : skipToken,
    staleTime: 60 * 60 * 1000,
  });

  const markAsReaded = useCallback(async () => {
    const isThereMessagesUnReaded = data.messages.some(
      (msg) => !msg.isRead && msg.sender._id === activeConversation
    );
    if (data.messages.length === 0 || !isThereMessagesUnReaded) return;
    socket?.emit("conversation-readed", {
      reciever: activeConversation,
      sender: currentUser?._id,
    });
    try {
      await makeRequest.patch(`api/conversations/${activeConversation}`, {
        FOR_CONSISTENCY: "FOR_CONSISTENCY",
      });
      queryClient.setQueryData(["conversations"], (old: TypeConversation[]) => {
        if (old) {
          return old.map((conv) => {
            if (conv.secondParty._id === activeConversation) {
              return { ...conv, unreadedCount: 0 };
            } else {
              return conv;
            }
          });
        }
      });
    } catch (error) {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    }
  }, [
    activeConversation,
    data.messages,
    queryClient,
    dispatch,
    socket,
    currentUser?._id,
  ]);

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
      <div className="h-full flex items-center justify-center">
        <ImSpinner3 className="text-6xl sm:text-4xl animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#b95b5b]">
        {error.response?.data.error}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center h-full gap-1 pb-2 bg-[#332342]">
      <div className="flex items-center justify-center w-full gap-10 bg-[#1f1f2e9a] border border-gray-700 py-1">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[35px] sm:w-[30px] sm:h-[25px]">
            <UserImage user={data.secondUser} />
          </div>
          <span className="sm:text-sm text-[#3785fa]">
            {data.secondUser?.name}
          </span>
        </div>
        {onlineUsers.includes(activeConversation) ? (
          <span className="text-[13px] font-bold text-[#68e44a] tracking-wide">
            online
          </span>
        ) : (
          <span className="text-[13px] font-bold text-[#54724c] tracking-wide">
            offline
          </span>
        )}
      </div>

      <div className="flex flex-col items-center w-full gap-2 sm:gap-[3px] overflow-auto scrollbar-none grow">
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
      <div className="w-full">
        <SendMessagePrivateChat id={activeConversation} />
      </div>
    </div>
  );
};

export default ChatBody;
