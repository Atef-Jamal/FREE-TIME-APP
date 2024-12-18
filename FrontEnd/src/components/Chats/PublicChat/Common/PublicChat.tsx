import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useListenToSocketEvents } from "../../../../hooks/listenersHooks";
import { useSearchParams } from "react-router-dom";
import SendMessage from "./SendMessage";
import Message from "./Message";
import FreeTime from "./FreeTime";
import { FaArrowDownLong } from "react-icons/fa6";
import MessageSkeleton from "./MessageSkeleton";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import {
  fetchPublicChatMessages,
  handleDeleteMessage,
} from "../../../../utils";
import { showPopup } from "../../../../context/StateManeger";
import { handleApiError } from "../../../../utils/common";
import Spinner from "../../../Others/Spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useScrollToElement } from "../../../../hooks/commonHooks";

interface TypeMsgModelDeletion {
  messageId: string;
  messageUrlScreenshot: string;
}

const PublicChat = memo(() => {
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const [stagingMessages, setStagingMessages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const queryParam = searchParams.get("messageId");
  const [openChatModelDeletion, setOpenChatModelDeletion] =
    useState<TypeMsgModelDeletion | null>(null);
  const dispatch = useAppDispatch();

  const {
    data: messages = [],
    status,
    error,
  } = useQuery({
    queryKey: ["public-chat-messages"],
    queryFn: fetchPublicChatMessages,
    staleTime: 60 * 60 * 1000,
  });

  const isThereMessages = messages.length > 0;

  useScrollToElement({
    key: "messageId",
    scrollPosition: "start",
    dependencies: [isThereMessages],
  });

  const scrollToLastMessage = useCallback(() => {
    lastMessageRef.current?.scrollIntoView({
      behavior: "smooth",
    });
    setStagingMessages(0);
  }, []);

  const handleRecievedMessage = () => {
    const element = messageContainerRef.current!;
    const addToStaging =
      element.scrollHeight - element.scrollTop > element.clientHeight + 70;

    if (addToStaging) {
      setStagingMessages((prev) => prev + 1);
    }
  };

  const mutation = useMutation({
    mutationFn: handleDeleteMessage,
    onMutate: () => {
      if (stopScrolling === false) {
        setStopScrolling(true);
      }
    },
    onError: (error) => {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    },
    onSuccess: (deletedMessage) => {
      socket?.emit("interact-with-public-message", deletedMessage);
    },
    onSettled: async () => {
      setOpenChatModelDeletion(null);
    },
  });

  useListenToSocketEvents({
    eventsToListen: ["public-message"],
    handlers: [handleRecievedMessage],
  });

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
            }, 500);
          }
          setStagingMessages(0);
          setStopScrolling(false);
        }
      }, 700);
    };

    element?.addEventListener("scroll", handleScroll);
    return () => {
      element?.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
      clearTimeout(cleanSearchParamTimeout);
    };
  }, [queryParam, setSearchParams]);

  const handleOpenChatModelDeletion = useCallback(
    (msgInfo: TypeMsgModelDeletion | null) => {
      setOpenChatModelDeletion(msgInfo);
    },
    []
  );

  const messagesList = useMemo(() => {
    return messages.map((msg, index) => {
      if (msg.type === "MESSAGE") {
        return (
          <Message
            key={msg._id}
            singleMessage={msg}
            lastMessageRef={
              index === messages.length - 1 ? lastMessageRef : null
            }
            handleOpenChatModelDeletion={handleOpenChatModelDeletion}
          />
        );
      }
      if (msg.type === "FREETIME") {
        return (
          <FreeTime
            key={msg._id}
            singleMessage={msg}
            lastMessageRef={
              index === messages.length - 1 ? lastMessageRef : null
            }
          />
        );
      }
    });
  }, [messages, handleOpenChatModelDeletion]);

  useEffect(() => {
    if (!stopScrolling && !queryParam) {
      scrollToLastMessage();
    }
  }, [messages, stopScrolling, queryParam, scrollToLastMessage]);

  let numofSkeleton = 5;
  if (messageContainerRef.current) {
    numofSkeleton = Math.floor(messageContainerRef.current.clientHeight / 80);
  }

  return (
    <>
      <div
        ref={messageContainerRef}
        className="w-full h-full px-2 sm:px-1 pb-2 sm:pb-1 flex flex-col items-center gap-[5px] overflow-y-scroll sm:scrollbar-none relative"
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
              <img
                src={openChatModelDeletion.messageUrlScreenshot}
                alt="Message-preview"
                className="w-full object-contain h-[75px] mb-[6px] overflow-hidden rounded-xl"
              />
              <div className="flex items-center justify-center gap-x-4">
                <button
                  disabled={mutation.status === "pending"}
                  onClick={() => {
                    mutation.mutate(openChatModelDeletion.messageId);
                  }}
                  className="bg-[#2d773f] rounded-lg py-1 px-8"
                >
                  {mutation.status === "pending" ? (
                    <Spinner className="w-5 h-5" />
                  ) : (
                    "Yes"
                  )}
                </button>
                <button
                  onClick={() => setOpenChatModelDeletion(null)}
                  disabled={mutation.status === "pending"}
                  className="bg-[#0f0e29] rounded-lg py-1 px-9"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {status === "pending" &&
          [...Array(numofSkeleton).keys()].map((skeleton) => (
            <MessageSkeleton key={skeleton} />
          ))}

        {error && (
          <div className="m-auto w-full text-center text-lg font-bold text-[#d15e5e]">
            {error.response?.data.error}
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
        />
      </div>
    </>
  );
});

export default PublicChat;
