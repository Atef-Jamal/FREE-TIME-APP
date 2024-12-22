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
  makeRequest,
} from "../../../../utils";
import { showPopup } from "../../../../context/StateManeger";
import { debounce, handleApiError } from "../../../../utils/common";
import Spinner from "../../../Others/Spinner";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useScrollToElement } from "../../../../hooks/commonHooks";
import { TypePublicChatMessage } from "../../../../types/publicChatTypes";
import { CgClose } from "react-icons/cg";

interface TypeMsgModelDeletion {
  messageId: string;
  messageUrlScreenshot: string;
}

const PublicChat = memo(() => {
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const [stopScrolling, setStopScrolling] = useState<boolean>(false);
  const [stagingMessages, setStagingMessages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [oldMessage, setOldMessage] = useState<TypePublicChatMessage | null>(
    null
  );
  const [isLoadingOldMsg, setIsLoadingOldMsg] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const queryParam = searchParams.get("messageId");
  const [openChatModelDeletion, setOpenChatModelDeletion] =
    useState<TypeMsgModelDeletion | null>(null);
  const dispatch = useAppDispatch();
  const scrollTimout = useRef<NodeJS.Timeout | null>(null);
  const searchParamsTimout = useRef<NodeJS.Timeout | null>(null);

  const limit = 15;

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
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["public-chat-messages"],
    queryFn: ({ pageParam }) => fetchPublicChatMessages({ pageParam, limit }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage, _, pageParam) => {
      return firstPage.hasOlder ? pageParam + 1 : undefined;
    },
    getNextPageParam: () => undefined,
    staleTime: 60 * 60 * 1000,
  });

  const flatedMessages = data?.pages.map((page) => page.messages).flat();

  const messages = flatedMessages?.filter(
    (msg, index, selfArray) =>
      index === selfArray.findIndex((t) => t._id === msg._id)
  );

  const isThereMessages = messages && messages.length > 0;

  const handleRecievedMessage = () => {
    const element = messageContainerRef.current!;
    const addToStaging =
      element.scrollHeight - element.scrollTop > element.clientHeight + 70;

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
        })
      );
    } finally {
      setIsLoadingOldMsg(false);
    }
  };

  const handleLoadMoreMessages = () => {
    setOldMessage(null);
    fetchPreviousPage();
  };

  const handleOpenChatModelDeletion = useCallback(
    (msgInfo: TypeMsgModelDeletion | null) => {
      setOpenChatModelDeletion(msgInfo);
    },
    []
  );

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

  const mutation = useMutation({
    mutationFn: handleDeleteMessage,
    onMutate: () => {
      if (stopScrolling === false) {
        setStopScrolling(true);
      }
    },
    onSuccess: (deletedMessage) => {
      socket?.emit("interact-with-public-message", deletedMessage);
    },
    onError: (error) => {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    },
    onSettled: async () => {
      setOpenChatModelDeletion(null);
    },
  });

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
      if (
        element.scrollHeight - element.scrollTop >
        element.clientHeight + 90
      ) {
        setStopScrolling(true);
      } else {
        if (queryParam) {
          if (searchParamsTimout.current)
            clearTimeout(searchParamsTimout.current);
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
            handleOpenChatModelDeletion={handleOpenChatModelDeletion}
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
  }, [messages, handleOpenChatModelDeletion]);

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

        {hasPreviousPage && !isFetchingPreviousPage && (
          <button
            onClick={handleLoadMoreMessages}
            className="w-full text-center bg-[#56627a]"
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
            <Message
              singleMessage={oldMessage}
              handleOpenChatModelDeletion={handleOpenChatModelDeletion}
            />
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
