import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { setCurrentUser, openToast, selectSocket, selectCurrentUser } from "../../context/appStateSlice";
import { axiosRequest, handleApiError } from "../../utilities";
import { BsClockHistory } from "react-icons/bs";
import Timer from "./Timer";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/Shared/Common/Spinner";

interface IProps {
  dayInfo: {
    day: number;
    availableAt: string;
    reward: number;
    isCollected: boolean;
  };
  dayWhichTimmerIsLocated: string | null;
  handleUpdateNextTimerDay: () => void;
}

const DailyStreakRewardCard = ({ dayInfo, dayWhichTimmerIsLocated, handleUpdateNextTimerDay }: IProps) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const socket = useAppSelector(selectSocket);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("rewards");
  const [, setRefresh] = useState(false);

  const dispatch = useAppDispatch();
  const today = new Date();

  const collectDailyReward = async () => {
    if (!currentUser) {
      dispatch(openToast({ type: "ERROR_LOCK", message: "Log in First" }));
      return;
    }
    try {
      setIsLoading(true);
      const response = await axiosRequest.post(`api/rewards/daily-reward/collect`, { day: dayInfo.day });
      const updatedUser = {
        ...currentUser,
        points: response.data.points,
        dailyReward: response.data.dailyReward,
        week: response.data.week,
      };
      dispatch(setCurrentUser(updatedUser));
      socket?.emit("user-updated", updatedUser);
      dispatch(
        openToast({
          message: `successfully collect ${dayInfo.reward} points`,
          type: "SUCESS",
        }),
      );
    } catch (error) {
      dispatch(openToast({ message: handleApiError(error), type: "ERROR_GENERAL" }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dayWhichTimmerIsLocated && dayWhichTimmerIsLocated > dayInfo.availableAt) {
      const timmout = setTimeout(() => {
        setRefresh((prev) => !prev);
      }, 1000);
      return () => clearTimeout(timmout);
    }
  }, [dayWhichTimmerIsLocated, dayInfo.availableAt]);

  const convertToDate = new Date(dayInfo.availableAt);

  const timeDifference = Math.abs(convertToDate.getTime() - today.getTime());

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const dayDifference = timeDifference / millisecondsPerDay;

  const scrollToThisCard = Math.ceil(dayDifference) === 1 ? "daily-reward" : undefined;

  return (
    <div
      id={scrollToThisCard}
      className="relative flex flex-col items-center justify-center gap-3 rounded-md bg-[#242438] p-2"
    >
      <div className="flex w-full items-center justify-center gap-3">
        <BsClockHistory className="text-4xl" />
        <span className="text-lg font-bold text-[#c9c6c6]">
          {t("Day")} {dayInfo.day}
        </span>
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-2 font-bold text-[#aec94f]">
        {t("Reward")} : <span className="text-[#aec94f]">{dayInfo.reward}</span>
      </div>
      {dayInfo.isCollected ? (
        <button className="w-full rounded-md bg-[#170e27] py-1 font-bold">{t("Collected")}</button>
      ) : undefined}

      {!dayInfo.isCollected && new Date(dayInfo.availableAt) <= today ? (
        <button
          onClick={collectDailyReward}
          className="flex w-full items-center justify-center rounded-md bg-[#01D676] py-1 font-bold"
        >
          {isLoading ? <Spinner color="brown" /> : t("Collect")}
        </button>
      ) : undefined}

      {new Date(dayInfo.availableAt) > today ? (
        <button className="h-[30px] w-full rounded-md bg-[#205764] font-bold">
          {dayWhichTimmerIsLocated === dayInfo.availableAt ? (
            <Timer date={new Date(dayInfo.availableAt)} handleUpdateNextTimerDay={handleUpdateNextTimerDay} />
          ) : (
            t("Next")
          )}
        </button>
      ) : undefined}
    </div>
  );
};

export default DailyStreakRewardCard;
