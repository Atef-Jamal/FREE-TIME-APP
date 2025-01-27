import { memo, useCallback, useEffect, useMemo } from "react";
import { BsChatLeftText } from "react-icons/bs";
import { cn } from "../../utilities";
import { setPublicMsgRedPoint, updateThisEntity } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { useListenToSocketEvents } from "../../hooks/useListenToSocketEvents";
import ChatHeader from "./ChatHeader";
import PublicChatBody from "./PublicChatBody";

const DisktopChat = memo(() => {
  const isChatOpen = useAppSelector((state) => state.appState.isChatOpen);
  const publicMsgRedPoint = useAppSelector((state) => state.appState.publicMsgRedPoint);
  const dispatch = useAppDispatch();

  const handleRecievedMessage = useCallback(() => {
    if (!isChatOpen) dispatch(setPublicMsgRedPoint(true));
  }, [isChatOpen, dispatch]);

  const events = useMemo(() => ["public-message"], []);
  const handlers = useMemo(() => [handleRecievedMessage], [handleRecievedMessage]);

  useListenToSocketEvents({
    eventsToListen: events,
    handlers: handlers,
  });

  useEffect(() => {
    // initiallly open chat if user comes with url searchParam containing messageID
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
        className="absolute -left-[42px] top-[47px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm bg-[#513d80f8]"
      >
        {publicMsgRedPoint && <span className="absolute left-3 top-2 h-4 w-4 rounded-full bg-red-500"></span>}
        <BsChatLeftText className="text-3xl" />
      </span>
      <ChatHeader />
      <div className="flex-1 overflow-hidden">
        <PublicChatBody />
      </div>
    </div>
  );
});

export default DisktopChat;
