import { useEffect, useMemo, useRef, useState } from "react";
import {
  useListenToDocumentEvent,
  useListenToSocketEvent,
} from "../../../../hooks/listenersHooks";
import { TypePublicChatItem } from "../../../../types/publicChatTypes";
import { useScrollToElement } from "../../../../hooks/commonHooks";
import { useSearchParams } from "react-router-dom";
import { useFetchPublicMessages } from "../../../../hooks";
import Spinner from "../../../Others/Spinner";
import SendMessage from "./SendMessage";
import Message from "./Message";
import FreeTime from "./FreeTime";

const PublicChat = () => {
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const [somoneTyping, setSomeOneTyping] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { messages, setMessages, loading, error } = useFetchPublicMessages();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("messageId");

  const handleAddNewMessage = (data: TypePublicChatItem) => {
    setMessages((prev) => [...prev, data]);
  };

  const handleAddMessage = (data: any) => {
    setMessages((prev) => [...prev, data.detail]);
  };

  useScrollToElement([messages], "end", "messageId");

  useListenToSocketEvent<TypePublicChatItem>({
    eventToListen: "public-message",
    onUpdate: handleAddNewMessage,
  });

  useListenToSocketEvent({
    eventToListen: "typing-public-message",
    onUpdate: () => {
      if (!somoneTyping) {
        setSomeOneTyping(true);
      }
    },
  });

  useListenToSocketEvent({
    eventToListen: "stop-typing-public-message",
    onUpdate: () => {
      setSomeOneTyping(false);
    },
  });

  useListenToDocumentEvent({
    eventToListen: "immediatelyMessage",
    onUpdate: handleAddMessage,
  });

  useEffect(() => {
    const scrollToLastMessage = () => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    if (!stopScrolling && !queryParam) {
      scrollToLastMessage();
    }
  }, [messages]);

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
    <>
      <div className="w-full h-full px-2 sm:px-1 pb-2 sm:pb-1 flex flex-col items-center gap-[5px] overflow-y-scroll sm:scrollbar-none transition-all">
        {loading && <Spinner className="m-auto w-12 h-12 border-[4px]" />}
        {error && (
          <div className="m-auto w-full text-center text-gray-400">
            {error}an eror
          </div>
        )}
        {messagesList}
      </div>
      <div
        className={`${
          somoneTyping ? "h-5" : "h-0"
        } w-[97%] mx-auto px-1 bg-[#2f2f30a4] transition-all overflow-hidden text-xs xs:text-[10px] text-[#fd8f8f]`}
      >
        somone typing ...
      </div>
      <div className="w-full">
        <SendMessage
          somoneTyping={somoneTyping}
          stopScrolling={stopScrolling}
          setStopScrolling={setStopScrolling}
          setMessages={setMessages}
          setSomeOneTyping={setSomeOneTyping}
        />
      </div>
    </>
  );
};

export default PublicChat;
