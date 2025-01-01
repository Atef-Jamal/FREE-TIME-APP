import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useListenToSocketEvents } from "../../../../hooks";
import { useSearchParams } from "react-router-dom";
import SendMessage from "./SendMessage";
import Message from "./Message";
import FreeTime from "./FreeTime";
import { FaArrowDownLong } from "react-icons/fa6";
import MessageSkeleton from "./MessageSkeleton";
import { useAppDispatch } from "../../../../context/Hooks";
import { fetchPublicChatMessages, makeRequest } from "../../../../utils";
import { showPopup } from "../../../../context/StateManeger";
import { debounce, handleApiError } from "../../../../utils/common";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useScrollToElement } from "../../../../hooks";
import { TypePublicChatMessage } from "../../../../types/publicChatTypes";
import { CgClose } from "react-icons/cg";
import { ChatModelDeletion } from "./ChatModelDeletion";

export interface TypeMsgModelDeletion {
  messageId: string;
}

const PublicChat = memo(() => {
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const [stagingMessages, setStagingMessages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [oldMessage, setOldMessage] = useState<TypePublicChatMessage | null>(null);
  const [isLoadingOldMsg, setIsLoadingOldMsg] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const queryParam = searchParams.get("messageId");
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const scrollTimout = useRef<NodeJS.Timeout | null>(null);
  const searchParamsTimout = useRef<NodeJS.Timeout | null>(null);

  let numofSkeleton = 5;
  if (messageContainerRef.current) {
    numofSkeleton = Math.floor(messageContainerRef.current.clientHeight / 80);
  }

  const {
    data,
    status,
    error,
    hasPreviousPage,
    isFetchingPreviousPage,
    isFetchPreviousPageError,
    fetchPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["public-chat-messages"],
    queryFn: ({ pageParam }) => fetchPublicChatMessages({ pageParam, limit: 15 }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage, _, pageParam) => {
      return firstPage.hasOlder ? pageParam + 1 : undefined;
    },
    getNextPageParam: () => undefined,
    staleTime: 60 * 60 * 1000,
  });

  const flatedMessages = data?.pages.map((page) => page.messages).flat();

  const messages = flatedMessages?.filter(
    (msg, index, selfArray) => index === selfArray.findIndex((t) => t._id === msg._id),
  );

  const isThereMessages = messages && messages.length > 0;

  const handleRecievedMessage = () => {
    const element = messageContainerRef.current!;
    const addToStaging = element.scrollHeight - element.scrollTop > element.clientHeight + 70;

    if (addToStaging) {
      setStagingMessages((prev) => prev + 1);
    }
  };

  const fetchOldMessage = async () => {
    if (!isThereMessages) return;
    setIsLoadingOldMsg(true);
    try {
      const response = await makeRequest.get(`/api/publicchat/${queryParam}`);
      const message = response.data;
      setOldMessage(message);
    } catch (error) {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    } finally {
      setIsLoadingOldMsg(false);
    }
  };

  const handleLoadMoreMessages = () => {
    setOldMessage(null);
    fetchPreviousPage();
  };

  const handleSetMessageIdToDelete = useCallback((messageId: string | null) => {
    setMessageToDelete(messageId);
  }, []);

  const handleCloseOldMsg = () => {
    setSearchParams((prev) => {
      prev.delete("messageId");
      return prev;
    });
    setOldMessage(null);
  };

  const scrollToLastMessage = useCallback(() => {
    lastMessageRef.current?.scrollIntoView({
      behavior: "smooth",
    });
    setStagingMessages(0);
  }, []);

  useListenToSocketEvents({
    eventsToListen: ["public-message"],
    handlers: [handleRecievedMessage],
  });

  useScrollToElement({
    key: "messageId",
    scrollPosition: "start",
    dependencies: [isThereMessages],
    callback: fetchOldMessage,
  });

  useEffect(() => {
    const element = messageContainerRef.current;
    if (!element) return;

    const handleScroll = () => {
      if (element.scrollHeight - element.scrollTop > element.clientHeight + 90) {
        setStopScrolling(true);
      } else {
        if (queryParam) {
          if (searchParamsTimout.current) clearTimeout(searchParamsTimout.current);
          searchParamsTimout.current = setTimeout(() => {
            setSearchParams((prev) => {
              prev.delete("messageId");
              return prev;
            });
          }, 500);
        }

        setStagingMessages(0);
        setStopScrolling(false);
      }
    };

    const debouncedHandleScroll = debounce(handleScroll, 700, scrollTimout);
    element.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      element.removeEventListener("scroll", debouncedHandleScroll);
      if (searchParamsTimout.current) clearTimeout(searchParamsTimout.current);
    };
  }, [queryParam, setSearchParams]);

  const messagesList = useMemo(() => {
    return messages?.map((msg, index) => {
      const isLastMessage = messages.length - 1 === index;
      if (msg.type === "MESSAGE") {
        return (
          <Message
            key={msg._id}
            singleMessage={msg}
            lastMessageRef={isLastMessage ? lastMessageRef : null}
            handleSetMessageIdToDelete={handleSetMessageIdToDelete}
          />
        );
      }
      if (msg.type === "FREETIME") {
        return (
          <FreeTime
            key={msg._id}
            singleMessage={msg}
            lastMessageRef={isLastMessage ? lastMessageRef : null}
          />
        );
      }
    });
  }, [messages, handleSetMessageIdToDelete]);

  useEffect(() => {
    if (!stopScrolling && !queryParam) {
      scrollToLastMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, stopScrolling, scrollToLastMessage]);

  return (
    <>
      <div
        ref={messageContainerRef}
        className="w-full h-full px-2 sm:px-1 pb-2 sm:pb-1 flex flex-col items-center gap-[5px] overflow-y-scroll sm:scrollbar-none relative"
      >
        {messageToDelete && (
          <ChatModelDeletion
            height={messageContainerRef.current?.scrollHeight}
            messageToDelete={messageToDelete}
            setMessageToDelete={setMessageToDelete}
          />
        )}

        {status === "pending" &&
          [...Array(numofSkeleton).keys()].map((skeleton) => <MessageSkeleton key={skeleton} />)}

        {error && (
          <div className="m-auto w-full text-center text-lg font-bold text-[#d15e5e]">
            {error.response?.data.error}
          </div>
        )}

        {hasPreviousPage && !isFetchingPreviousPage && (
          <button
            onClick={handleLoadMoreMessages}
            className="mt-1 sm:text-sm w-full text-center bg-[#414752] rounded-md"
          >
            Load More
          </button>
        )}

        {isFetchingPreviousPage && <MessageSkeleton />}

        {isFetchPreviousPageError && !isFetchingPreviousPage && (
          <p className="text-sm">an error occurred during load more</p>
        )}

        {!isLoadingOldMsg && oldMessage && (
          <div className="sticky z-[1] top-0 left-0 w-full rounded-md border border-[#a59e9eee] bg-black">
            <Message singleMessage={oldMessage} handleSetMessageIdToDelete={handleSetMessageIdToDelete} />
            <button
              onClick={handleCloseOldMsg}
              className="absolute top-0 right-0 rounded-md py-1 px-2 bg-[#0d0d22]"
            >
              <CgClose className="text-xl" />
            </button>
          </div>
        )}
        {isLoadingOldMsg && (
          <div className="sticky z-[1] top-0 left-0 w-full rounded-md border border-[#464646ee] bg-black">
            <MessageSkeleton />
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
          setSearchParams={setSearchParams}
        />
      </div>
    </>
  );
});

export default PublicChat;
