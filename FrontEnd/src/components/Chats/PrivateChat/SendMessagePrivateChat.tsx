import { IoMdSend } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { useState, useRef, SetStateAction } from "react";
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

  const sendMessage = async () => {
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
    const event = new CustomEvent("immediatelyPrivateMessage", {
      detail: { message: msg, recieverId: id },
    });
    if (conversationReaded === true) setConversationReaded(false);
    document.dispatchEvent(event);
    setMessage("");
    inputRef.current?.focus();
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
    <div className="w-full flex items-center gap-3 sm:gap-1">
      <textarea
        ref={inputRef}
        style={{ lineHeight: "1" }}
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        className="ml-1 h-11 sm:h-9 outline-none rounded-md grow p-2  placeholder:opacity-30 placeholder:text-[#a39595] bg-[#090b20] text-[#a0bb9d] placeholder:tracking-wide sm:placeholder:text-sm sm:text-sm resize-none overflow-hidden"
        placeholder="Enter a message"
      />
      <button
        id="private-chat-send-button"
        className="bg-[#3c3b72] rounded-md flex items-center justify-center sm:px-3 px-5 py-3 sm:py-2 mr-1"
        onClick={sendMessage}
      >
        <IoMdSend className="text-xl sm:text-md" />
      </button>
    </div>
  );
};

export default SendMessagePrivateChat;
