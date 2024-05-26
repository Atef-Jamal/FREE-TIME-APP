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
import { useListenToSocketEvent } from "../hooks";
import { makeRequest } from "../utils";

const PrivateChat = () => {
  const { currentUser, currentAccountRequestFullfiled, hiddenLiveStats } =
    useAppSelector((state) => state.stateManeger);
  const [openSidbare, setOpenSidbare] = useState<boolean>(true);
  const [conversations, setConversations] = useState<TypeConversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<TypeConversation | null>(null);

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

  const handleUpdateUser = (updatedUser: User) => {
    setConversations((prev) => {
      const newArry = prev.map((conv) => {
        if (conv.secondParty._id === updatedUser._id) {
          return {
            secondParty: updatedUser,
            lastMessage: conv.lastMessage,
            unreadedCount: conv.unreadedCount,
          };
        } else {
          return conv;
        }
      });
      return newArry;
    });
    if (updatedUser._id === activeConversation?.secondParty?._id) {
      setActiveConversation({
        ...activeConversation,
        secondParty: updatedUser,
      });
    }
  };

  const handleNewPrivateMessage = (data: TypePrivateMessage) => {
    setConversations((prev) => {
      const newArry = prev.map((conv) => {
        if (data.sender._id === conv.secondParty._id) {
          const isChatWithUserOpen =
            data.sender._id === activeConversation?.secondParty?._id;
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
        return 0;
      });
      return newArry;
    });
  };

  useEffect(() => {
    const fetchAllConversations = async () => {
      try {
        const response = await makeRequest.get(
          "api/conversations/all-conversations/allusers"
        );
        const sorted = response.data.sort((a: any, b: any) => {
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
          return 0;
        });
        setConversations(sorted);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllConversations();
  }, []);

  useListenToSocketEvent<User>({
    eventToListen: "new-user-joined",
    onUpdate: handleAddNewUser,
  });

  useListenToSocketEvent<User>({
    eventToListen: "user-updated",
    onUpdate: handleUpdateUser,
  });

  useListenToSocketEvent<TypePrivateMessage>({
    eventToListen: "private-message",
    onUpdate: handleNewPrivateMessage,
    dependencies: [activeConversation?.secondParty?._id],
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
            ? `calc(100dvh - 131px)`
            : "calc(100dvh - 70px)"
          : window.innerWidth <= 867
          ? `calc(100dvh - 172px)`
          : "calc(100dvh - 133px)",
      }}
      className="w-full fixed bottom-0 h-full sm:bottom-[76px] flex items-center justify-center bg-[#202338]"
    >
      <div className="lg:w-full w-full relative flex items-center h-full overflow-hidden">
        <div
          className={`transition-all lg:absolute top-0 left-0 w-[350px] sm:w-[250px] h-full z-[1] ${
            openSidbare ? "lg:translate-x-[0%]" : "lg:-translate-x-[100%]"
          } `}
        >
          <ChatSidbare
            toggleSidbare={toggleSidbare}
            conversations={conversations}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
          />
        </div>
        <div className="h-full grow max-w-[800px] mx-auto">
          {activeConversation ? (
            <ChatBody
              setConversations={setConversations}
              activeConversation={activeConversation}
              setActiveConversation={setActiveConversation}
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
