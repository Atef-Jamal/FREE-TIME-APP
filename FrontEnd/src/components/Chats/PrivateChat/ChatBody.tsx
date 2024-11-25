import { SetStateAction, useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import UserImage from "../../Others/UserImage";
import PrivateMessageItem from "./PrivateMessageItem";
import SendMessagePrivateChat from "./SendMessagePrivateChat";
import {
  TypeConversation,
  TypePrivateMessage,
} from "../../../types/privateChatTypes";
import { useFetchPrivateChatMessages } from "../../../hooks";
import {
  useListenToDocumentEvent,
  useListenToSocketEvents,
} from "../../../hooks/listenersHooks";
import { showPopup } from "../../../context/StateManeger";
import { handleApiError } from "../../../utils/common";
import { makeRequest } from "../../../utils";
import { User } from "../../../types/userTypes";
import { TypeConversationSocketData } from "../../../types/othersTypes";
import { ImSpinner3 } from "react-icons/im";

interface TypeProps {
  activeConversation: string;
  setConversations: React.Dispatch<SetStateAction<TypeConversation[]>>;
}

interface TypeFastSendPrivateMessage {
  detail: { message: TypePrivateMessage; recieverId: string };
}

const ChatBody = ({ activeConversation, setConversations }: TypeProps) => {
  const { currentUser, socket, onlineUsers } = useAppSelector(
    (state) => state.stateManeger
  );
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const { messages, setMessages, secondUser, setSecondUser, loading, error } =
    useFetchPrivateChatMessages({
      secondUserId: activeConversation,
      dependencies: [activeConversation],
    });

  const handleNewPrivateMessage = (data: TypePrivateMessage) => {
    if (data.sender._id === activeConversation) {
      setMessages((prev) => [...prev, data]);
    }
  };

  const handleConversationReaded = (data: TypeConversationSocketData) => {
    if (data.sender === activeConversation) {
      setMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })));
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    if (updatedUser._id === activeConversation) {
      setSecondUser(updatedUser);
    }
  };

  const markAsReaded = async () => {
    const isThereMessagesUnReaded = messages.some(
      (msg) => !msg.isRead && msg.sender._id === activeConversation
    );
    if (messages.length === 0 || !isThereMessagesUnReaded) return;
    try {
      await makeRequest.patch(`api/conversations/${activeConversation}`, {
        FOR_CONSISTENCY: "FOR_CONSISTENCY",
      });
      socket?.emit("conversation-readed", {
        reciever: activeConversation,
        sender: currentUser?._id,
      });
      setConversations((prev) => {
        return prev.map((conv) => {
          if (conv.secondParty._id === activeConversation) {
            return { ...conv, unreadedCount: 0 };
          } else {
            return conv;
          }
        });
      });
    } catch (error) {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    }
  };

  const handleAddMessage = (data: TypeFastSendPrivateMessage) => {
    setMessages((prev) => [...prev, data.detail.message]);
  };

  const scrollToLastMessage = useCallback(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useListenToSocketEvents({
    eventsToListen: ["private-message", "conversation-readed", "user-updated"],
    handlers: [
      handleNewPrivateMessage,
      handleConversationReaded,
      handleUpdateUser,
    ],
    dependencies: [activeConversation],
  });

  useListenToDocumentEvent({
    eventToListen: "fastSendPrivateMessage",
    onUpdate: handleAddMessage,
    dependencies: [activeConversation],
  });

  useEffect(() => {
    scrollToLastMessage();
    markAsReaded();
  }, [messages, activeConversation]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <ImSpinner3 className="text-6xl sm:text-4xl animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#b95b5b]">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center h-full gap-1 pb-2 bg-[#332342]">
      <div className="flex items-center gap-4 sm:gap-2 w-full justify-center bg-[#1f1f2e9a]  border border-gray-700 py-1 xs:py-[2px]">
        <div className="w-[40px] h-[35px] sm:w-[30px] sm:h-[25px]">
          <UserImage user={secondUser} />
        </div>
        <span className=" flex flex-col items-center ">
          <span className="text-sm text-[#62e66d]">{secondUser?.name}</span>
          {onlineUsers.includes(activeConversation) ? (
            <span className="text-xs text-[#4c9af3] xs:-mt-[4px]">online</span>
          ) : (
            <span className="text-xs text-[#72664b] xs:-mt-[4px]">offline</span>
          )}
        </span>
      </div>

      <div className="flex flex-col items-center w-full gap-2 sm:gap-[3px] overflow-auto scrollbar-none grow">
        {messages.map((msg, index) => (
          <PrivateMessageItem
            key={msg._id}
            messages={messages}
            message={msg}
            index={index}
            lastMessageRef={lastMessageRef}
          />
        ))}
      </div>
      <div className="w-full">
        <SendMessagePrivateChat
          id={activeConversation}
          setMessages={setMessages}
          setConversations={setConversations}
        />
      </div>
    </div>
  );
};

export default ChatBody;
