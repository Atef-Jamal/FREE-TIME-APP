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
// import { User } from "../../../types/userTypes";
import {
  useFetchPrivateChatMessages,
  useListenToSocketEvent,
} from "../../../hooks";
import { useListenToDocumentEvent } from "../../../hooks/listenersHooks";
import { showPopup } from "../../../context/StateManeger";
import { handleApiError } from "../../../utils/common";
import { makeRequest } from "../../../utils";
import { User } from "../../../types/userTypes";

const ChatBody = ({
  activeConversation,
  setActiveConversation,
  setConversations,
}: {
  activeConversation: TypeConversation;
  setActiveConversation: React.Dispatch<
    SetStateAction<TypeConversation | null>
  >;
  setConversations: React.Dispatch<SetStateAction<TypeConversation[]>>;
}) => {
  const { currentUser, onlineUsers, socket } = useAppSelector(
    (state) => state.stateManeger
  );

  const { messages, setMessages, loading, error } = useFetchPrivateChatMessages(
    {
      secondUserId: activeConversation.secondParty._id,
      dependencies: [activeConversation.secondParty._id],
    }
  );

  const dispatch = useAppDispatch();

  const [conversationReaded, setConversationReaded] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useListenToSocketEvent<TypePrivateMessage>({
    eventToListen: "private-message",
    onUpdate: (data) => {
      if (data.sender._id === activeConversation.secondParty._id) {
        setMessages((prev) => [...prev, data]);
      }
    },
    dependencies: [activeConversation.secondParty._id],
  });

  useListenToSocketEvent<{
    reciever: string;
    sender: string;
  }>({
    eventToListen: "conversation-readed",
    onUpdate: (data) => {
      if (data.sender === activeConversation.secondParty._id) {
        setConversationReaded(true);
      }
    },
    dependencies: [activeConversation.secondParty._id],
  });

  useListenToSocketEvent<User>({
    eventToListen: "user-updated",
    onUpdate: (updatedUser) => {
      if (updatedUser._id === activeConversation.secondParty._id) {
        setActiveConversation({
          ...activeConversation,
          secondParty: updatedUser,
        });
      }
    },
  });

  const scrollToLastMessage = useCallback(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToLastMessage();
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

  const handleAddMessage = useCallback(
    (data: { detail: { message: TypePrivateMessage; recieverId: string } }) => {
      setMessages((prev) => [...prev, data.detail.message]);
    },
    []
  );

  useListenToDocumentEvent({
    eventToListen: "immediatelyPrivateMessage",
    onUpdate: handleAddMessage,
    dependencies: [activeConversation.secondParty._id],
  });

  useEffect(() => {
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
              status: true,
              type: "ERROR_GENERAL",
              message: handleApiError(error),
            })
          );
        }
      }
    };
    markAsReaded();
  }, [messages, activeConversation.secondParty._id]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner className="w-7 h-7 border-[3px]" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
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
          <span className="text-sm text-[#62e66d] sm:-mb-1">
            {activeConversation.secondParty?.name}
          </span>
          <span className="sm:text-[9px] text-sm tracking-wider font-[200] xs:-mt-1 text-[#c5bbbb]">
            {onlineUsers.includes(activeConversation.secondParty._id)
              ? "(online)"
              : "(offline)"}
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
