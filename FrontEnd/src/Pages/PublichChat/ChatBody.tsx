import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { useSearchParams } from "react-router-dom";
import { useListenToSocketEvents } from "../../hooks/useListenToSocketEvents";
import SendMessage from "./SendMessage";
import Message from "./Message";
import FreeTime from "./FreeTime";
import { FaArrowDownLong } from "react-icons/fa6";
import MessageSkeleton from "./MessageSkeleton";
import { useAppDispatch } from "../../context/hooks";
import { openToast } from "../../context/appStateSlice";
import { axiosRequest, debounce, handleApiError } from "../../utilities";
import { useScrollToElement } from "../../hooks/useScrollToElement";
import type { IPublicChatMessage } from "../../types";
import { ChatModelDeletion } from "./ChatModelDeletion";
import { useInfinitePublicChatMsges } from "../../tanstackQuery/queryFetch";

const PublicChatBody = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const [stagingMessages, setStagingMessages] = useState(0);
  const [oldMessage, setOldMessage] = useState<IPublicChatMessage | null>(null);
  const [isLoadingOldMsg, setIsLoadingOldMsg] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const searchParamsTimout = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useAppDispatch();

  const queryParam = searchParams.get("messageId");

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
  } = useInfinitePublicChatMsges();

  const flatedMessages = data?.pages.map((page) => page.messages).flat();

  const messages = flatedMessages?.filter(
    (msg, index, selfArray) => index === selfArray.findIndex((t) => t._id === msg._id),
  );

  const fetchOldMessage = useCallback(async () => {
    setIsLoadingOldMsg(true);
    try {
      const response = await axiosRequest.get(`/api/publicchat/${queryParam}`);
      const message = response.data;
      setOldMessage(message);
    } catch (error) {
      dispatch(
        openToast({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    } finally {
      setIsLoadingOldMsg(false);
    }
  }, [queryParam, dispatch]);

  const handleRecievedMessage = useCallback(() => {
    const element = messageContainerRef.current!;
    const addToStaging = element.scrollHeight - element.scrollTop > element.clientHeight + 70;
    if (addToStaging) {
      setStagingMessages((prev) => prev + 1);
    }
  }, []);

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

  const events = useMemo(() => ["public-message"], []);
  const handler = useMemo(() => [handleRecievedMessage], [handleRecievedMessage]);

  useListenToSocketEvents({
    eventsToListen: events,
    handlers: handler,
  });

  useScrollToElement({
    key: "messageId",
    scrollPosition: "start",
    startScroll: status === "success",
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

    const debouncedHandleScroll = debounce(handleScroll, 500);
    element.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      element.removeEventListener("scroll", debouncedHandleScroll);
      if (searchParamsTimout.current) clearTimeout(searchParamsTimout.current);
    };
  }, [queryParam, setSearchParams]);

  useEffect(() => {
    if (!stopScrolling && !queryParam) {
      scrollToLastMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, stopScrolling, scrollToLastMessage]);

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

  return (
    <div className="relative flex h-full flex-col gap-y-1">
      <div
        ref={messageContainerRef}
        className="lg:scrollbar-custom relative flex-1 space-y-1 overflow-y-auto px-1 pb-[2px] max-lg:scrollbar-thin lg:px-2"
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

        {/* fetching more older 15 message */}
        {isFetchingPreviousPage && <MessageSkeleton />}

        {/* fetching one specific history message */}
        {isLoadingOldMsg && (
          <div className="sticky left-0 top-0 z-[1] w-full rounded-md border border-[#464646ee] bg-black">
            <MessageSkeleton />
          </div>
        )}

        {hasPreviousPage && !isFetchingPreviousPage && (
          <button
            onClick={handleLoadMoreMessages}
            className="mt-1 w-full rounded-sm bg-[#414752] text-center sm:text-sm"
          >
            Load More
          </button>
        )}

        {isFetchPreviousPageError && !isFetchingPreviousPage && (
          <p className="text-sm">an error occurred during load more</p>
        )}

        {!isLoadingOldMsg && oldMessage && (
          <div className="sticky left-0 top-0 z-[1] w-full rounded-md border border-[#a59e9eee] bg-black">
            <Message singleMessage={oldMessage} handleSetMessageIdToDelete={handleSetMessageIdToDelete} />
            <button
              onClick={handleCloseOldMsg}
              className="absolute right-0 top-0 rounded-md bg-[#0d0d22] px-2 py-1"
            >
              <CgClose className="text-xl" />
            </button>
          </div>
        )}

        {messagesList}
      </div>
      {stagingMessages > 0 && (
        <button
          onClick={scrollToLastMessage}
          className="absolute bottom-[66px] left-[50%] z-[1] flex -translate-x-[50%] items-center justify-center gap-x-1 rounded-full bg-[#1564d1ee] px-2 py-1 text-xs tracking-wider md:text-sm"
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
  );
});

export default PublicChatBody;
