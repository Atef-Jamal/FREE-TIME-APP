import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import PublicChat from "../Common/PublicChat";
import { setPublicMsgRedPoint } from "../../../../context/StateManeger";

const MobileChat = () => {
  const hiddenLiveStats = useAppSelector(
    (state) => state.stateManeger.hiddenLiveStats
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPublicMsgRedPoint(false));
  }, [dispatch]);

  return (
    <div
      style={{
        height: hiddenLiveStats
          ? `calc(100dvh - 120px)`
          : `calc(100dvh - 163px)`,
      }}
      className={`hidden sm:flex flex-col items-center fixed ${
        hiddenLiveStats ? "top-[55px]" : "top-[98px]"
      } w-full bg-[#202233]`}
    >
      <PublicChat />
    </div>
  );
};

export default MobileChat;
