import { useCallback, useMemo, useRef, useState } from "react";
import { SetURLSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuId } from "uuid";
import { FcLock } from "react-icons/fc";
import { MdSend } from "react-icons/md";
import { RiBaseStationLine } from "react-icons/ri";
import { IPublicChatItem } from "../../types/publicChatTypes";
import { IUser } from "../../types/userTypes";
import { openToast } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { sendPublicChatMessage } from "../../services";
import { cn, handleApiError } from "../../utilities";
import { useListenToSocketEvents } from "../../hooks/useListenToSocketEvents";
import MentionListOfUsers from "./MentionListOfUsers";
import {
  addFailedPublicMsgCache,
  addPendingPublicMsgCache,
  addSuccessPublicMsgCache,
} from "../../tanstackQuery/queryCache";

interface IProps {
  stopScrolling: boolean;
  setStopScrolling: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchParams: SetURLSearchParams;
}

const SendMessage = ({ stopScrolling, setStopScrolling, setSearchParams }: IProps) => {
  const currentUser = useAppSelector((state) => state.appState.currentUser);
  const currentUserStatus = useAppSelector((state) => state.appState.currentUserStatus);
  const socket = useAppSelector((state) => state.appState.socket);
  const onlineUsers = useAppSelector((state) => state.appState.onlineUsers);
  const [openMentionList, setOpenMentionList] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [mentionedUsers, setMentionedUsers] = useState<Set<IUser>>(new Set());
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const timeOutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: sendPublicChatMessage,
    onMutate: async () => {
      if (!currentUser) return;
      await queryClient.cancelQueries({ queryKey: ["public-chat-messages"] });
      const uniqeIdForRollback = uuId();
      const optimisticMsg: IPublicChatItem = {
        _id: uniqeIdForRollback,
        sender: currentUser,
        type: "MESSAGE",
        message,
        loves: [],
        likes: [],
        dislikes: [],
        isDeleted: false,
        mentionedUsers: mentionedUsers,
        createdAt: new Date(new Date().toLocaleString("en-US")),
        updatedAt: new Date(new Date().toLocaleString("en-US")),
        isSended: "PENDING",
      };

      addPendingPublicMsgCache({ queryClient, optimisticMsg });

      setMessage("");
      inputRef.current?.focus();
      inputRef.current!.style.height = "auto";
      return { uniqeIdForRollback, optimisticMsg };
    },
    onSuccess: (newMessage, _, context) => {
      addSuccessPublicMsgCache({ queryClient, uniqeIdForRollback: context.uniqeIdForRollback, newMessage });
      socket?.emit("public-message", newMessage);
      if (mentionedUsers.size > 0) {
        setMentionedUsers(new Set());
      }
    },
    onError: (error, _, context) => {
      if (context && currentUser) {
        const failedMessage: IPublicChatItem = {
          _id: uuId(),
          sender: currentUser,
          type: "MESSAGE",
          message,
          loves: [],
          likes: [],
          dislikes: [],
          isDeleted: false,
          mentionedUsers: mentionedUsers,
          createdAt: new Date(new Date().toLocaleString("en-US")),
          updatedAt: new Date(new Date().toLocaleString("en-US")),
          isSended: "FAILED",
        };
        addFailedPublicMsgCache({
          queryClient,
          failedMessage,
          uniqeIdForRollback: context.uniqeIdForRollback,
        });
      }

      dispatch(
        openToast({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    },
  });

  const sendMessageHandler = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!currentUser) return;
    if (message.trim() === "") {
      dispatch(
        openToast({
          type: "ERROR_GENERAL",
          message: "Enter a Message",
        }),
      );
      return;
    }
    setSearchParams((prev) => {
      prev.delete("messageId");
      return prev;
    });
    if (stopScrolling) setStopScrolling(false);

    mutation.mutate({ message, mentionedUsers: [...mentionedUsers].map((i) => i._id) });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textareaElement = e.target;

    inputRef.current!.style.height = "auto";
    inputRef.current!.style.height = `${textareaElement.scrollHeight}px`;

    setMessage(textareaElement.value);
    if (!isTyping && textareaElement.value.trim() !== "") {
      setIsTyping(true);
      socket?.emit("typing-public-message");
    }
    const lastTypingTime = new Date().getTime();
    const timmerLenth = 3000;

    if (timeOutIdRef.current) clearTimeout(timeOutIdRef.current);
    timeOutIdRef.current = setTimeout(() => {
      const now = new Date().getTime();
      const timDifference = now - lastTypingTime;
      if (timDifference >= timmerLenth) {
        socket?.emit("stop-typing-public-message");
        setIsTyping(false);
      }
    }, timmerLenth);
  };

  const handleOpenMentionList = () => {
    setOpenMentionList((prev) => !prev);
  };

  const handleTyping = useCallback(() => {
    setIsTyping(true);
  }, []);

  const handleStopTyping = useCallback(() => {
    setIsTyping(false);
  }, []);

  const events = useMemo(() => ["typing-public-message", "stop-typing-public-message"], []);
  const handlers = useMemo(() => [handleTyping, handleStopTyping], [handleTyping, handleStopTyping]);

  useListenToSocketEvents({
    eventsToListen: events,
    handlers: handlers,
  });

  return (
    <div className={cn("relative flex flex-col")}>
      {openMentionList && (
        <div className="absolute -top-[152px] left-0 h-[150px] w-full border-y border-gray-500">
          <MentionListOfUsers setMentionedUsers={setMentionedUsers} setOpenMentionList={setOpenMentionList} />
        </div>
      )}

      <div className="flex items-center gap-x-1 bg-[#302d2dee] p-[2px] lg:px-2">
        <span className="flex items-center justify-center text-xs text-[#a5a760]">
          <RiBaseStationLine className="text-lg" />
          <span className="mx-1 text-[#83db5a]">{onlineUsers.length}</span>
          Onlines
        </span>

        {isTyping && <p className="text-xs">somone is typing...</p>}

        <div className="flex flex-1 items-center gap-x-1 overflow-x-auto scrollbar-none">
          {[...mentionedUsers]
            .map((user) => (
              <div
                key={user._id}
                onClick={() =>
                  setMentionedUsers(
                    (prev) => new Set([...prev].filter((prevUser) => prevUser._id !== user._id)),
                  )
                }
                className="flex items-center justify-center gap-x-2 rounded-sm bg-[#201d42] px-1 py-[2px]"
              >
                <span className="text-nowrap text-[10px]">{user.name}</span>
                <span className="text-[10px]">x</span>
              </div>
            ))
            .reverse()}
        </div>
      </div>

      <form className={"relative flex items-end justify-center"}>
        {currentUserStatus !== "authenticated" && (
          <div className="absolute z-[1] flex h-full w-full items-center justify-start gap-x-3 px-5 backdrop-blur-[2.5px] backdrop-brightness-[0.7]">
            <FcLock className="text-2xl" />
            <span className="">Register To Unlock</span>
          </div>
        )}
        <textarea
          ref={inputRef}
          onChange={handleInputChange}
          readOnly={!currentUser}
          value={message}
          placeholder={!currentUser ? "Register First " : "Type here.."}
          rows={1}
          className={
            "max-h-[250px] min-h-[35px] flex-1 resize-none overflow-scroll bg-[#090b20] p-2 text-xs text-[#a0bb9d] -outline-offset-1 scrollbar-none placeholder:tracking-wide placeholder:text-[#ccadad] placeholder:opacity-30 focus:outline focus:outline-[#2bf70273] md:text-sm lg:text-base lg:-outline-offset-[3px]"
          }
        />

        <span
          onClick={handleOpenMentionList}
          className="flex h-[35px] w-[45px] items-center justify-center bg-[#542ba06e] text-lg font-bold text-gray-400 md:h-[36px] lg:h-[40px]"
        >
          @
        </span>

        <button
          type="submit"
          className="flex h-[35px] w-[55px] items-center justify-center bg-[#217ebbf3] md:h-[36px] lg:h-[40px]"
          onClick={sendMessageHandler}
          disabled={!currentUser || mutation.isPending}
        >
          <MdSend className="text-xl" />
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
