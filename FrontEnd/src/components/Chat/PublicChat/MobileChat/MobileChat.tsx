import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FreeTime from "../Common/FreeTime";
import Message from "../Common/Message";
import SendMessage from "../Common/SendMessage";
import { useAppSelector } from "../../../../context/Hooks";
import { TypePublicChatItem } from "../../../../types/publicChat";
import { useFetchPublicMessages, useListenToEvent } from "../../../../hooks";
import Spinner from "../../../Others/Spinner";

const MobileChat = () => {
  const { hiddenLiveStats } = useAppSelector((state) => state.stateManeger);
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const mentionedMessageRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const searchValue = searchParams.get("messageid");

  const { messages, setMessages, loading, error } = useFetchPublicMessages();

  useListenToEvent<TypePublicChatItem>({
    eventToListen: "public-message",
    onUpdate: (data) => {
      setMessages((prev) => [...prev, data]);
    },
  });

  useEffect(() => {
    const scrollToMessage = () => {
      mentionedMessageRef.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });

      mentionedMessageRef.current?.classList.add(
        "animate-pulse",
        "border",
        "border-gray-400"
      );
    };
    if (searchValue) {
      const timeOut = setTimeout(() => {
        scrollToMessage();
      }, 0);
      return () => clearTimeout(timeOut);
    }
  }, [searchValue, messages]);

  useEffect(() => {
    const scrollToElement = () => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    if (!stopScrolling) {
      scrollToElement();
    }
  }, [messages]);

  return (
    <div
      style={{
        height: hiddenLiveStats
          ? `calc(100dvh - 123px)`
          : `calc(100dvh - 163px)`,
      }}
      className="sticky top-[100px] w-full bg-[#202233] hidden sm:flex flex-col items-center"
    >
      {loading && (
        <div className="mt-20">
          <Spinner className="m-auto w-12 h-12" />
        </div>
      )}
      {error && <div className="mt-20">{error}</div>}
      <div className="w-full h-full px-1 pb-1 flex flex-col items-center  gap-[5px] overflow-scroll scrollbar-none">
        {messages?.map((message, index) => {
          if (message.type === "FREETIME") {
            return (
              <FreeTime
                key={message._id}
                singleMessage={message}
                messageRef={
                  index === messages.length - 1 ? lastMessageRef : null
                }
              />
            );
          }
          return (
            <Message
              key={index}
              setStopScrolling={setStopScrolling}
              stopScrolling={stopScrolling}
              singleMessage={message}
              messageRef={
                searchValue === message._id
                  ? mentionedMessageRef
                  : index === messages.length - 1
                  ? lastMessageRef
                  : null
              }
            />
          );
        })}
      </div>
      <SendMessage
        stopScrolling={stopScrolling}
        setStopScrolling={setStopScrolling}
      />
    </div>
  );
};

export default MobileChat;
