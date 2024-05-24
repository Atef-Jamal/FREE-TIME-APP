import { useEffect, useMemo, useRef, useState } from "react";
import FreeTime from "../Common/FreeTime";
import Message from "../Common/Message";
import SendMessage from "../Common/SendMessage";
import { useAppSelector } from "../../../../context/Hooks";
import { TypePublicChatItem } from "../../../../types/publicChatTypes";
import {
  useFetchPublicMessages,
  useListenToSocketEvent,
} from "../../../../hooks";
import Spinner from "../../../Others/Spinner";
import { useScrollToElement } from "../../../../hooks/commonHooks";
import { useSearchParams } from "react-router-dom";
import { useListenToDocumentEvent } from "../../../../hooks/listenersHooks";

const MobileChat = () => {
  const { hiddenLiveStats } = useAppSelector((state) => state.stateManeger);
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { messages, setMessages, loading, error } = useFetchPublicMessages();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("to");

  const handleAddNewMessage = (data: TypePublicChatItem) => {
    setMessages((prev) => [...prev, data]);
  };
  const handleAddMessage = (data: any) => {
    setMessages((prev) => [...prev, data.detail]);
  };

  useScrollToElement([messages], "end");

  useListenToSocketEvent<TypePublicChatItem>({
    eventToListen: "public-message",
    onUpdate: handleAddNewMessage,
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
    <div
      style={{
        height: hiddenLiveStats
          ? `calc(100dvh - 123px)`
          : `calc(100dvh - 166px)`,
      }}
      className={`hidden sm:flex flex-col items-center fixed ${
        hiddenLiveStats ? "top-[55px]" : "top-[98px]"
      } w-full bg-[#202233]`}
    >
      <div className="w-full h-full px-1 pb-1 flex flex-col items-center gap-[5px] overflow-scroll scrollbar-none transition-all">
        {loading && <Spinner className="m-auto w-12 h-12 border-[4px]" />}
        {error && (
          <div className="m-auto w-full text-center text-gray-400">
            {error}an eror
          </div>
        )}
        {messagesList}
      </div>
      <div className="w-full">
        <SendMessage
          stopScrolling={stopScrolling}
          setStopScrolling={setStopScrolling}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
};

export default MobileChat;
