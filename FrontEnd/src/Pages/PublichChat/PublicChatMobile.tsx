import { useEffect } from "react";
import { setPublicMsgRedPoint } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import PublicChatBody from "./PublicChatBody";

const PublicChatMobile = () => {
  const hiddenLiveStats = useAppSelector((state) => state.appState.hiddenLiveStats);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPublicMsgRedPoint(false));
  }, [dispatch]);

  return (
    <div
      style={{
        height: hiddenLiveStats ? `calc(100dvh - 115px)` : `calc(100dvh - 155px)`,
      }}
      className={"bg-[#202233] lg:hidden"}
    >
      <PublicChatBody />
    </div>
  );
};

export default PublicChatMobile;
