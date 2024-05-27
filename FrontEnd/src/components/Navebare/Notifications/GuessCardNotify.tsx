import { FcApproval } from "react-icons/fc";
import { setCurrentUser, showPopup } from "../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { useState } from "react";
import Spinner from "../../Others/Spinner";
import {
  handleApiError,
  formateDate,
  collectReward,
} from "../../../utils/common";
import { TypeGuessCardNotify } from "../../../types/notificationTypes";

type PropType = Omit<TypeGuessCardNotify, "type" | "isRead">;

const GuessCardNotify = ({ createdAt, _id, prize, isCollected }: PropType) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [isRewardCollected, setIsRewadCollected] = useState(isCollected);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  if (!currentUser) return;

  const collect = async () => {
    setIsLoading(true);
    try {
      const response = await collectReward(_id);
      setIsRewadCollected(response.isCollected);
      dispatch(
        setCurrentUser({
          ...currentUser,
          points: currentUser.points + response.prize,
        })
      );
      dispatch(
        showPopup({
          message: "collected successfully ",
          type: "SUCESS",
        })
      );
    } catch (error) {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const date = formateDate(createdAt.toString());

  return (
    <div className="w-full flex flex-col items-center gap-2 xs:gap-1 bg-[#1010308e] rounded-md p-2 xs:p-1 border border-gray-700 ">
      <div className="flex gap-2 w-full">
        <span className="w-8 h-6 rounded-lg bg-[#7aec2e25] flex items-center justify-center">
          <FcApproval className=" text-xl" />
        </span>
        <h1 className="text-[#d67d54]">GAME</h1>
        <span className="text-sm ml-auto text-[#7c7a7a] pr-1">{date}</span>
      </div>
      <p className="text-sm w-full text-[#bbc6d1]">
        Guess cards game successfully completed! and get
        <span className="text-sm text-[#696cf3] mx-1 font-bold">{prize}</span>
        points as a Reward
      </p>

      {isRewardCollected && (
        <button className="text-sm bg-[#1a1e33ee] w-[100px] py-1 xs:py-[3px] rounded-md border border-gray-700  ml-auto">
          collected
        </button>
      )}
      {!isRewardCollected && (
        <button
          onClick={collect}
          className="text-sm bg-[#53ec68ee] w-[100px] py-1 xs:py-[3px] rounded-md border border-gray-700 ml-auto"
        >
          {isLoading ? (
            <Spinner className="w-5 h-5 mx-auto border-b-[#291a3b] border-l-[#291a3b]" />
          ) : (
            "collect"
          )}
        </button>
      )}
    </div>
  );
};

export default GuessCardNotify;
