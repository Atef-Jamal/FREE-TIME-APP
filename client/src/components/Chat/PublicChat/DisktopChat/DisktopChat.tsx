import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIosNew } from "react-icons/md";
import { chatToggleButton } from "../../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import { Message, ChatHeader, SendMessage } from "../../../../components";
import { TypePublicChatItem } from "../../../../types";
import FreeTime from "../Common/FreeTime";
import axios from "axios";

const DisktopChat = () => {
  const { isChatOpen, token, socet } = useAppSelector(
    (state) => state.stateManeger
  );
  const [messages, setMessages] = useState<TypePublicChatItem[]>([]);
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const mentionedMessageRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const searchValue = searchParams.get("messageid");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const getMessages = await axios.get(
          "http://localhost:3000/api/publicchat",
          { headers }
        );

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
      mentionedMessageRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <div className="relative flex flex-col items-center mx-auto bg-[#241f31c0] justify-between h-full w-full ">
      <span
        onClick={() => dispatch(chatToggleButton())}
        className="absolute top-[10%] -left-[38px] px-[9px] py-1 bg-[#513d80f8] rounded-sm"
      >
        {isChatOpen ? (
          <MdArrowForwardIos style={{ fontSize: "20px" }} />
        ) : (
          <MdArrowBackIosNew style={{ fontSize: "20px" }} />
        )}
      </span>
      <ChatHeader />
      <div
        id="publicchatid"
        className="w-full flex flex-col items-center h-[83%] overflow-auto  gap-2 p-2 transition-all"
      >
        {messages?.map((message, index) => {
          if (message.type === "FREETIME") {
            return (
              <FreeTime
                key={message._id}
                singleMessage={message}
                lastMessageRef={
                  index === messages.length - 1 ? lastMessageRef : null
                }
              />
            );
          }
          return (
            <Message
              key={message._id}
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
      <SendMessage
        setMessages={setMessages}
        stopScrolling={stopScrolling}
        setStopScrolling={setStopScrolling}
      />
    </div>
  );
};

export default DisktopChat;
