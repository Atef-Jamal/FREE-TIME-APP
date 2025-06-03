import { useEffect } from "react";
import { selectHidenLiveStats, setPublicMsgRedPoint } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import PublicChatBody from "./PublicChatBody";

const PublicChatMobile = () => {
  const hideLiveStats = useAppSelector(selectHidenLiveStats);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPublicMsgRedPoint(false));
  }, [dispatch]);

  return (
    <div
      style={{
        height: hideLiveStats ? `calc(100dvh - 115px)` : `calc(100dvh - 155px)`,
      }}
      className={"bg-[#202233] lg:hidden"}
    >
      <PublicChatBody />
    </div>
  );
};

export default PublicChatMobile;
