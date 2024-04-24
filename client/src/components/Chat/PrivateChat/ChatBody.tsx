import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { TypeFrame, TypePrivateMessage, User } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import {
  setAllUnReadedMesseges,
  setRefetchUnReadedMessagesCount,
  showPopup,
} from "../../../context/StateManeger";
import { handleApiError, makeRequest } from "../../../utils";
import Spinner from "../../Others/Spinner";

import UserImage from "../../../components/Others/UserImage";
import PrivateMessageItem from "./PrivateMessageItem";
import { BiErrorAlt } from "react-icons/bi";
import SendMessagePrivateChat from "./SendMessagePrivateChat";

const ChatBody = () => {
  const { currentUser, socet, onlineUsers } = useAppSelector(
    (state) => state.stateManeger
  );
  const { id } = useParams();

  const [messages, setMessages] = useState<TypePrivateMessage[]>([]);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [conversationReaded, setConversationReaded] = useState<boolean>(false);
  const dispatch = useAppDispatch();

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
          const fetchedUser = await makeRequest.get(`api/users/${id}`);
          const response = await makeRequest.get(`api/conversations/${id}`);
          setUser(fetchedUser.data);
          setMessages(response.data.messages);
        } catch (error) {
          setError("somthing went wrong");
          dispatch(
            showPopup({
              status: true,
              message: handleApiError(error),
              icon: <BiErrorAlt />,
            })
          );
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
        const response = await makeRequest.patch(`api/conversations/${id}`, {
          FOR_CONSISTENCY: "FOR_CONSISTENCY",
        });
        if (response.status === 200) {
          socet?.emit("conversation-readed", {
            reciever: id,
            sender: currentUser?._id,
          });
          dispatch(setRefetchUnReadedMessagesCount(id));
          dispatch(setAllUnReadedMesseges({ type: "REMOVE", userId: id }));
        }
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
      return () => {
        socet.off("user-photo-frame-changed", handleAddPhotoFrame);
      };
    }
  }, [socet]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner className="w-7 h-7 border-[3px]" />
      </div>
    );
  }
  if (error) {
    return <div className="w-full h-full">error: {error}</div>;
  }

  if (!loading && !error) {
    return (
      <div className="w-full flex flex-col items-center h-full gap-1 pb-1 bg-[#332342]">
        <div className="flex items-center gap-4 sm:gap-2 w-full justify-center bg-[#1f1f2e9a]  border border-gray-700 py-2 xs:py-[2px]">
          <div className="w-[40px] h-[35px] sm:w-[30px] sm:h-[25px]">
            <UserImage user={user} />
          </div>
          <span className=" flex flex-col items-center ">
            <span className="text-sm text-[#62e66d] font-[900]">
              {user?.name}
            </span>
            <span className="sm:text-[9px] text-sm tracking-wider font-[200] xs:-mt-1 text-[#c5bbbb]">
              {onlineUsers.includes(id || "") ? "(online)" : "(offline)"}
            </span>
          </span>
        </div>

        <div className="flex flex-col items-center w-full gap-2 sm:gap-[3px] overflow-auto lg:scrollbar-thin grow">
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
        <div className="w-full">
          <SendMessagePrivateChat
            setConversationReaded={setConversationReaded}
            conversationReaded={conversationReaded}
            setMessages={setMessages}
          />
        </div>
      </div>
    );
  }
};

export default ChatBody;
