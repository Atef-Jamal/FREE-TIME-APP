import { useEffect, useState } from "react";
import { useAppSelector } from "../context/Hooks";
import Welcome from "../components/Chats/PrivateChat/Welcome";
import Spinner from "../components/Others/Spinner";
import ChatSidbare from "../components/Chats/PrivateChat/ChatSidbare";
import ChatBody from "../components/Chats/PrivateChat/ChatBody";
import { User } from "../types/userTypes";
import {
  TypeConversation,
  TypePrivateMessage,
} from "../types/privateChatTypes";
import { useListenToSocketEvents } from "../hooks";
import { makeRequest } from "../utils";
import { useSearchParams } from "react-router-dom";
import { handleApiError } from "../utils/common";
import messageSoundSrc from "../assets/images/messageSound.mp3";

const PrivateChat = () => {
  const {
    currentUser,
    currentAccountRequestFullfiled,
    onlineUsers,
    hiddenLiveStats,
  } = useAppSelector((state) => state.stateManeger);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openSidbare, setOpenSidbare] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [conversations, setConversations] = useState<TypeConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );

  const messageSound = new Audio();
  messageSound.src = messageSoundSrc;

  const secondPartyId = searchParams.get("chat-with");

  const toggleSidbare = () => {
    setOpenSidbare((prev) => !prev);
  };

  const handleOpenSidbare = () => {
    if (openSidbare) return;
    setOpenSidbare(true);
  };

  const handleAddNewUser = (newUser: User) => {
    setConversations((prev) => [
      ...prev,
      { secondParty: newUser, lastMessage: null, unreadedCount: 0 },
    ]);
  };

  const handleNewPrivateMessage = (data: TypePrivateMessage) => {
    if (activeConversation) {
      if (data.sender._id !== activeConversation) {
        messageSound.play();
      }
    }
    setConversations((prev) => {
      const newArry = prev.map((conv) => {
        if (data.sender._id === conv.secondParty._id) {
          const isChatWithUserOpen = data.sender._id === activeConversation;
          return {
            ...conv,
            lastMessage: data,
            unreadedCount: isChatWithUserOpen
              ? conv.unreadedCount
              : conv.unreadedCount + 1,
          };
        } else {
          return conv;
        }
      });
      newArry.sort((a, b) => {
        if (a.lastMessage?.createdAt && b.lastMessage?.createdAt) {
          if (a.lastMessage?.createdAt > b.lastMessage?.createdAt) {
            return -1;
          }
          if (a.lastMessage?.createdAt < b.lastMessage?.createdAt) {
            return 1;
          } else {
            return 0;
          }
        }
        if (
          onlineUsers.includes(a.secondParty._id) &&
          !onlineUsers.includes(b.secondParty._id)
        ) {
          return -1;
        }
        if (
          !onlineUsers.includes(a.secondParty._id) &&
          onlineUsers.includes(b.secondParty._id)
        ) {
          return 1;
        }
        return 0;
      });
      return newArry;
    });
  };

  useEffect(() => {
    const fetchAllConversations = async () => {
      setError(null);
      setLoading(true);
      try {
        const response = await makeRequest.get(
          "api/conversations/all-conversations/allusers"
        );

        const sorted = response.data.sort(
          (a: TypeConversation, b: TypeConversation) => {
            if (a.lastMessage?.createdAt && b.lastMessage?.createdAt) {
              if (a.lastMessage?.createdAt > b.lastMessage?.createdAt) {
                return -1;
              }
              if (a.lastMessage?.createdAt < b.lastMessage?.createdAt) {
                return 1;
              } else {
                return 0;
              }
            }
            if (
              onlineUsers.includes(a.secondParty._id) &&
              !onlineUsers.includes(b.secondParty._id)
            ) {
              return -1;
            }
            if (
              !onlineUsers.includes(a.secondParty._id) &&
              onlineUsers.includes(b.secondParty._id)
            ) {
              return 1;
            }
            return 0;
          }
        );
        setConversations(sorted);
      } catch (error) {
        setError(handleApiError(error));
      } finally {
        setLoading(false);
      }
    };
    fetchAllConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  useEffect(() => {
    if (secondPartyId && secondPartyId !== currentUser?._id) {
      setActiveConversation(secondPartyId);
      localStorage.setItem("active-converstaion", secondPartyId);
      setSearchParams((prev) => {
        prev.delete("chat-with");
        return prev;
      });
    } else {
      const savedSecondPartyId = localStorage.getItem("active-converstaion");
      if (savedSecondPartyId && savedSecondPartyId !== currentUser?._id) {
        setActiveConversation(savedSecondPartyId);
      }
    }
  }, [secondPartyId, currentUser?._id, setSearchParams]);

  useListenToSocketEvents({
    eventsToListen: ["new-user-joined", "private-message"],
    handlers: [handleAddNewUser, handleNewPrivateMessage],
    dependencies: [activeConversation],
  });

  if (!currentAccountRequestFullfiled) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="w-12 h-12 border-3" />
      </div>
    );
  }
  if (!currentUser) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Sign In First
      </div>
    );
  }

  return (
    <div
      style={{
        height: hiddenLiveStats
          ? window.innerWidth <= 867
            ? `calc(100dvh - 120px)`
            : "calc(100dvh - 70px)"
          : window.innerWidth <= 867
          ? `calc(100dvh - 161px)`
          : "calc(100dvh - 133px)",
      }}
      className="w-full h-full flex items-center justify-center bg-[#202338]"
    >
      <div className="w-full relative flex items-center h-full">
        <div
          className={`transition-all lg:absolute top-0 left-0 w-[350px] sm:w-[250px] h-full z-[1] ${
            openSidbare ? "lg:translate-x-[0%]" : "lg:-translate-x-[100%]"
          }`}
        >
          <ChatSidbare
            toggleSidbare={toggleSidbare}
            conversations={conversations}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
            loading={loading}
            error={error}
            setRefetch={setRefetch}
          />
        </div>
        <div className="h-full flex-1 max-w-[800px] mx-auto">
          {activeConversation ? (
            <ChatBody
              setConversations={setConversations}
              activeConversation={activeConversation}
            />
          ) : (
            <Welcome handleOpenSidbare={handleOpenSidbare} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
