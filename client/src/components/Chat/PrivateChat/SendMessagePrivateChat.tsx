import { IoMdSend } from "react-icons/io";
import { useAppDispatch } from "../../../context/Hooks";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { showPopup } from "../../../context/StateManeger";
import { BiErrorAlt } from "react-icons/bi";
import { handleApiError, makeRequest } from "../../../utils";
import { TypePrivateMessage } from "../../../types/privateChat";

const SendMessagePrivateChat = ({
  conversationReaded,
  setConversationReaded,
  setMessages,
}: {
  conversationReaded: boolean;
  setConversationReaded: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<TypePrivateMessage[]>>;
}) => {
  // const { socet } = useAppSelector((state) => state.stateManeger);
  const [message, setMessage] = useState<string>("");

  const dispatch = useAppDispatch();
  const { id } = useParams();

  const sendMessage = async () => {
    if (message.trim() === "") {
      dispatch(
        showPopup({
          status: true,
          message: "Enter a Message",
          icon: <BiErrorAlt />,
        })
      );
      return;
    }
    try {
      const response = await makeRequest.post(`api/conversations/${id}`, {
        messageText: message,
      });
      setMessage("");
      setMessages((prev) => [...prev, response.data]);
      if (conversationReaded === true) setConversationReaded(false);
    } catch (error) {
      dispatch(
        showPopup({
          status: true,
          message: handleApiError(error),
          icon: <BiErrorAlt />,
        })
      );
    }
  };

  return (
    <div className="w-full flex items-center gap-3 sm:gap-1">
      <input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
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
