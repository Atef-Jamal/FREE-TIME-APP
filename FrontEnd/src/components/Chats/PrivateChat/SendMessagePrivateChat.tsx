import { IoMdSend } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { useState } from "react";
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
    setMessage("");
    const uniqeIdForRollback = (
      Math.random() * 1000000 +
      Date.now() +
      Date.now()
    ).toString();
    const event = new CustomEvent("iCreatePrivatMessage", {
      detail: {
        _id: uniqeIdForRollback,
        sender: currentUser,
        message,
        createdAt: new Date(),
        updatedAt: new Date(),
        isRead: false,
        isSent: false,
      },
    });
    document.dispatchEvent(event);
    try {
      const response = await makeRequest.post(`api/conversations/${id}`, {
        messageText: message,
      });
      setMessages((prev) => {
        return prev
          .filter((item) => item._id !== uniqeIdForRollback)
          .concat([{ ...response.data, isSent: true }]);
      });

      socket?.emit("private-message", { to: id, data: response.data });
      if (conversationReaded === true) setConversationReaded(false);
    } catch (error) {
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
      <input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        autoFocus
        name="message"
        className="ml-1 outline-none rounded-md grow py-3 sm:py-2 px-4  placeholder:opacity-30 placeholder:text-[#a39595] bg-[#090b20] text-[#95ff8b] placeholder:tracking-wide sm:placeholder:text-sm sm:text-sm "
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
