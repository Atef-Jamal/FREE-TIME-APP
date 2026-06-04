import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuId } from "uuid";
import { IoMdSend } from "react-icons/io";
import { openToast, selectCurrentUser, selectSocket } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { sendPrivateChatMessage } from "../../services";
import { handleApiError } from "../../utilities";
import {
  addPendingPrivateMsgCache,
  addSuccessPrivateMsgCache,
  addFailedPrivateMsgCache,
} from "../../tanstackQuery/queryCache";

interface IProps {
  activeChatId: string;
}

const SendMessagePrivateChat = ({ activeChatId }: IProps) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const socket = useAppSelector(selectSocket);
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const elementTarget = event.target;

    inputRef.current!.style.height = "auto";
    inputRef.current!.style.height = `${elementTarget.scrollHeight}px`;

    setMessage(elementTarget.value);
  };

  const mutation = useMutation({
    mutationFn: sendPrivateChatMessage,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["conversation-messages", activeChatId] });
      const uniqeIdForRollback = uuId();

      const optimisticMsg = {
        _id: uniqeIdForRollback,
        conversation: uniqeIdForRollback.toString().slice(0, -1),
        sender: currentUser,
        message,
        receiver: uniqeIdForRollback.toString().slice(0, -3),
        createdAt: new Date().toLocaleString("en-US"),
        updatedAt: new Date().toLocaleString("en-US"),
        isRead: false,
        isSended: "PENDING",
      };
      addPendingPrivateMsgCache({ queryClient, activeChatId, optimisticMsg });

      setMessage("");
      inputRef.current?.focus();
      inputRef.current!.style.height = "auto";
      return { uniqeIdForRollback };
    },
    onSuccess: (data, _, context) => {
      addSuccessPrivateMsgCache({
        queryClient,
        activeChatId,
        data,
        uniqeIdForRollback: context.uniqeIdForRollback,
      });
      socket?.emit("private-message", { to: activeChatId, data: data });
    },
    onError: (error, _, context) => {
      if (context)
        addFailedPrivateMsgCache({
          queryClient,
          activeChatId,
          uniqeIdForRollback: context.uniqeIdForRollback,
        });
      dispatch(
        openToast({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    },
  });

  const sendPrivateMessageHandler = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (message.trim() === "") {
      dispatch(
        openToast({
          type: "ERROR_GENERAL",
          message: "Enter a Message",
        }),
      );
      return;
    }
    mutation.mutate({ message, receiver: activeChatId });
  };

  return (
    <form className="flex items-end gap-1 p-1">
      <textarea
        ref={inputRef}
        onChange={handleChange}
        value={message}
        rows={1}
        className="max-h-[250px] min-h-[32px] flex-1 resize-none overflow-auto rounded-sm bg-[#090b20] p-2 text-xs text-[#a0bb9d] outline-[#2bf70273] scrollbar-none placeholder:tracking-wide placeholder:text-[#ccadad] placeholder:opacity-30 focus:outline md:text-sm"
        placeholder="Enter a message"
      />
      <button
        className="flex h-[32px] w-[55px] items-center justify-center rounded-sm bg-[#3c3b72] md:h-[36px]"
        onClick={sendPrivateMessageHandler}
      >
        <IoMdSend className="text-xl" />
      </button>
    </form>
  );
};

export default SendMessagePrivateChat;
