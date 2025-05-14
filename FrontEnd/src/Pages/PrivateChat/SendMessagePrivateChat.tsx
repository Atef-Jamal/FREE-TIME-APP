import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuId } from "uuid";
import { IoMdSend } from "react-icons/io";
import { ICashedSingleConversation, ICashedConversations, IConversation } from "../../types/privateChatTypes";
import { openToast } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { sendPrivateChatMessage } from "../../services";
import { handleApiError } from "../../utilities";

interface IProps {
  activeChatWithUserId: string;
}

const SendMessagePrivateChat = ({ activeChatWithUserId }: IProps) => {
  const currentUser = useAppSelector((state) => state.appState.currentUser);
  const socket = useAppSelector((state) => state.appState.socket);
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
      await queryClient.cancelQueries({ queryKey: ["conversation-messages", activeChatWithUserId] });
      const uniqeIdForRollback = uuId();

      const optimisticMsg = {
        _id: uniqeIdForRollback,
        conversationId: uniqeIdForRollback.toString().slice(0, -1),
        sender: currentUser,
        message,
        receiver: uniqeIdForRollback.toString().slice(0, -3),
        createdAt: new Date().toLocaleString("en-US"),
        updatedAt: new Date().toLocaleString("en-US"),
        isRead: false,
        isSended: "PENDING",
      };

      queryClient.setQueryData(
        ["conversation-messages", activeChatWithUserId],
        (previous: ICashedSingleConversation): ICashedSingleConversation => {
          return {
            ...previous,
            pages: previous.pages.map((page, index) => {
              if (index === previous.pages.length - 1) {
                return { ...page, messages: [...page.messages, optimisticMsg as any] };
              }
              return page;
            }),
          };
        },
      );
      setMessage("");
      inputRef.current?.focus();
      inputRef.current!.style.height = "auto";
      return { uniqeIdForRollback };
    },
    onSuccess: (data, _, context) => {
      queryClient.setQueryData(
        ["conversation-messages", activeChatWithUserId],
        (previous: ICashedSingleConversation): ICashedSingleConversation | undefined => {
          if (!previous) return;
          return {
            ...previous,
            pages: previous.pages.map((page) => ({
              ...page,
              messages: page.messages.map((msg) => {
                if (msg._id === context.uniqeIdForRollback) {
                  return { ...data, isSended: "SUCCESS" };
                }
                return msg;
              }),
            })),
          };
        },
      );
      const allConversationPages: ICashedConversations | undefined = queryClient.getQueryData([
        "conversations",
      ]);
      const flatedConversations = allConversationPages?.pages.map((page) => page.conversations).flat();
      const isExists = flatedConversations?.some((conv) => conv.secondParty._id === data.receiver._id);
      if (!isExists) {
        queryClient.setQueryData(
          ["conversations"],
          (previous: ICashedConversations): ICashedConversations => {
            return {
              ...previous,
              pages: previous.pages.map((page, index) => {
                const lastPage = index === previous.pages.length - 1;
                if (lastPage) {
                  const newConversation: IConversation = {
                    _id: data.conversationId,
                    lastMessage: data,
                    secondParty: data.receiver,
                    unReadCount: 0,
                  };
                  return {
                    ...page,
                    conversations: [newConversation, ...page.conversations],
                  };
                }
                return page;
              }),
            };
          },
        );
      } else {
        queryClient.setQueryData(
          ["conversations"],
          (previous: ICashedConversations): ICashedConversations => {
            return {
              ...previous,
              pages: previous.pages.map((page) => {
                return {
                  ...page,
                  conversations: page.conversations.map((conv) => {
                    if (conv.secondParty._id === activeChatWithUserId) {
                      return { ...conv, lastMessage: data };
                    }
                    return conv;
                  }),
                };
              }),
            };
          },
        );
      }
      socket?.emit("private-message", { to: activeChatWithUserId, data: data });
    },
    onError: (error, _, context) => {
      if (context)
        queryClient.setQueryData(
          ["conversation-messages", activeChatWithUserId],
          (previous: ICashedSingleConversation): ICashedSingleConversation | undefined => {
            if (!previous) return;
            return {
              ...previous,
              pages: previous.pages.map((page) => ({
                ...page,
                messages: page.messages.map((msg) => {
                  if (msg._id === context.uniqeIdForRollback) {
                    return { ...msg, isSended: "FAILED" };
                  }
                  return msg;
                }),
              })),
            };
          },
        );
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
    mutation.mutate({ message, receiver: activeChatWithUserId });
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
