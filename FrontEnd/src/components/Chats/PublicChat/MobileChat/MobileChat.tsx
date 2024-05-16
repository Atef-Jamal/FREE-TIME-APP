import { useEffect, useRef, useState } from "react";
import FreeTime from "../Common/FreeTime";
import Message from "../Common/Message";
import SendMessage from "../Common/SendMessage";
import { useAppSelector } from "../../../../context/Hooks";
import { TypePublicChatItem } from "../../../../types/publicChat";
import { useFetchPublicMessages, useListenToEvent } from "../../../../hooks";
import Spinner from "../../../Others/Spinner";
import { useScrollToElement } from "../../../../hooks/common";
import { useSearchParams } from "react-router-dom";

const MobileChat = () => {
  const { hiddenLiveStats } = useAppSelector((state) => state.stateManeger);
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { messages, setMessages, loading, error } = useFetchPublicMessages();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("to");

  useScrollToElement([messages], "end");

  useListenToEvent<TypePublicChatItem>({
    eventToListen: "public-message",
    onUpdate: (data) => {
      setMessages((prev) => [...prev, data]);
    },
  });

  useEffect(() => {
    const scrollToLastMessage = () => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    if (!stopScrolling && !queryParam) {
      scrollToLastMessage();
    }
  }, [messages]);

  return (
    <div
      style={{
        height: hiddenLiveStats ? `calc(100vh - 123px)` : `calc(100vh - 166px)`,
      }}
      className={`hidden sm:flex flex-col items-center fixed ${
        hiddenLiveStats ? "top-[55px]" : "top-[98px]"
      } w-full bg-[#202233]`}
    >
      <div className="w-full h-full px-1 pb-1 flex flex-col items-center gap-[5px] overflow-scroll scrollbar-none">
        {loading && <Spinner className="m-auto w-12 h-12 border-[4px]" />}
        {error && (
          <div className="m-auto w-full text-center text-gray-400">
            {error}an eror
          </div>
        )}
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
              messageRef={index === messages.length - 1 ? lastMessageRef : null}
            />
          );
        })}
      </div>
      <div className="w-full">
        <SendMessage
          stopScrolling={stopScrolling}
          setStopScrolling={setStopScrolling}
        />
      </div>
    </div>
  );
};

export default MobileChat;
