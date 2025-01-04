import { setPublicMsgRedPoint, updateThisEntity } from "../../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import ChatHeader from "../Common/ChatHeader";
import PublicChat from "../Common/PublicChat";
import { BsChatLeftText } from "react-icons/bs";
import { memo, useEffect } from "react";
import { useListenToSocketEvents } from "../../../../hooks";

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
    <div className="relative flex flex-col items-center bg-[#241f31c0] h-full w-full">
      <span
        onClick={() => {
          dispatch(updateThisEntity({ entity: "isChatOpen", value: !isChatOpen }));
          localStorage.setItem("isDesktopChatOpen", isChatOpen ? "" : "open");
        }}
        className="w-10 h-10 absolute top-[7%] -left-[42px] bg-[#513d80f8] rounded-sm flex items-center justify-center cursor-pointer"
      >
        {publicMsgRedPoint && <span className="absolute top-2 left-3 bg-red-500 w-4 h-4 rounded-full"></span>}
        <BsChatLeftText className="text-3xl" />
      </span>
      <ChatHeader />
      <PublicChat />
    </div>
  );
});

export default DisktopChat;
