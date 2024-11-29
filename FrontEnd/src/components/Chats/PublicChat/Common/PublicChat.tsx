import { useEffect, useMemo, useRef, useState } from "react";
import {
  useListenToDocumentEvent,
  useListenToSocketEvents,
} from "../../../../hooks/listenersHooks";
import { TypePublicChatItem } from "../../../../types/publicChatTypes";
import { useScrollToElement } from "../../../../hooks/commonHooks";
import { useSearchParams } from "react-router-dom";
import { useFetchPublicMessages } from "../../../../hooks";
import SendMessage from "./SendMessage";
import Message from "./Message";
import FreeTime from "./FreeTime";
import { FaArrowDownLong } from "react-icons/fa6";
import MessageSkeleton from "./MessageSkeleton";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import { makeRequest } from "../../../../utils";
import { showPopup } from "../../../../context/StateManeger";
import { handleApiError } from "../../../../utils/common";
import Spinner from "../../../Others/Spinner";
import Image from "../../../Others/Image";

const PublicChat = () => {
  const { socket } = useAppSelector((state) => state.stateManeger);
  const { messages, setMessages, loading, error } = useFetchPublicMessages();
  const { setElement } = useScrollToElement([messages], "start", "messageId");
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [stagingMessages, setStagingMessages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const queryParam = searchParams.get("messageId");
  const [openChatModelDeletion, setOpenChatModelDeletion] = useState<{
    messageId: string;
    messageUrlScreenshot: string;
  } | null>(null);

  const dispatch = useAppDispatch();

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
    setMessages((prev) => [...prev, data.detail]);
  };

  useListenToSocketEvents({
    eventsToListen: ["public-message"],
    handlers: [handleAddNewMessage],
  });

  useListenToDocumentEvent({
    eventToListen: "fastSendPublicMessage",
    onUpdate: handleAddMessage,
  });

  const scrollToLastMessage = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    setStagingMessages(0);
  };

  useEffect(() => {
    const element = messageContainerRef.current;
    let timeout: NodeJS.Timeout;
    let cleanSearchParamTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (!element) return;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (
          element.scrollHeight - element.scrollTop >
          element.clientHeight + 90
        ) {
          setStopScrolling(true);
        } else {
          if (queryParam) {
            clearTimeout(cleanSearchParamTimeout);
            cleanSearchParamTimeout = setTimeout(() => {
              setSearchParams((prev) => {
                prev.delete("messageId");
                return prev;
              });
              setElement(null);
            }, 500);
          }
          setStagingMessages(0);
          setStopScrolling(false);
        }
      }, 700);
    };

    messageContainerRef.current?.addEventListener("scroll", handleScroll);
    return () => {
      messageContainerRef.current?.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
      clearTimeout(cleanSearchParamTimeout);
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
            setOpenChatModelDeletion={setOpenChatModelDeletion}
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
  }, [messages, setOpenChatModelDeletion]);

  useEffect(() => {
    if (!stopScrolling && !queryParam) {
      scrollToLastMessage();
    }
  }, [messages]);

  let numofSkeleton = 5;
  if (messageContainerRef.current) {
    numofSkeleton = Math.floor(messageContainerRef.current.clientHeight / 80);
  }

  const deleteMessage = async (messageId: string) => {
    setIsDeleting(true);
    if (stopScrolling === false) {
      setStopScrolling(true);
    }

    try {
      const response = await makeRequest.patch(`api/publicchatw/${messageId}`, {
        isDeleted: true,
      });
      socket?.emit("interact-with-public-message", response.data);
      const customEvent = new CustomEvent("fastDeletePublicMessage", {
        detail: response.data,
      });
      document.dispatchEvent(customEvent);
    } catch (error) {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    } finally {
      setIsDeleting(false);
      setOpenChatModelDeletion(null);
    }
  };

  return (
    <>
      <div
        ref={messageContainerRef}
        className="w-full h-full px-2 sm:px-1 pb-2 sm:pb-1 flex flex-col items-center gap-[5px] overflow-y-scroll sm:scrollbar-none transition-all relative"
      >
        {openChatModelDeletion && (
          <div
            onClick={() => setOpenChatModelDeletion(null)}
            style={{
              height: messageContainerRef.current?.scrollHeight,
            }}
            className="absolute w-full top-0 z-[1] bg-[#03020ab6]"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="sticky top-[35%] border border-[#645252] bg-[#242222] rounded-lg mx-2 p-2"
            >
              <p className="text-sm text-[#87abc9] font-bold text-center mb-1">
                Are your sure to delete your message ?
              </p>
              <Image
                alt="Message-preview"
                src={openChatModelDeletion.messageUrlScreenshot}
                className="w-full object-contain h-[75px] mb-[6px] overflow-hidden rounded-xl"
              />
              <div className="flex items-center justify-center gap-x-4">
                <button
                  disabled={isDeleting}
                  onClick={() => {
                    deleteMessage(openChatModelDeletion.messageId);
                  }}
                  className="bg-[#2d773f] rounded-lg py-1 px-8"
                >
                  {isDeleting ? <Spinner className="w-5 h-5" /> : "Yes"}
                </button>
                <button
                  onClick={() => setOpenChatModelDeletion(null)}
                  disabled={isDeleting}
                  className="bg-[#0f0e29] rounded-lg py-1 px-9"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {loading &&
          [...Array(numofSkeleton).keys()].map((skeleton) => (
            <MessageSkeleton key={skeleton} />
          ))}

        {!error && (
          <div className="m-auto w-full text-center text-lg font-bold text-[#d15e5e]">
            {error}
          </div>
        )}
        {messagesList}
      </div>
      <div className="w-full relative flex items-center justify-center">
        {stagingMessages > 0 && (
          <button
            onClick={scrollToLastMessage}
            className="absolute -top-[40px] sm:-top-[35px] px-2 py-1 bg-[#1564d1ee] text-sm sm:text-xs  rounded-full font-bold tracking-wider flex items-center justify-center gap-1"
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
