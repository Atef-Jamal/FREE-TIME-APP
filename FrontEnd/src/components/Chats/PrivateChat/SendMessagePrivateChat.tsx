import { IoMdSend } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import {
  useState,
  useRef,
  SetStateAction,
  ChangeEvent,
  FormEvent,
} from "react";
import { showPopup } from "../../../context/StateManeger";
import { makeRequest } from "../../../utils";
import { handleApiError } from "../../../utils/common";

import {
  TypeConversation,
  TypePrivateMessage,
} from "../../../types/privateChatTypes";

interface TypeProps {
  id: string;
  setConversations: React.Dispatch<SetStateAction<TypeConversation[]>>;
  conversationReaded: boolean;
  setConversationReaded: React.Dispatch<SetStateAction<boolean>>;
  setMessages: React.Dispatch<SetStateAction<TypePrivateMessage[]>>;
}

const SendMessagePrivateChat = ({
  conversationReaded,
  setConversationReaded,
  setMessages,
  id,
  setConversations,
}: TypeProps) => {
  const { currentUser, socket } = useAppSelector((state) => state.stateManeger);
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const contentText = event.target;

    inputRef.current!.style.height = "auto";
    inputRef.current!.style.height = `${contentText.scrollHeight}px`;

    setMessage(contentText.value);
  };

  const sendMessage = async (event: FormEvent<HTMLButtonElement>) => {
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

    const uniqeIdForRollback = (
      Math.random() * 1000000 +
      Date.now() +
      Date.now()
    ).toString();
    const msg = {
      _id: uniqeIdForRollback,
      sender: currentUser,
      message,
      createdAt: new Date().toLocaleString("en-US"),
      updatedAt: new Date().toLocaleString("en-US"),
      isRead: false,
      isSended: "PENDING",
    };
    const customEvent = new CustomEvent("immediatelyPrivateMessage", {
      detail: { message: msg, recieverId: id },
    });
    if (conversationReaded === true) setConversationReaded(false);
    document.dispatchEvent(customEvent);
    setMessage("");
    inputRef.current?.focus();
    inputRef.current!.style.height = "auto";
    try {
      const response = await makeRequest.post(`api/conversations/${id}`, {
        messageText: message,
      });
      setMessages((prev) => {
        return prev
          .filter((item) => item._id !== uniqeIdForRollback)
          .concat([{ ...response.data, isSended: "SUCCESS" }]);
      });
      setConversations((prev) => {
        return prev.map((conv) => {
          if (conv.secondParty._id === id) {
            return { ...conv, lastMessage: response.data };
          } else {
            return conv;
          }
        });
      });

      socket?.emit("private-message", { to: id, data: response.data });
    } catch (error) {
      setMessages((prev) => {
        return prev.map((item) => {
          if (item._id === uniqeIdForRollback) {
            item.isSended = "FAILED";
            return item;
          }
          return item;
        });
      });
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    }
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
        onClick={sendMessage}
      >
        <IoMdSend className="text-2xl sm:text-[22px]" />
      </button>
    </form>
  );
};

export default SendMessagePrivateChat;
