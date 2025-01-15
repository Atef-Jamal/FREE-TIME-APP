import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import PublicChat from "../components/Chats/PublicChat/Common/PublicChat";
import { setPublicMsgRedPoint } from "../context/StateManeger";

const PublicChatMobile = () => {
  const hiddenLiveStats = useAppSelector((state) => state.stateManeger.hiddenLiveStats);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPublicMsgRedPoint(false));
  }, [dispatch]);

  return (
    <div
      style={{
        height: hiddenLiveStats ? `calc(100vh - 118px)` : `calc(100vh - 158px)`,
      }}
      className={`bg-[#202233] lg:hidden`}
    >
      <PublicChat />
    </div>
  );
};

export default PublicChatMobile;
