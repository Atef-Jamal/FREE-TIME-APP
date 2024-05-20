import { useEffect, useMemo, useRef, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIosNew } from "react-icons/md";
import { toggleThisEntity } from "../../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import Message from "../Common/Message";
import ChatHeader from "../Common/ChatHeader";
import SendMessage from "../Common/SendMessage";
import FreeTime from "../Common/FreeTime";
import { TypePublicChatItem } from "../../../../types/publicChatTypes";
import {
  useFetchPublicMessages,
  useListenToSocketEvent,
} from "../../../../hooks";
import Spinner from "../../../Others/Spinner";
import { useScrollToElement } from "../../../../hooks/commonHooks";
import { useListenToDocumentEvent } from "../../../../hooks/listenersHooks";

const DisktopChat = () => {
  const { isChatOpen } = useAppSelector((state) => state.stateManeger);
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { messages, setMessages, loading, error } = useFetchPublicMessages();

  useScrollToElement([messages], "end");

  useListenToSocketEvent<TypePublicChatItem>({
    eventToListen: "public-message",
    onUpdate: (data) => {
      setMessages((prev) => [...prev, data]);
    },
  });

  useEffect(() => {
    const scrollToLastMessage = () => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    if (!stopScrolling) {
      scrollToLastMessage();
    }
  }, [messages]);

  const handleAddMessage = (data: any) => {
    setMessages((prev) => [...prev, data.detail]);
  };

  useListenToDocumentEvent({
    eventToListen: "immediatelyMessage",
    onUpdate: handleAddMessage,
  });

  const messagesList = useMemo(() => {
    return messages.map((msg, index) => {
      if (msg.type === "MESSAGE") {
        return (
          <Message
            key={msg._id}
            singleMessage={msg}
            messageRef={index === messages.length - 1 ? lastMessageRef : null}
            setStopScrolling={setStopScrolling}
            stopScrolling={stopScrolling}
          />
        );
      }
      if (msg.type === "FREETIME") {
        return (
          <FreeTime
            key={msg._id}
            singleMessage={msg}
            messageRef={index === messages.length - 1 ? lastMessageRef : null}
          />
        );
      }
    });
  }, [messages]);

  return (
    <div className="relative flex flex-col items-center bg-[#241f31c0] h-full w-full">
      <span
        onClick={() => dispatch(toggleThisEntity({ entity: "isChatOpen" }))}
        className="w-10 h-10 absolute top-[7%] -left-[42px] bg-[#513d80f8] rounded-sm flex items-center justify-center cursor-pointer"
      >
        {isChatOpen ? (
          <MdArrowForwardIos className="text-3xl" />
        ) : (
          <MdArrowBackIosNew className="text-3xl" />
        )}
      </span>
      <ChatHeader />
      <div className="w-full flex flex-col items-center h-full overflow-auto gap-2 p-2 transition-all">
        {error && (
          <div className="w-full h-full flex items-center justify-center">
            {error}
          </div>
        )}
        {loading && (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner className="mx-auto w-8 h-8" />
          </div>
        )}

        {messagesList}
      </div>
      <SendMessage
        stopScrolling={stopScrolling}
        setStopScrolling={setStopScrolling}
        setMessages={setMessages}
      />
    </div>
  );
};

export default DisktopChat;
