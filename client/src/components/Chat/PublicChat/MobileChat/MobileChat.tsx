import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import FreeTime from "../Common/FreeTime";
import Message from "../Common/Message";
import SendMessage from "../Common/SendMessage";

import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import { TypePublicChatItem } from "../../../../types";
import { handleApiError, makeRequest } from "../../../../utils";
import { showPopup } from "../../../../context/StateManeger";
import { BiErrorAlt } from "react-icons/bi";

const MobileChat = () => {
  const { hiddenLiveStats, socet } = useAppSelector(
    (state) => state.stateManeger
  );
  const [messages, setMessages] = useState<TypePublicChatItem[]>([]);
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const mentionedMessageRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const searchValue = searchParams.get("messageid");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const getMessages = await makeRequest.get("api/publicchat");

        setMessages(getMessages.data);
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
    fetchMessages();
  }, []);

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
          : `calc(100dvh - 171px)`,
      }}
      className="sticky top-[100px] w-full bg-[#202233] hidden sm:flex flex-col items-center "
    >
      <div className="w-full h-full p-2 overflow-scroll scrollbar-none">
        <div className="w-full h-full flex flex-col items-center  gap-[5px] overflow-scroll scrollbar-none">
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
      </div>

      <SendMessage
        stopScrolling={stopScrolling}
        setStopScrolling={setStopScrolling}
      />
    </div>
  );
};

export default MobileChat;
