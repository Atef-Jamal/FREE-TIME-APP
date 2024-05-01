import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import {
  setAllUnReadedMesseges,
  setRefetchUnReadedMessagesCount,
  showPopup,
} from "../../../context/StateManeger";
import { handleApiError, makeRequest } from "../../../utils";
import Spinner from "../../Others/Spinner";
import UserImage from "../../../components/Others/UserImage";
import PrivateMessageItem from "./PrivateMessageItem";
import { BiErrorAlt } from "react-icons/bi";
import SendMessagePrivateChat from "./SendMessagePrivateChat";
import { TypePrivateMessage } from "../../../types/privateChat";
import { User } from "../../../types/user";
import {
  useFetchPrivateChatMessages,
  useListenToEvent,
} from "../../../hooks/hooks";

const ChatBody = () => {
  const { currentUser, socet, onlineUsers } = useAppSelector(
    (state) => state.stateManeger
  );
  const { id } = useParams();
  const { messages, setMessages, secondUser, setSecondUser, loading, error } =
    useFetchPrivateChatMessages({
      secondUserId: id,
      dependencies: [id],
    });
  const [conversationReaded, setConversationReaded] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useListenToEvent<TypePrivateMessage>({
    eventToListen: "private-message",
    onUpdate: (data) => {
      if (data.sender._id === id) {
        setMessages((prev) => [...prev, data]);
      }
    },
    dependencies: [id],
  });

  useListenToEvent<{
    reciever: string;
    sender: string;
  }>({
    eventToListen: "conversation-readed",
    onUpdate: (data) => {
      if (data.sender === id) {
        setConversationReaded(true);
      }
    },
    dependencies: [id],
  });

  useListenToEvent<User>({
    eventToListen: "user-updated",
    onUpdate: (updatedUser) => {
      if (updatedUser._id === secondUser?._id) {
        setSecondUser(updatedUser);
      }
    },
  });

  useEffect(() => {
    const scrollToElement = () => {
      lastMessageRef.current?.scrollIntoView(false);
    };
    const getMyLastMessage = messages.filter((item) => {
      return item.sender._id === currentUser?._id;
    });
    const lastOne = getMyLastMessage[getMyLastMessage.length - 1];
    if (lastOne?.isRead === true) {
      if (conversationReaded === false) setConversationReaded(true);
    }
    scrollToElement();
  }, [messages]);

  useEffect(() => {
    const markAsReaded = async () => {
      if (!id) {
        return;
      }
      try {
        const response = await makeRequest.patch(`api/conversations/${id}`, {
          FOR_CONSISTENCY: "FOR_CONSISTENCY",
        });
        if (response.status === 200) {
          socet?.emit("conversation-readed", {
            reciever: id,
            sender: currentUser?._id,
          });
          dispatch(setRefetchUnReadedMessagesCount(id));
          dispatch(setAllUnReadedMesseges({ type: "REMOVE", userId: id }));
        }
      } catch (error) {
        dispatch(
          showPopup({
            status: true,
            message: handleApiError(error),
            icon: <BiErrorAlt />,
          })
        );
      }
    };
    markAsReaded();
  }, [messages, id]);

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
      <div className="flex items-center gap-4 sm:gap-2 w-full justify-center bg-[#1f1f2e9a]  border border-gray-700 py-2 xs:py-[2px]">
        <div className="w-[40px] h-[35px] sm:w-[30px] sm:h-[25px]">
          <UserImage user={secondUser} />
        </div>
        <span className=" flex flex-col items-center ">
          <span className="text-sm text-[#62e66d] font-[900]">
            {secondUser?.name}
          </span>
          <span className="sm:text-[9px] text-sm tracking-wider font-[200] xs:-mt-1 text-[#c5bbbb]">
            {onlineUsers.includes(id || "") ? "(online)" : "(offline)"}
          </span>
        </span>
      </div>

      <div className="flex flex-col items-center w-full gap-2 sm:gap-[3px] overflow-auto lg:scrollbar-thin grow">
        {messages &&
          messages.length > 0 &&
          messages.map((msg, index) => (
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
          setMessages={setMessages}
          conversationReaded={conversationReaded}
          setConversationReaded={setConversationReaded}
        />
      </div>
    </div>
  );
};

export default ChatBody;
