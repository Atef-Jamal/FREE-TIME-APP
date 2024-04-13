import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Message, SendMessage } from "../../../../components";
import FreeTime from "../Common/FreeTime";
import { useAppSelector } from "../../../../context/Hooks";
import { TypePublicChatItem } from "../../../../types";
import { makeRequest } from "../../../../utils";

const MobileChat = () => {
  const { hiddenLiveStats, socet } = useAppSelector(
    (state) => state.stateManeger
  );
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<TypePublicChatItem[]>([]);
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const mentionedMessageRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  const searchValue = searchParams.get("messageid");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const getMessages = await makeRequest.get("api/publicchat");

        setMessages(getMessages.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const scrollToElement = () => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    if (!stopScrolling) {
      scrollToElement();
    }
  }, [messages]);

  useEffect(() => {
    const scrollToMessage = () => {
      mentionedMessageRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });

      mentionedMessageRef.current?.classList.add(
        "animate-pulse",
        "border",
        "border-gray-400"
      );
    };
    if (searchValue) {
      scrollToMessage();
    }
  }, [searchValue]);

  const handleMessage = (message: TypePublicChatItem) => {
    setMessages((prev) => [...prev, message]);
  };

  useEffect(() => {
    if (socet) {
      socet.on("public-message", handleMessage);
      return () => {
        socet.off("public-message", handleMessage);
      };
    }
  }, [socet]);

  return (
    <div
      style={{
        height: hiddenLiveStats
          ? `calc(100dvh - 123px)`
          : `calc(100dvh - 171px)`,
      }}
      className="sticky top-[100px] w-full bg-[#202233] hidden sm:flex flex-col items-center "
    >
      <div className="w-full h-full p-2 overflow-scroll scrollbar-none">
        <div className="w-full h-full flex flex-col items-center  gap-[5px] overflow-scroll scrollbar-none">
          {messages?.map((message, index) => {
            if (message.type === "FREETIME") {
              return <FreeTime key={message._id} singleMessage={message} />;
            }
            return (
              <Message
                key={index}
                setStopScrolling={setStopScrolling}
                singleMessage={message}
                lastMessageRef={
                  index === messages.length - 1 && !searchValue
                    ? lastMessageRef
                    : null
                }
                mentionedMessageRef={
                  searchValue === message._id ? mentionedMessageRef : null
                }
              />
            );
          })}
        </div>
      </div>

      <SendMessage
        setMessages={setMessages}
        // messages={messages}
        stopScrolling={stopScrolling}
        setStopScrolling={setStopScrolling}
      />
    </div>
  );
};

export default MobileChat;
