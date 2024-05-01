import React, { useEffect, useState } from "react";
import { FcLock } from "react-icons/fc";
import { MdSend } from "react-icons/md";
import { showPopup } from "../../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import MentionListOfUsers from "./MentionListOfUsers";
import { handleApiError, makeRequest } from "../../../../utils";
import { BiErrorAlt } from "react-icons/bi";

interface typeProps {
  stopScrolling: boolean;
  setStopScrolling: React.Dispatch<React.SetStateAction<boolean>>;
}

const SendMessage = ({ stopScrolling, setStopScrolling }: typeProps) => {
  const { currentUser, socet } = useAppSelector((state) => state.stateManeger);
  const [loading, setLoading] = useState<boolean>(false);
  const [toggleMentionList, settoggleMentionList] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [user, setUser] = useState<{ _id: string; name: string } | null>(null);

  const dispatch = useAppDispatch();

  const body = {
    messageText: message,
    mentioned: user?._id,
    type: "MESSAGE",
  };

  const sendMessageHandler = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!currentUser) return;

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

    setLoading(true);
    if (stopScrolling) {
      setStopScrolling(false);
    }
    try {
      setMessage("");
      const response = await makeRequest.post("api/publicchat", body);
      socet?.emit("public-message", response.data);
      if (user) {
        setUser(null);
      }
    } catch (err) {
      dispatch(
        showPopup({
          status: true,
          message: handleApiError(err),
          icon: <BiErrorAlt />,
        })
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const func = () => {
      if (toggleMentionList) {
        settoggleMentionList((prev) => !prev);
      }
    };
    document.addEventListener("click", func);
    return () => {
      document.removeEventListener("click", func);
    };
  }, [toggleMentionList]);

  return (
    <div className="relative w-full h-[70px] bg-[#0a071670] flex items-center py-8">
      {!currentUser && (
        <div className="absolute w-full h-full left-0 flex items-center  justify-center gap-4 text-md text-[#68f14d] font-bold pr-4 ">
          <span className="py-1 px-2 rounded-md bg-[#05050a]">
            <FcLock className="text-xl" />
          </span>
          SIGN IN TO UNLOCK
        </div>
      )}
      {toggleMentionList && (
        <div
          id="mentionlist"
          className="absolute -top-[152px] left-2 w-[95%] h-[150px] border border-gray-500"
        >
          <MentionListOfUsers setUser={setUser} />
        </div>
      )}
      <form
        className={`${
          !currentUser ? " blur-sm" : ""
        } relative flex items-center gap-1 justify-between px-3 xs:px-1 w-full `}
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
            settoggleMentionList((prev) => !prev);
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

// const initializeMessage = (messageText: string) => {
//   const messagesDiv = document.getElementById("all-messages-div");
//   const created = document.createElement("div");
//   created.classList.add(
//     "w-full",
//     "h-[60px]",
//     "border",
//     "text-sm",
//     "text-gray-300",
//     "text-center"
//   );
//   created.textContent = messageText;
//   messagesDiv?.appendChild(created);
// };
