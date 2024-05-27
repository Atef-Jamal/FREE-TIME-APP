import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import Spinner from "../../Others/Spinner";
import UserImage from "../../../components/Others/UserImage";
import PrivateMessageItem from "./PrivateMessageItem";
import SendMessagePrivateChat from "./SendMessagePrivateChat";
import {
  TypeConversation,
  TypePrivateMessage,
} from "../../../types/privateChatTypes";
import {
  useFetchPrivateChatMessages,
  useListenToSocketEvent,
} from "../../../hooks";
import { useListenToDocumentEvent } from "../../../hooks/listenersHooks";
import { showPopup } from "../../../context/StateManeger";
import { handleApiError } from "../../../utils/common";
import { makeRequest } from "../../../utils";
import { User } from "../../../types/userTypes";
import { TypeConversationSocketData } from "../../../types/othersTypes";

interface TypeProps {
  activeConversation: TypeConversation;
  setActiveConversation: React.Dispatch<
    SetStateAction<TypeConversation | null>
  >;
  setConversations: React.Dispatch<SetStateAction<TypeConversation[]>>;
}

const ChatBody = ({
  activeConversation,
  setActiveConversation,
  setConversations,
}: TypeProps) => {
  const { currentUser, socket } = useAppSelector((state) => state.stateManeger);
  const [conversationReaded, setConversationReaded] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const { messages, setMessages, loading, error } = useFetchPrivateChatMessages(
    {
      secondUserId: activeConversation.secondParty._id,
      dependencies: [activeConversation.secondParty._id],
    }
  );

  const handleNewPrivateMessage = (data: TypePrivateMessage) => {
    if (data.sender._id === activeConversation.secondParty._id) {
      setMessages((prev) => [...prev, data]);
    }
  };

  const handleConversationReaded = (data: TypeConversationSocketData) => {
    if (data.sender === activeConversation.secondParty._id) {
      setConversationReaded(true);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    if (updatedUser._id === activeConversation.secondParty._id) {
      setActiveConversation({
        ...activeConversation,
        secondParty: updatedUser,
      });
    }
  };

  const markAsReaded = async () => {
    const lastMessage = messages[messages.length - 1];
    const lastMessageIsnotReaded =
      lastMessage?.sender._id === activeConversation.secondParty?._id &&
      lastMessage?.isRead === false;

    if (messages.length > 0 && lastMessageIsnotReaded) {
      try {
        await makeRequest.patch(
          `api/conversations/${activeConversation.secondParty._id}`,
          {
            FOR_CONSISTENCY: "FOR_CONSISTENCY",
          }
        );
        socket?.emit("conversation-readed", {
          reciever: activeConversation.secondParty._id,
          sender: currentUser?._id,
        });
        setConversations((prev) => {
          return prev.map((conv) => {
            if (conv.secondParty._id === activeConversation.secondParty._id) {
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
    }
  };

  const handleAddMessage = useCallback(
    (data: { detail: { message: TypePrivateMessage; recieverId: string } }) => {
      setMessages((prev) => [...prev, data.detail.message]);
    },
    []
  );

  const scrollToLastMessage = useCallback(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useListenToSocketEvent<TypePrivateMessage>({
    eventToListen: "private-message",
    onUpdate: handleNewPrivateMessage,
    dependencies: [activeConversation.secondParty._id],
  });

  useListenToSocketEvent<TypeConversationSocketData>({
    eventToListen: "conversation-readed",
    onUpdate: handleConversationReaded,
    dependencies: [activeConversation.secondParty._id],
  });

  useListenToSocketEvent<User>({
    eventToListen: "user-updated",
    onUpdate: handleUpdateUser,
  });

  useListenToDocumentEvent({
    eventToListen: "immediatelyPrivateMessage",
    onUpdate: handleAddMessage,
    dependencies: [activeConversation.secondParty._id],
  });

  useEffect(() => {
    scrollToLastMessage();
    markAsReaded();
    const getMyLastMessage = messages.filter((item) => {
      return item.sender._id === currentUser?._id;
    });
    const lastOne = getMyLastMessage[getMyLastMessage.length - 1];
    if (lastOne?.isRead === true) {
      setConversationReaded(true);
    } else {
      setConversationReaded(false);
    }
  }, [messages, activeConversation.secondParty._id]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner className="w-11 h-11 border-[5px] border-l-[#8394f5] border-b-[#8394f5]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-300">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center h-full gap-1 pb-1 bg-[#332342]">
      <div className="flex items-center gap-4 sm:gap-2 w-full justify-center bg-[#1f1f2e9a]  border border-gray-700 py-1 xs:py-[2px]">
        <div className="w-[40px] h-[35px] sm:w-[30px] sm:h-[25px]">
          <UserImage user={activeConversation.secondParty} />
        </div>
        <span className=" flex flex-col items-center ">
          <span className="text-sm text-[#62e66d]">
            {activeConversation.secondParty?.name}
          </span>
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
            conversationReaded={conversationReaded}
          />
        ))}
      </div>
      <div className="w-full">
        <SendMessagePrivateChat
          id={activeConversation.secondParty._id}
          setMessages={setMessages}
          setConversations={setConversations}
          conversationReaded={conversationReaded}
          setConversationReaded={setConversationReaded}
        />
      </div>
    </div>
  );
};

export default ChatBody;
