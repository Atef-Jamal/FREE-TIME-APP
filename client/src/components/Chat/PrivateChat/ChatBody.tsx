import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import { TypeFrame, TypePrivateMessage, User } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { Skeleton, UserImage } from "../../../components";
import {
  setAllUnReadedMesseges,
  setRefetchUnReadedMessagesCount,
  showPopup,
} from "../../../context/StateManeger";

import PrivateMessageItem from "./PrivateMessageItem";
import { makeRequest } from "../../../utils";
// comment
const ChatBody = () => {
  const { currentUser, socet } = useAppSelector(
    (state) => state.stateManeger
  );
  const { id } = useParams();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<TypePrivateMessage[]>([]);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [conversationReaded, setConversationReaded] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const body = {
    messageText: message,
  };

  const sendMessage = async () => {
    if (message.trim() === "") {
      dispatch(showPopup({ status: true, message: "Enter a Message" }));
      return;
    }
    try {
      const response = await makeRequest.post(
        `api/conversations/${id}`,
        body,
      );
      setMessage("");
      setMessages((prev) => [...prev, response.data]);
      socet?.emit("private-message", { reciever: id, data: response.data });
      if (conversationReaded === true) setConversationReaded(false);
    } catch (error) {
      console.log(error);
      dispatch(showPopup({ status: true, message: "somthing went wrong" }));
    }
  };

  useEffect(() => {
    const scrollToElement = () => {
      lastMessageRef.current?.scrollIntoView(false);
    };
    scrollToElement();
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      if (currentUser && id) {
        try {
          setError("");
          setLoading(true);
          const fetchedUser = await makeRequest.get(
            `api/users/${id}`,
          );
          const response = await makeRequest.get(
            `api/conversations/${id}`,
          );
          setUser(fetchedUser.data);
          setMessages(response.data.messages);
        } catch (error) {
          console.log(error);
          setError("somthing went wrong");
        } finally {
          setLoading(false);
        }
      }
    };
    getMessages();
  }, [id]);

  useEffect(() => {
    const getMyLastMessage = messages.filter((item) => {
      return item.sender._id === currentUser?._id;
    });
    const lastOne = getMyLastMessage[getMyLastMessage.length - 1];
    if (lastOne?.isRead === true) {
      if (conversationReaded === false) setConversationReaded(true);
    }
  }, [messages]);

  const handleMessage = (data: TypePrivateMessage) => {
    if (data.sender._id === id) {
      setMessages((prev) => [...prev, data]);
    }
  };

  useEffect(() => {
    if (socet) {
      socet.on("private-message", handleMessage);
      return () => {
        socet.off("private-message", handleMessage);
      };
    }
  }, [socet, id]);

  const handleConversationReaded = (data: {
    reciever: string;
    sender: string;
  }) => {
    if (data.sender === id) {
      setConversationReaded(true);
    }
  };

  useEffect(() => {
    if (socet) {
      socet.on("conversation-readed", handleConversationReaded);
      return () => {
        socet.off("conversation-readed", handleConversationReaded);
      };
    }
  }, [socet, id]);

  useEffect(() => {
    const markAsReaded = async () => {
      if (!id) {
        return;
      }
      try {
        const response = await makeRequest.patch(
          `api/conversations/${id}`,
          { FOR_CONSISTENCY: "FOR_CONSISTENCY" },
        );
        if (response.status === 200) {
          socet?.emit("conversation-readed", {
            reciever: id,
            sender: currentUser?._id,
          });
          dispatch(setRefetchUnReadedMessagesCount(id));
          dispatch(setAllUnReadedMesseges({ type: "REMOVE", userId: id }));
        }
      } catch (error) {
        console.log(error);
      }
    };
    markAsReaded();
  }, [messages, id]);

  const handleAddPhotoFrame = (data: {
    belongsTo: string;
    frameObj: TypeFrame;
  }) => {
    if (user && data.belongsTo === user._id) {
      setUser(
        (prevUser) => ({ ...prevUser, activeFrame: data.frameObj } as User)
      );
    }
  };

  useEffect(() => {
    if (socet) {
      socet.on("user-photo-frame-changed", handleAddPhotoFrame);
      // return () => {
      //   socet.off("user-photo-frame-changed", handleAddPhotoFrame);
      // };
    }
  }, [socet]);

  return loading ? (
    <LoadingChatBody />
  ) : (
    <>
      {error && <div className="w-full h-full">error: {error}</div>}
      {!error && user && (
        <div className="w-full flex flex-col items-center h-full gap-2 pb-3">
          <div className="flex items-center gap-4 w-full justify-center bg-[#1f1f2e9a] py-2 border border-gray-700">
            <div className="w-[40px] h-[35px] sm:w-[30px] sm:h-[25px]">
              <UserImage user={user} />
            </div>
            <span className="text-sm text-[#62e66d] font-[900]">
              {user.name}
            </span>
          </div>

          <div className="flex flex-col items-center w-full h-full gap-2 overflow-scroll scrollbar-none p-1 pb-2 ">
            {messages &&
              messages.length > 0 &&
              messages.map((msg, index) => (
                <PrivateMessageItem
                  key={msg._id}
                  messages={messages}
                  message={msg}
                  index={index}
                  lastMessageRef={lastMessageRef}
                  conversationReaded={conversationReaded}
                />
              ))}
          </div>
          <div className="w-full flex items-center gap-3 sm:gap-2 ">
            <input
              onBlur={(e) => {
                if (
                  e.relatedTarget ===
                  document.getElementById("private-chat-send-button")
                ) {
                  e.target.focus();
                }
              }}
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              name="message"
              className="outline-none rounded-md w-full py-3 px-4  placeholder:opacity-30 placeholder:text-[#a39595] bg-[#090b20] text-[#95ff8b] placeholder:tracking-wide sm:placeholder:text-sm sm:text-sm "
              placeholder="Enter a message"
            />
            <button
              id="private-chat-send-button"
              className="bg-[#3c3b72] rounded-md flex items-center justify-center sm:px-3 px-5 py-3"
              onClick={sendMessage}
            >
              <IoMdSend className="text-xl sm:text-md" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const LoadingChatBody = () => {
  return (
    <div className="w-full h-full flex flex-col items-center gap-2 pb-3">
      <div className="flex  gap-2 w-full justify-center bg-[#1f1f2e9a] py-2 border border-gray-700">
        <Skeleton className="w-10 h-10 " />
        <div className="mt-2">
          <Skeleton className="w-[150px] h-2 mb-1" />
          <Skeleton className="w-[90px] h-2" />
        </div>
      </div>
      <div className="flex flex-col items-center w-full h-[100%] gap-2 overflow-scroll scrollbar-none p-1 pb-2 ">
        {[...Array(5).keys()].map((ele) => (
          <div
            key={ele}
            className="bg-[#0b0b226c] w-full rounded-lg p-2 flex flex-col gap-1"
          >
            <div className="flex gap-2">
              <Skeleton className="w-9 h-9" />
              <div className="mt-1">
                <Skeleton className="w-[150px] h-2 mb-[6px] rounded-sm" />
                <Skeleton className="w-[150px] h-2 rounded-sm" />
              </div>
            </div>
            <div className="">
              <Skeleton className="w-[85%] h-2 mb-1" />
              <Skeleton className="w-[70%] h-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBody;
