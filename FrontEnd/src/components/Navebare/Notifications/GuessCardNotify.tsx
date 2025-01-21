import { FcApproval } from "react-icons/fc";
import { setCurrentUser, showPopup } from "../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { useState } from "react";
import Spinner from "../../Others/Spinner";
import { handleApiError, formateDate, collectReward } from "../../../utils/common";
import { IGuessCardTaskNotify } from "../../../types/notificationTypes";

type IProps = Omit<IGuessCardTaskNotify, "type" | "isRead">;

const GuessCardNotify = ({ createdAt, _id, prize, isCollected }: IProps) => {
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
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const date = formateDate(createdAt);

  return (
    <div className="flex flex-col gap-y-1 rounded-md border border-gray-700 bg-[#1010308e] p-1 sm:gap-y-2 sm:p-2">
      <div className="flex items-center gap-x-2">
        <span className="flex h-6 w-8 items-center justify-center rounded-[4px] bg-[#7aec2e25]">
          <FcApproval className="text-xl" />
        </span>
        <h1 className="text-[#d67d54]">GAME</h1>
        <span className="ml-auto text-sm text-[#928888]">{date}</span>
      </div>
      <p className="w-full text-xs text-[#bbc6d1] sm:text-sm">
        Guess cards game successfully completed! and get
        <span className="mx-1 text-xs font-bold text-[#696cf3] sm:text-sm">{prize}</span>
        points as a Reward
      </p>

      {isRewardCollected && (
        <button className="ml-auto w-[100px] rounded-[4px] border border-gray-700 bg-[#1a1e33ee] py-0.5 text-sm sm:py-1">
          collected
        </button>
      )}
      {!isRewardCollected && (
        <button
          onClick={collect}
          className="ml-auto w-[100px] rounded-[4px] border border-gray-700 bg-[#01D676] py-0.5 text-sm text-white sm:py-1"
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

export default GuessCardNotify;
