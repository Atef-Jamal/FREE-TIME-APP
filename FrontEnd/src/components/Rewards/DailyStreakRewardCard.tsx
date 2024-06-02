import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { makeRequest } from "../../utils";
import Spinner from "../Others/Spinner";
import { setCurrentUser, showPopup } from "../../context/StateManeger";
import { handleApiError } from "../../utils/common";
import { BsClockHistory } from "react-icons/bs";
import Timer from "./Timer";

interface TypeProps {
  dayInfo: {
    day: number;
    availableAt: Date;
    reward: number;
    isCollected: boolean;
  };
}
const DailyStreakRewardCard = ({ dayInfo }: TypeProps) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const today = new Date();
  let isTimerHere;

  const nearstNexttDay = currentUser?.dailyReward.find(
    (item) => new Date(item.availableAt) > today
  );
  if (nearstNexttDay?.availableAt === dayInfo.availableAt) {
    isTimerHere = true;
  }

  const collectDailyReward = async () => {
    if (!currentUser) {
      dispatch(showPopup({ type: "ERROR_LOCK", message: "Log in First" }));
      return;
    }
    try {
      setIsLoading(true);
      const response = await makeRequest.post(
        `api/rewards/daily-reward/collect`,
        { day: dayInfo.day }
      );
      dispatch(
        setCurrentUser({
          ...currentUser,
          points: response.data.points,
          dailyReward: response.data.dailyReward,
          week: response.data.week,
        })
      );
    } catch (error) {
      console.log(error);
      dispatch(
        showPopup({ message: handleApiError(error), type: "ERROR_GENERAL" })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative p-2 flex flex-col items-center justify-center gap-3 bg-[#122641c4] rounded-md">
      <div className="flex items-center justify-center w-full gap-3">
        <BsClockHistory className="text-4xl" />
        <span className="text-[#c9c6c6] text-xl sm:text-lg font-bold">
          Day {dayInfo.day}
        </span>
      </div>
      <div className="w-full flex items-center justify-center flex-wrap gap-3 text-[#aec94f] text-xl xl:text-base font-bold ">
        Reward : <span className="text-[#aec94f]">{dayInfo.reward}</span>
      </div>
      {dayInfo.isCollected ? (
        <button className="w-full py-1 bg-[#170e27]  font-bold rounded-md">
          Collected
        </button>
      ) : undefined}
      {!dayInfo.isCollected && new Date(dayInfo.availableAt) <= today ? (
        <button
          onClick={collectDailyReward}
          className="w-full py-1 bg-[#37d132]  font-bold rounded-md"
        >
          {isLoading ? (
            <Spinner className="mx-auto w-6 h-6 border-b-blue-950 border-r-blue-950" />
          ) : (
            "Collect"
          )}
        </button>
      ) : undefined}
      {new Date(dayInfo.availableAt) > today ? (
        <button className="w-full py-1 bg-[#205764] font-bold rounded-md">
          {isTimerHere ? (
            <Timer date={new Date(dayInfo.availableAt)} />
          ) : (
            "Next"
          )}
        </button>
      ) : undefined}
    </div>
  );
};

export default DailyStreakRewardCard;
