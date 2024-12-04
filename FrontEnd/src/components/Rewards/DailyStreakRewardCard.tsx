import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { makeRequest } from "../../utils";
import Spinner from "../Others/Spinner";
import { setCurrentUser, showPopup } from "../../context/StateManeger";
import { handleApiError } from "../../utils/common";
import { BsClockHistory } from "react-icons/bs";
import Timer from "./Timer";
import { useTranslation } from "react-i18next";

interface TypeProps {
  dayInfo: {
    day: number;
    availableAt: string;
    reward: number;
    isCollected: boolean;
  };
  dayWhichTimmerIsLocated: string | null;
  handleUpdateNextTimerDay: () => void;
}
const DailyStreakRewardCard = ({
  dayInfo,
  dayWhichTimmerIsLocated,
  handleUpdateNextTimerDay,
}: TypeProps) => {
  const { currentUser, socket } = useAppSelector((state) => state.stateManeger);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("rewards");
  const [, setRefresh] = useState(false);

  const dispatch = useAppDispatch();
  const today = new Date();

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
      const updatedUser = {
        ...currentUser,
        points: response.data.points,
        dailyReward: response.data.dailyReward,
        week: response.data.week,
      };
      dispatch(setCurrentUser(updatedUser));
      socket?.emit("user-updated", updatedUser);
      dispatch(
        showPopup({
          message: `successfully collect ${dayInfo.reward} points`,
          type: "SUCESS",
        })
      );
    } catch (error) {
      dispatch(
        showPopup({ message: handleApiError(error), type: "ERROR_GENERAL" })
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      dayWhichTimmerIsLocated &&
      dayWhichTimmerIsLocated > dayInfo.availableAt
    ) {
      const timmout = setTimeout(() => {
        setRefresh((prev) => !prev);
      }, 1000);
      return () => clearTimeout(timmout);
    }
  }, [dayWhichTimmerIsLocated]);

  const convertToDate = new Date(dayInfo.availableAt);

  const timeDifference = Math.abs((convertToDate as any) - (today as any));

  // Convert time difference from milliseconds to days
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const dayDifference = timeDifference / millisecondsPerDay;

  const scrollToThisCard =
    Math.ceil(dayDifference) === 1 ? "daily-reward" : undefined;

  return (
    <div
      id={scrollToThisCard}
      className="relative p-2 flex flex-col items-center justify-center gap-3 bg-[#242438] rounded-md"
    >
      <div className="flex items-center justify-center w-full gap-3">
        <BsClockHistory className="text-4xl" />
        <span className="text-[#c9c6c6] text-xl sm:text-lg font-bold">
          {t("Day")} {dayInfo.day}
        </span>
      </div>
      <div className="w-full flex items-center justify-center flex-wrap gap-3 text-[#aec94f] text-xl xl:text-base font-bold ">
        {t("Reward")} : <span className="text-[#aec94f]">{dayInfo.reward}</span>
      </div>
      {dayInfo.isCollected ? (
        <button className="w-full py-1 bg-[#170e27]  font-bold rounded-md">
          {t("Collected")}
        </button>
      ) : undefined}

      {!dayInfo.isCollected && new Date(dayInfo.availableAt) <= today ? (
        <button
          onClick={collectDailyReward}
          className="w-full py-1 bg-[#01d641]  font-bold rounded-md"
        >
          {isLoading ? (
            <Spinner className="mx-auto w-6 h-6 border-b-blue-950 border-r-blue-950" />
          ) : (
            t("Collect")
          )}
        </button>
      ) : undefined}

      {new Date(dayInfo.availableAt) > today ? (
        <button className="w-full h-[30px] bg-[#205764] font-bold rounded-md">
          {dayWhichTimmerIsLocated === dayInfo.availableAt ? (
            <Timer
              date={new Date(dayInfo.availableAt)}
              handleUpdateNextTimerDay={handleUpdateNextTimerDay}
            />
          ) : (
            t("Next")
          )}
        </button>
      ) : undefined}
    </div>
  );
};

export default DailyStreakRewardCard;
