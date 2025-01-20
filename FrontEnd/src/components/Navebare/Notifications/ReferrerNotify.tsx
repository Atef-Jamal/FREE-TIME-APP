import { useState } from "react";
import { setCurrentUser, showPopup } from "../../../context/StateManeger";
import { FcConferenceCall } from "react-icons/fc";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { Link } from "react-router-dom";
import Spinner from "../../Others/Spinner";
import { handleApiError, formateDate, collectReward } from "../../../utils/common";
import { IReferrerNotify } from "../../../types/notificationTypes";

type IProps = Omit<IReferrerNotify, "isRead" | "type">;

const ReferrerNotify = ({ createdAt, _id, prize, isCollected, referredUser }: IProps) => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const [isRewardCollected, setIsRewadCollected] = useState(isCollected);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  if (!currentUser) return;

  const collect = async () => {
    setIsLoading(true);
    try {
      const response = await collectReward(_id);
      setIsRewadCollected(response.isCollected);
      const updatedUser = {
        ...currentUser,
        points: currentUser.points + response.prize,
      };
      dispatch(setCurrentUser(updatedUser));
      socket?.emit("user-updated", updatedUser);
      dispatch(
        showPopup({
          message: "collected successfully ",
          type: "SUCESS",
        }),
      );
    } catch (error) {
      dispatch(
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };
  const date = formateDate(createdAt);

  return (
    <div className="xs:gap-1 xs:p-1 flex w-full flex-col items-center gap-2 rounded-md border border-gray-700 bg-[#1010308e] p-2">
      <div className="flex w-full gap-2">
        <span className="flex h-6 w-8 items-center justify-center rounded-lg bg-[#7aec2e25]">
          <FcConferenceCall className="text-xl" />
        </span>
        <h1 className="text-[#d67d54]">REFERRER</h1>
        <span className="ml-auto pr-1 text-xs text-[#9b9090]">{date}</span>
      </div>
      <p className="w-full text-sm text-[#bbc6d1] sm:text-xs">
        successfully Reffered Your Friend
        <Link to={`/user/${referredUser._id}`} className="mx-1 text-sm text-[#696cf3] underline">
          {referredUser.name}
        </Link>
        and Get {prize} points as a Reward
      </p>
      {isRewardCollected && (
        <button className="xs:py-[3px] ml-auto w-[100px] rounded-md border border-gray-700 bg-[#1a1e33ee] py-1 text-sm">
          collected
        </button>
      )}
      {!isRewardCollected && (
        <button
          onClick={collect}
          disabled={isLoading}
          className="xs:py-[3px] ml-auto w-[100px] rounded-md border border-gray-700 bg-[#01D676] py-1 text-sm text-white"
        >
          {isLoading ? (
            <Spinner className="mx-auto h-5 w-5 border-b-[#291a3b] border-l-[#291a3b]" />
          ) : (
            "collect"
          )}
        </button>
      )}
    </div>
  );
};

export default ReferrerNotify;
