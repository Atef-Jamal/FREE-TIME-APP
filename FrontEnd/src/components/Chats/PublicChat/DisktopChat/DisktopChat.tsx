import { setPublicMsgRedPoint, updateThisEntity } from "../../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import ChatHeader from "../Common/ChatHeader";
import PublicChat from "../Common/PublicChat";
import { BsChatLeftText } from "react-icons/bs";
import { memo, useEffect } from "react";
import { useListenToSocketEvents } from "../../../../hooks";
import { cn } from "../../../../utils/common";

const DisktopChat = memo(() => {
  const isChatOpen = useAppSelector((state) => state.stateManeger.isChatOpen);
  const publicMsgRedPoint = useAppSelector((state) => state.stateManeger.publicMsgRedPoint);
  const dispatch = useAppDispatch();

  const handleRecievedMessage = () => {
    if (!isChatOpen) dispatch(setPublicMsgRedPoint(true));
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (location.search.includes("messageId"))
        if (!isChatOpen) dispatch(updateThisEntity({ entity: "isChatOpen", value: true }));
    }, 1000);
    return () => clearTimeout(timeOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (isChatOpen) {
      dispatch(setPublicMsgRedPoint(false));
    }
  }, [isChatOpen, dispatch]);

  useListenToSocketEvents({
    eventsToListen: ["public-message"],
    handlers: [handleRecievedMessage],
  });

  return (
    <div
      style={{
        height: `calc(100dvh - 55px)`,
      }}
      className={cn(
        "fixed right-0 top-[55px] z-[4] hidden w-[35%] max-w-[500px] flex-col border-l border-[#8a5f5f] bg-[#202138] transition-all duration-300 ease-in-out lg:flex",
        !isChatOpen && "translate-x-[100%]",
      )}
    >
      <span
        onClick={() => {
          dispatch(updateThisEntity({ entity: "isChatOpen", value: !isChatOpen }));
          localStorage.setItem("isDesktopChatOpen", isChatOpen ? "" : "open");
        }}
        className="absolute -left-[42px] top-[7%] flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm bg-[#513d80f8]"
      >
        {publicMsgRedPoint && <span className="absolute left-3 top-2 h-4 w-4 rounded-full bg-red-500"></span>}
        <BsChatLeftText className="text-3xl" />
      </span>
      <ChatHeader />
      <div className="flex-1 overflow-hidden">
        <PublicChat />
      </div>
    </div>
  );
});

export default DisktopChat;
