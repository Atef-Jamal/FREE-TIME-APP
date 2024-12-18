import { toggleThisEntity } from "../../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import ChatHeader from "../Common/ChatHeader";
import PublicChat from "../Common/PublicChat";
import { BsChatLeftText } from "react-icons/bs";
import { memo } from "react";

const DisktopChat = memo(() => {
  const isChatOpen = useAppSelector((state) => state.stateManeger.isChatOpen);
  const dispatch = useAppDispatch();

  return (
    <div className="relative flex flex-col items-center bg-[#241f31c0] h-full w-full">
      <span
        onClick={() => {
          dispatch(toggleThisEntity({ entity: "isChatOpen" }));
          localStorage.setItem("isDesktopChatOpen", !isChatOpen ? "open" : "");
        }}
        className="w-10 h-10 absolute top-[7%] -left-[42px] bg-[#513d80f8] rounded-sm flex items-center justify-center cursor-pointer"
      >
        <BsChatLeftText className="text-3xl" />
      </span>
      <ChatHeader />
      <PublicChat />
    </div>
  );
});

export default DisktopChat;
