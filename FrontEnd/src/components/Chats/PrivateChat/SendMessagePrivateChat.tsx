import { IoMdSend } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { showPopup } from "../../../context/StateManeger";
import { sendPrivateChatMessage } from "../../../utils";
import { handleApiError } from "../../../utils/common";
import { v4 as uuId } from "uuid";

import {
  TypeConversation,
  TypePrivateMessage,
} from "../../../types/privateChatTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../../../types/userTypes";

interface TypeProps {
  id: string;
}
export interface TypeCashedChat {
  secondUser: User;
  messages: TypePrivateMessage[];
}
const SendMessagePrivateChat = ({ id }: TypeProps) => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const contentText = event.target;

    inputRef.current!.style.height = "auto";
    inputRef.current!.style.height = `${contentText.scrollHeight}px`;

    setMessage(contentText.value);
  };

  const mutation = useMutation({
    mutationFn: sendPrivateChatMessage,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["private-messages", id] });
      const uniqeIdForRollback = uuId();
      const optimisticMsg = {
        _id: uniqeIdForRollback,
        sender: currentUser,
        message,
        createdAt: new Date().toLocaleString("en-US"),
        updatedAt: new Date().toLocaleString("en-US"),
        isRead: false,
        isSended: "PENDING",
      };

      queryClient.setQueryData(
        ["private-messages", id],
        (previous: TypeCashedChat) => {
          return {
            ...previous,
            messages: [...previous.messages, optimisticMsg],
          };
        }
      );
      setMessage("");
      inputRef.current?.focus();
      inputRef.current!.style.height = "auto";
      return { uniqeIdForRollback };
    },
    onSuccess: (data, _, context) => {
      queryClient.setQueryData(
        ["private-messages", id],
        (old: TypeCashedChat) => {
          if (old) {
            return {
              ...old,
              messages: old.messages.map((msg) => {
                if (msg._id === context.uniqeIdForRollback) {
                  return { ...data, isSended: "SUCCESS" };
                } else {
                  return msg;
                }
              }),
            };
          }
        }
      );
      queryClient.setQueryData(["conversations"], (old: TypeConversation[]) => {
        if (old) {
          return old.map((conv) => {
            if (conv.secondParty._id === id) {
              return { ...conv, lastMessage: data };
            } else {
              return conv;
            }
          });
        }
      });
      socket?.emit("private-message", { to: id, data: data });
    },
    onError: (error, _, context) => {
      if (context)
        queryClient.setQueryData(
          ["private-messages", id],
          (old: TypeCashedChat) => {
            if (old) {
              return {
                ...old,
                messages: old.messages.map((msg) => {
                  if (msg._id === context.uniqeIdForRollback) {
                    return { ...msg, isSended: "FAILED" };
                  } else {
                    return msg;
                  }
                }),
              };
            }
          }
        );
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    },
  });

  const sendPrivateMessageHandler = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (message.trim() === "") {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: "Enter a Message",
        })
      );
      return;
    }
    mutation.mutate({ secondUserId: id, message });
  };

  return (
    <form className="w-full flex items-end justify-between gap-3 sm:gap-1 px-1">
      <textarea
        ref={inputRef}
        style={{ lineHeight: "1", maxHeight: "300px" }}
        onChange={handleChange}
        value={message}
        rows={1}
        className="outline-none rounded-md grow p-3 placeholder:opacity-30 placeholder:text-[#a39595] bg-[#090b20] text-[#a0bb9d] placeholder:tracking-wide sm:text-sm  resize-none overflow-scroll scrollbar-none"
        placeholder="Enter a message"
      />
      <button
        className="bg-[#3c3b72] rounded-md flex items-center justify-center py-2 sm:px-3 px-5"
        onClick={sendPrivateMessageHandler}
      >
        <IoMdSend className="text-2xl sm:text-[22px]" />
      </button>
    </form>
  );
};

export default SendMessagePrivateChat;
