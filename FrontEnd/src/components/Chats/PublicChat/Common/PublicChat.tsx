import { useEffect, useMemo, useRef, useState } from "react";
import {
  useListenToDocumentEvent,
  useListenToSocketEvents,
} from "../../../../hooks/listenersHooks";
import { TypePublicChatItem } from "../../../../types/publicChatTypes";
import { useScrollToElement } from "../../../../hooks/commonHooks";
import { useSearchParams } from "react-router-dom";
import { useFetchPublicMessages } from "../../../../hooks";
import Spinner from "../../../Others/Spinner";
import SendMessage from "./SendMessage";
import Message from "./Message";
import FreeTime from "./FreeTime";
import { FaArrowDownLong } from "react-icons/fa6";

const PublicChat = () => {
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { messages, setMessages, loading, error } = useFetchPublicMessages();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("messageId");

  const [stagingMessages, setStagingMessages] = useState(0);

  const handleAddNewMessage = (data: TypePublicChatItem) => {
    const element = messageContainerRef.current!;
    const addToStaging =
      element.scrollHeight - element.scrollTop > element.clientHeight + 70;

    if (addToStaging) {
      setStagingMessages((prev) => prev + 1);
    }
    setMessages((prev) => [...prev, data]);
  };

  const handleAddMessage = (data: any) => {
    const element = messageContainerRef.current!;
    const addToStaging =
      element.scrollHeight - element.scrollTop > element.clientHeight + 70;

    if (addToStaging) {
      setStagingMessages((prev) => prev + 1);
    }
    setMessages((prev) => [...prev, data.detail]);
  };

  const { setElement } = useScrollToElement([messages], "end", "messageId");

  useListenToSocketEvents({
    eventToListen: ["public-message"],
    onUpdate: [handleAddNewMessage],
  });

  useListenToDocumentEvent({
    eventToListen: "immediatelyMessage",
    onUpdate: handleAddMessage,
  });

  const scrollToLastMessage = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    setStagingMessages(0);
  };

  useEffect(() => {
    const element = messageContainerRef.current;
    let timeout: NodeJS.Timeout;
    const handleFunc = () => {
      if (!element) return;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (
          element.scrollHeight - element.scrollTop >
          element.clientHeight + 90
        ) {
          setStopScrolling(true);
        } else {
          setStagingMessages(0);
          setStopScrolling(false);
        }
        if (queryParam) {
            setSearchParams((prev) => {
              prev.delete("messageId");
              return prev;
            });
            setElement(null);
          }
      }, 700);
    };

    messageContainerRef.current?.addEventListener("scroll", handleFunc);
    return () => {
      messageContainerRef.current?.removeEventListener("scroll", handleFunc);
      clearTimeout(timeout);
    };
  }, []);

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

  useEffect(() => {
    if (!stopScrolling && !queryParam) {
      scrollToLastMessage();
    }
  }, [messages]);

  return (
    <>
      <div
        ref={messageContainerRef}
        className="w-full h-full px-2 sm:px-1 pb-2 sm:pb-1 flex flex-col items-center gap-[5px] overflow-y-scroll sm:scrollbar-none transition-all"
      >
        {loading && <Spinner className="m-auto w-12 h-12 border-[4px]" />}
        {error && (
          <div className="m-auto w-full text-center text-gray-400">{error}</div>
        )}
        {messagesList}
      </div>
      <div className="w-full relative flex items-center justify-center">
        {stagingMessages > 0 && (
          <button
            onClick={scrollToLastMessage}
            className="absolute -top-[30px] px-2 py-1 bg-[#1564d1ee] text-sm sm:text-xs  rounded-full font-bold tracking-wider flex items-center justify-center gap-1"
          >
            <FaArrowDownLong />
            {stagingMessages} new Message{stagingMessages > 1 ? "s" : ""}
          </button>
        )}
        <SendMessage
          stopScrolling={stopScrolling}
          setStopScrolling={setStopScrolling}
          setMessages={setMessages}
        />
      </div>
    </>
  );
};

export default PublicChat;
