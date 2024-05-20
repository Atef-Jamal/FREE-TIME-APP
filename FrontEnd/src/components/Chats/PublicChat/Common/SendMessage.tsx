import React, { useRef, useState } from "react";
import { FcLock } from "react-icons/fc";
import { MdSend } from "react-icons/md";
import { showPopup } from "../../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import MentionListOfUsers from "./MentionListOfUsers";
import { makeRequest } from "../../../../utils";
import { handleApiError } from "../../../../utils/common";
import { useCloseMenuOnClickOutSide } from "../../../../hooks";
import { RiBaseStationLine } from "react-icons/ri";
import { TypePublicChatItem } from "../../../../types/publicChatTypes";

interface typeProps {
  stopScrolling: boolean;
  setStopScrolling: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<TypePublicChatItem[]>>;
}

const SendMessage = ({
  stopScrolling,
  setStopScrolling,
  setMessages,
}: typeProps) => {
  const { currentUser, socket, onlineUsers } = useAppSelector(
    (state) => state.stateManeger
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [openMentionList, setOpenMentionList] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [user, setUser] = useState<{ _id: string; name: string } | null>(null);
  const mentionListRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const sendMessageHandler = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!currentUser) return;

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
    setLoading(true);
    if (stopScrolling) {
      setStopScrolling(false);
    }
    const uniqeIdForRollback = (
      Math.random() * 1000000 +
      Date.now() +
      Date.now()
    ).toString();
    const event = new CustomEvent("iCreatePublicMessage", {
      detail: {
        _id: uniqeIdForRollback,
        sender: currentUser,
        type: "MESSAGE",
        message,
        loves: [],
        likes: [],
        dislikes: [],
        isDeleted: false,
        mentioned: user?.name || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isSent: false,
      },
    });
    document.dispatchEvent(event);
    setMessage("");
    try {
      const response = await makeRequest.post("api/publicchat", {
        type: "MESSAGE",
        messageText: message,
        mentioned: user?._id,
      });
      setMessages((prev) => {
        return prev
          .filter((item) => item._id !== uniqeIdForRollback)
          .concat([{ ...response.data, isSent: true }]);
      });
      console.log(response.data);
      socket?.emit("public-message", response.data);
      if (user) {
        setUser(null);
      }
    } catch (error) {
      dispatch(
        showPopup({
          status: true,
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useCloseMenuOnClickOutSide({
    menuRef: mentionListRef,
    onClose: () => {
      setOpenMentionList(false);
    },
  });

  return (
    <div className="relative w-full h-[67px] bg-[#0a071670] flex items-center">
      <span className="hidden sm:flex absolute top-1 left-4 text-xs text-[#a2a345]">
        <RiBaseStationLine className="opacity-70" />
        <span className="text-[#7ff349] mx-2">{onlineUsers.length}</span> Online
        Now
      </span>
      {!currentUser && (
        <div className="absolute w-full h-full left-0 flex items-center justify-center gap-4 text-md text-[#62f744] font-bold pr-4 ">
          <span className="py-1 px-2 rounded-md bg-[#000000]">
            <FcLock className="text-xl" />
          </span>
          SIGN IN TO UNLOCK
        </div>
      )}
      {openMentionList && (
        <div
          ref={mentionListRef}
          className="absolute -top-[152px] left-2 w-[95%] h-[150px] border border-gray-500"
        >
          <MentionListOfUsers
            setUser={setUser}
            setOpenMentionList={setOpenMentionList}
          />
        </div>
      )}
      <form
        className={`${
          !currentUser && " blur-sm"
        } relative flex items-center gap-1 justify-between px-3 xs:px-1 w-full mt-auto mb-2`}
      >
        <input
          name="send"
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          readOnly={!currentUser}
          value={message}
          placeholder={!currentUser ? "Sign Up First " : "Type Here.."}
          className={`${
            user ? "pl-[60px]" : "px-4 xs:px-2"
          } bg-[#2f3042a2] text-[#afc6e0] rounded-md border-none outline-none placeholder:text-gray-600 py-[6px] w-full `}
        />
        {user && (
          <span
            onClick={() => setUser(null)}
            className="absolute top-[5px] left-4 text-center xs:left-2 py-1 text-[11px] w-[50px] truncate bg-[#3c5db8e0] rounded-md px-[3px]"
          >
            {user.name}
          </span>
        )}
        <div
          id="mentionbutton"
          onClick={(e) => {
            e.stopPropagation();
            setOpenMentionList((prev) => !prev);
          }}
          className="relative py-[4px] px-3 rounded-md bg-[#542ba06e] "
        >
          <p className=" text-gray-400 font-bold text-lg">@</p>
        </div>
        <button
          id="sendbutton"
          type="submit"
          className="bg-[#217ebbf3] rounded-md w-12 h-9 flex items-center justify-center"
          onClick={sendMessageHandler}
          disabled={!currentUser || loading}
        >
          <MdSend />
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
