import { IoMdSend } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { showPopup } from "../../../context/StateManeger";
import { makeRequest } from "../../../utils";
import { handleApiError } from "../../../utils/common";

import { TypePrivateMessage } from "../../../types/privateChatTypes";

const SendMessagePrivateChat = ({
  conversationReaded,
  setConversationReaded,
  setMessages,
}: {
  conversationReaded: boolean;
  setConversationReaded: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<TypePrivateMessage[]>>;
}) => {
  const { currentUser, socket } = useAppSelector((state) => state.stateManeger);
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const sendMessage = async () => {
    if (message.trim() === "") {
      dispatch(
        showPopup({
          status: true,
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
      createdAt: new Date(),
      updatedAt: new Date(),
      isRead: false,
      isSended: "PENDING",
    };
    const event = new CustomEvent("immediatelyPrivateMessage", {
      detail: msg,
    });
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

      socket?.emit("private-message", { to: id, data: response.data });
      if (conversationReaded === true) setConversationReaded(false);
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
          status: true,
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
        className="ml-1 h-9 outline-none rounded-md grow p-2  placeholder:opacity-30 placeholder:text-[#a39595] bg-[#090b20] text-[#95ff8b] placeholder:tracking-wide sm:placeholder:text-sm sm:text-sm resize-none overflow-hidden"
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
