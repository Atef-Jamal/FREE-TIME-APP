import React, {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useRef,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { FcLock } from "react-icons/fc";
import { MdSend } from "react-icons/md";
import { showPopup } from "../../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import MentionListOfUsers from "./MentionListOfUsers";
import { sendPublicChatMessage } from "../../../../utils";
import { handleApiError } from "../../../../utils/common";
import { useListenToSocketEvents } from "../../../../hooks";
import { RiBaseStationLine } from "react-icons/ri";
import { TypeCashedPublicChat, TypePublicChatItem } from "../../../../types/publicChatTypes";
import { User } from "../../../../types/userTypes";
import { v4 as uuId } from "uuid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SetURLSearchParams } from "react-router-dom";

interface typeProps {
  stopScrolling: boolean;
  setStopScrolling: Dispatch<SetStateAction<boolean>>;
  setSearchParams: SetURLSearchParams;
}

const SendMessage = ({ stopScrolling, setStopScrolling, setSearchParams }: typeProps) => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const onlineUsers = useAppSelector((state) => state.stateManeger.onlineUsers);
  const [openMentionList, setOpenMentionList] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
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
      const optimisticMsg: TypePublicChatItem = {
        _id: uniqeIdForRollback,
        sender: currentUser,
        type: "MESSAGE",
        message,
        loves: [],
        likes: [],
        dislikes: [],
        isDeleted: false,
        mentioned: user || null,
        createdAt: new Date(new Date().toLocaleString("en-US")),
        updatedAt: new Date(new Date().toLocaleString("en-US")),
        isSended: "PENDING",
      };

      queryClient.setQueryData(
        ["public-chat-messages"],
        (previous: TypeCashedPublicChat): TypeCashedPublicChat | undefined => {
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
        }
      );

      setMessage("");
      inputRef.current?.focus();
      inputRef.current!.style.height = "auto";
      return { uniqeIdForRollback, optimisticMsg };
    },
    onSuccess: (data, _, context) => {
      queryClient.setQueryData(
        ["public-chat-messages"],
        (previous: TypeCashedPublicChat): TypeCashedPublicChat | undefined => {
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
        }
      );
      socket?.emit("public-message", data);
      if (user) {
        setUser(null);
      }
    },
    onError: (error, _, context) => {
      if (context && currentUser) {
        const failedMessage: TypePublicChatItem = {
          _id: uuId(),
          sender: currentUser,
          type: "MESSAGE",
          message,
          loves: [],
          likes: [],
          dislikes: [],
          isDeleted: false,
          mentioned: user || null,
          createdAt: new Date(new Date().toLocaleString("en-US")),
          updatedAt: new Date(new Date().toLocaleString("en-US")),
          isSended: "FAILED",
        };
        queryClient.setQueryData(
          ["public-chat-messages"],
          (previous: TypeCashedPublicChat): TypeCashedPublicChat | undefined => {
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
          }
        );
      }

      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
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
        })
      );
      return;
    }
    setSearchParams((prev) => {
      prev.delete("messageId");
      return prev;
    });
    if (stopScrolling) setStopScrolling(false);

    mutation.mutate({ message, mentionedUserId: user?._id });
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
    [socket, somoneTyping]
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

  useEffect(() => {
    return () => {
      socket?.emit("stop-typing-public-message");
    };
  }, [socket]);

  return (
    <div className="relative w-full bg-[#0a071670] flex flex-col items-center px-2 pb-2 pt-1">
      <div className="flex items-center w-full">
        <span className="hidden sm:flex items-center justify-center text-xs text-[#a2a345]">
          <RiBaseStationLine className="opacity-70" />
          <span className="text-[#7ff349] mx-1">{onlineUsers.length}</span>
          Online Now
        </span>
        <span
          className={`transition-all ${
            somoneTyping ? "opacity-100" : "opacity-0"
          } pl-3 text-xs text-[#f58585]`}
        >
          somone typing ...
        </span>
      </div>
      {openMentionList && (
        <div className="absolute -top-[152px] left-2 w-[95%] h-[150px] border border-gray-500">
          <MentionListOfUsers setUser={setUser} setOpenMentionList={setOpenMentionList} />
        </div>
      )}
      {!currentUser && (
        <div className="absolute z-[1] sm:top-5 top-1 w-full sm:h-[48px] h-[55px] flex sm:pt-1 sm:items-start items-center justify-center gap-4 text-lg font-bold">
          <span className="py-1 px-2 rounded-md bg-[#000000]">
            <FcLock className="text-xl" />
          </span>
          Sign Up To Unlock
        </div>
      )}
      <form className={`${!currentUser && "blur-sm"} w-full relative flex items-end justify-between gap-1`}>
        <textarea
          ref={inputRef}
          onChange={handleInputChange}
          readOnly={!currentUser}
          value={message}
          placeholder={!currentUser ? "Sign Up First " : "Type Here.."}
          style={{ lineHeight: "1", maxHeight: "250px" }}
          rows={1}
          className={`${
            user ? "pl-[60px] pt-3 py-3" : "p-3"
          } bg-[#2f3042a2] text-[#afc6e0] rounded-md border-none outline-none placeholder:text-gray-600 w-full resize-none overflow-scroll scrollbar-none`}
        />
        {user && (
          <span
            onClick={() => setUser(null)}
            className="absolute top-1 left-1 text-center py-[6px] text-[11px] w-[50px] truncate bg-[#3c5db8e0] rounded-md px-[3px] cursor-pointer"
          >
            {user.name}
          </span>
        )}
        <div onClick={handleOpenMentionList} className="relative py-[6px] px-3 rounded-md bg-[#542ba06e] ">
          <p className=" text-gray-400 font-bold text-lg">@</p>
        </div>
        <button
          type="submit"
          className="bg-[#217ebbf3] rounded-md w-12 h-10 flex items-center justify-center"
          onClick={sendMessageHandler}
          disabled={!currentUser || mutation.isPending}
        >
          <MdSend />
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
