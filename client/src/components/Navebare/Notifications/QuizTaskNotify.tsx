import { lazy, useState } from "react";
import { GoCheckCircleFill } from "react-icons/go";
import { BsExclamationOctagonFill } from "react-icons/bs";
import { FcApproval } from "react-icons/fc";
import { setCurrentUser, showPopup } from "../../../context/StateManeger";
import {
  collectReward,
  timeAgoFromMongoDBDate,
} from "../../../context/functions";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { TypeQuizAppNotify } from "../../../types";
const Spinner = lazy(() => import("../../Others/Spinner"));

type PropsType = Omit<TypeQuizAppNotify, "isRead" | "type">;

const QuizTaskNotify = ({ _id, createdAt, prize, isCollected }: PropsType) => {
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
          status: true,
          message: "collected successfully ",
          icon: <GoCheckCircleFill />,
        })
      );
    } catch (error) {
      console.log(error);
      dispatch(
        showPopup({
          status: true,
          message: "Failed to Collect ",
          icon: <BsExclamationOctagonFill />,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const date = timeAgoFromMongoDBDate(createdAt.toString());

  return (
    <div className="w-full flex flex-col items-center gap-2 bg-[#1010308e] rounded-md p-2 border border-gray-700 ">
      <div className="flex gap-2 w-full">
        <span className="w-8 h-6 rounded-lg bg-[#7aec2e25] flex items-center justify-center">
          <FcApproval className=" text-xl" />
        </span>
        <h1 className="text-[#d67d54]">QUIZ APP</h1>
        <span className="text-sm ml-auto text-[#7c7a7a] pr-1">{date}</span>
      </div>
      <p className="text-sm w-full text-[#bbc6d1]">
        quiz app successfully completed! and get
        <span className="text-sm text-[#696cf3] mx-1 font-bold">{prize}</span>
        points as a Reward
      </p>

      {isRewardCollected && (
        <button className="text-sm bg-[#1a1e33ee] w-[100px] py-1 rounded-md border border-gray-700  ml-auto">
          collected
        </button>
      )}
      {!isRewardCollected && (
        <button
          onClick={collect}
          className="text-sm bg-[#53ec68ee] w-[100px] py-1 rounded-md border border-gray-700 ml-auto"
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

export default QuizTaskNotify;
