import { useEffect, useRef, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIosNew } from "react-icons/md";
import { toggleThisEntity } from "../../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import Message from "../Common/Message";
import ChatHeader from "../Common/ChatHeader";
import SendMessage from "../Common/SendMessage";
import FreeTime from "../Common/FreeTime";
import { TypePublicChatItem } from "../../../../types/publicChat";
import { useFetchPublicMessages, useListenToEvent } from "../../../../hooks";
import Spinner from "../../../Others/Spinner";

const DisktopChat = () => {
  const { isChatOpen } = useAppSelector((state) => state.stateManeger);
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const { messages, setMessages, loading, error } = useFetchPublicMessages();

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

    if (!stopScrolling) {
      scrollToLastMessage();
    }
  }, [messages]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        {error}
      </div>
    );
  }
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="mx-auto w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center mx-auto bg-[#241f31c0] justify-between h-full w-full ">
      <span
        onClick={() => dispatch(toggleThisEntity({ entity: "isChatOpen" }))}
        className="absolute top-[10%] -left-[38px] px-[9px] py-1 bg-[#513d80f8] rounded-sm"
      >
        {isChatOpen ? (
          <MdArrowForwardIos style={{ fontSize: "20px" }} />
        ) : (
          <MdArrowBackIosNew style={{ fontSize: "20px" }} />
        )}
      </span>
      <ChatHeader />
      <div className="w-full flex flex-col items-center h-[83%] overflow-auto  gap-2 p-2 transition-all">
        {messages.length > 0 &&
          messages.map((message, index) => {
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
                key={message._id}
                singleMessage={message}
                setStopScrolling={setStopScrolling}
                stopScrolling={stopScrolling}
                messageRef={
                  index === messages.length - 1 ? lastMessageRef : null
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

export default DisktopChat;
