import React, {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { FcLock } from "react-icons/fc";
import { MdSend } from "react-icons/md";
import { showPopup } from "../../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import MentionListOfUsers from "./MentionListOfUsers";
import { sendPublicChatMessage } from "../../../../utils";
import { cn, handleApiError } from "../../../../utils/common";
import { useListenToSocketEvents } from "../../../../hooks";
import { RiBaseStationLine } from "react-icons/ri";
import { ICashedPublicChat, IPublicChatItem } from "../../../../types/publicChatTypes";
import { IUser } from "../../../../types/userTypes";
import { v4 as uuId } from "uuid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SetURLSearchParams } from "react-router-dom";

interface IProps {
  stopScrolling: boolean;
  setStopScrolling: Dispatch<SetStateAction<boolean>>;
  setSearchParams: SetURLSearchParams;
}

const SendMessage = ({ stopScrolling, setStopScrolling, setSearchParams }: IProps) => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const onlineUsers = useAppSelector((state) => state.stateManeger.onlineUsers);
  const [openMentionList, setOpenMentionList] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [mentionedUsers, setMentionedUsers] = useState<Set<IUser>>(new Set());
  const [somoneTyping, setSomeOneTyping] = useState<boolean>(false);
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);
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

      queryClient.setQueryData(
        ["public-chat-messages"],
        (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
          if (!previous) return;

          return {
            ...previous,
            pages: previous.pages.map((page, index) => {
              if (index === previous.pages.length - 1) {
                return { ...page, messages: [...page.messages, optimisticMsg] };
              }
              return page;
            }),
          };
        },
      );

      setMessage("");
      inputRef.current?.focus();
      inputRef.current!.style.height = "auto";
      return { uniqeIdForRollback, optimisticMsg };
    },
    onSuccess: (data, _, context) => {
      queryClient.setQueryData(
        ["public-chat-messages"],
        (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
          if (!previous) return;
          return {
            ...previous,
            pages: previous.pages.map((page, index) => {
              if (index === previous.pages.length - 1) {
                return {
                  ...page,
                  messages: page.messages.map((msg) => {
                    if (msg.type === "MESSAGE" && msg._id === context.uniqeIdForRollback) {
                      return { ...data, isSended: "SUCCESS" };
                    }
                    return msg;
                  }),
                };
              }
              return page;
            }),
          };
        },
      );
      socket?.emit("public-message", data);
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
        queryClient.setQueryData(
          ["public-chat-messages"],
          (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
            if (!previous) return;
            return {
              ...previous,
              pages: previous.pages.map((page, index) => {
                if (index === previous.pages.length - 1) {
                  return {
                    ...page,
                    messages: page.messages.map((msg) => {
                      if (msg._id === context.uniqeIdForRollback) {
                        return failedMessage;
                      }
                      return msg;
                    }),
                  };
                }
                return page;
              }),
            };
          },
        );
      }

      dispatch(
        showPopup({
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
        showPopup({
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

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const contentText = e.target;

      inputRef.current!.style.height = "auto";
      inputRef.current!.style.height = `${contentText.scrollHeight}px`;

      setMessage(contentText.value);
      if (!somoneTyping && contentText.value.trim() !== "") {
        setSomeOneTyping(true);
        socket?.emit("typing-public-message");
      }

      if (contentText.value.trim() === "") {
        socket?.emit("stop-typing-public-message");
        setSomeOneTyping(false);
      } else {
        const lastTypingTime = new Date().getTime();
        const timmerLenth = 3000;
        const timmer = setTimeout(() => {
          const now = new Date().getTime();
          const timDiff = now - lastTypingTime;

          if (timDiff >= timmerLenth) {
            socket?.emit("stop-typing-public-message");
            setSomeOneTyping(false);
          }
        }, timmerLenth);
        if (timeOutRef.current) clearTimeout(timeOutRef.current);
        timeOutRef.current = timmer;
      }
    },
    [socket, somoneTyping],
  );

  const handleOpenMentionList = (e: MouseEvent) => {
    e.stopPropagation();
    setOpenMentionList((prev) => !prev);
  };

  const handleTyping = () => {
    if (!somoneTyping) {
      setSomeOneTyping(true);
    }
  };

  const handleStopTyping = () => {
    setSomeOneTyping(false);
  };

  useListenToSocketEvents({
    eventsToListen: ["typing-public-message", "stop-typing-public-message"],
    handlers: [handleTyping, handleStopTyping],
  });

  return (
    <div className={cn("relative flex flex-col")}>
      {openMentionList && (
        <div className="absolute -top-[152px] left-0 h-[150px] w-full border border-gray-500">
          <MentionListOfUsers setMentionedUsers={setMentionedUsers} setOpenMentionList={setOpenMentionList} />
        </div>
      )}

      <div className="flex items-center gap-x-1 bg-[#302d2dee] p-[2px] lg:px-2">
        <span className="flex items-center justify-center text-xs text-[#a5a760]">
          <RiBaseStationLine className="text-lg" />
          <span className="mx-1 text-[#83db5a]">{onlineUsers.length}</span>
          Onlines
        </span>

        {somoneTyping && <p className="text-xs">somone is typing...</p>}

        <div className="flex flex-1 items-center gap-x-1 overflow-x-auto scrollbar-thin">
          {[...mentionedUsers].map((user) => (
            <div
              key={user._id}
              onClick={() =>
                setMentionedUsers(
                  (prev) => new Set([...prev].filter((prevUser) => prevUser._id !== user._id)),
                )
              }
              className="flex items-center justify-center gap-x-2 rounded-sm bg-[#201d42] px-1 py-[2px]"
            >
              <span className="text-[10px]">{user.name}</span>
              <span className="text-[10px]">x</span>
            </div>
          ))}
        </div>
      </div>

      <form className={"relative flex items-center justify-center"}>
        {currentUserStatus !== "authenticated" && (
          <div className="absolute z-[1] flex h-full w-full items-center justify-center gap-x-3 backdrop-blur-[2.5px] backdrop-brightness-[0.7]">
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
            "max-h-[250px] min-h-[35px] flex-1 resize-none overflow-scroll bg-[#090b20] p-2 text-xs text-[#a0bb9d] outline-none scrollbar-none placeholder:tracking-wide placeholder:text-[#ccadad] placeholder:opacity-30 md:text-sm lg:text-base"
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
