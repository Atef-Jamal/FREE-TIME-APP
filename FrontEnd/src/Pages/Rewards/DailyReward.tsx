import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BsTwitter } from "react-icons/bs";
import { MdAppSettingsAlt, MdOutlineGppMaybe } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { openToast } from "../../context/appStateSlice";
import { makeRequest } from "../../services";
import { cn } from "../../utilities";
import { desktopAffiliateGraphicRight } from "../../assets";
import desktopAffiliateBannerBg from "../../assets/images/desktop-affiliate-banner-bg.png";
import DailyStreakRewardCardSkeleton from "./DailyStreakRewardCardSkeleton";
import DailyStreakRewardCard from "./DailyStreakRewardCard";

const DailyReward = () => {
  const currentUser = useAppSelector((state) => state.appState.currentUser);
  const currentUserStatus = useAppSelector((state) => state.appState.currentUserStatus);
  const sidebarCollapsed = useAppSelector((state) => state.appState.sidebarCollapsed);

  const [dayWhichTimmerIsLocated, setDayWhichTimmerIsLocated] = useState<string | null>(null);
  const [today, setToday] = useState("");
  const dispatch = useAppDispatch();
  const { t } = useTranslation("rewards");

  useEffect(() => {
    const today = new Date();
    const nearstNexttDay = currentUser?.dailyReward.find((item) => new Date(item.availableAt) > today);
    if (currentUser && nearstNexttDay) {
      setDayWhichTimmerIsLocated(nearstNexttDay.availableAt);
    }
    if (currentUserStatus !== "pending" && !currentUser) {
      const nextDay =
        new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0] + "T00:00:00.000Z";
      setDayWhichTimmerIsLocated(nextDay);
    }
  }, [currentUser, currentUserStatus]);

  const handleUpdateNextTimerDay = useCallback(() => {
    const addOneDay = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString();
    const datePart = addOneDay.split("T")[0];
    const nextTimerDay = datePart + "T00:00:00.000Z";
    setDayWhichTimmerIsLocated(nextTimerDay);
  }, []);

  useEffect(() => {
    const getDate = async () => {
      try {
        const response = await makeRequest.get("api/date");
        setToday(response.data);
      } catch (error) {
        dispatch(openToast({ message: "an error occured!", type: "ERROR_GENERAL" }));
      }
    };
    getDate();
  }, [dispatch]);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="relative h-[200px] overflow-hidden rounded-lg">
        <img src={desktopAffiliateBannerBg} alt="" className="absolute h-full w-full" />
        <img
          alt={""}
          src={desktopAffiliateGraphicRight}
          className="absolute bottom-0 right-0 h-full w-[240px]"
        />
        <div className="absolute mx-2 mt-5 flex h-[80%] w-[95%] flex-col gap-3 sm:mx-5 sm:w-[90%]">
          <p className="text-sm font-bold tracking-wider text-white md:text-xl">
            {t("The Most Rewarding Affiliate System in The Mareket is Now Live")}
          </p>
          <p className="text-sm tracking-wider text-white">
            {t("Earn Up to")}
            <span className="text-yellow-400">30% Commission!</span>
            <span className="text-xs text-[#99a1ce] sm:text-sm">
              {t("Git Your Friend A Free time and Earn Up to 30% Commission From What They Earn")}
            </span>
          </p>
          <Link
            to={"/affiliates"}
            className="mt-auto w-[200px] rounded-md bg-[#01D676] py-1 text-center font-bold text-black"
          >
            {t("Go To Affiliate Page")}
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-md bg-[#2C2C44] p-2 sm:p-4 md:gap-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-x-10">
          <p className="font-bold tracking-wider text-yellow-500 md:text-lg">{t("7 Day Streak Rewards")}</p>
          {currentUser && (
            <span className="tracking-wide text-[#4cf871] md:text-lg">
              {t("week")} : {currentUser?.week}
            </span>
          )}
        </div>
        <p className="text-center text-sm text-[#5fadec]">
          {t("Earn 1,000 or more points within 24 hours to keep you streak")}
          {t("according to your timezoon the day beginning at")}{" "}
          <span className="ml-1 font-bold text-[#9ead54]">
            {new Date(today).toLocaleTimeString().split(" ")[0].slice(0, -3)}{" "}
            {t(new Date(today).toLocaleTimeString().split(" ")[1].toLocaleLowerCase())}
          </span>
        </p>
        <div
          id={!currentUser ? "daily-reward" : undefined}
          className={cn(
            "grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4",
            sidebarCollapsed ? "lg:grid-cols-4" : "lg:grid-cols-3",
          )}
        >
          {currentUserStatus === "pending" &&
            [...Array(7).keys()].map((item) => <DailyStreakRewardCardSkeleton key={item} />)}

          {currentUserStatus === "authenticated" &&
            currentUser?.dailyReward.map((item) => (
              <DailyStreakRewardCard
                key={item.day}
                dayInfo={item}
                dayWhichTimmerIsLocated={dayWhichTimmerIsLocated}
                handleUpdateNextTimerDay={handleUpdateNextTimerDay}
              />
            ))}

          {currentUserStatus === "unauthenticated" &&
            [...Array(7).keys()].map((item) => {
              return (
                <DailyStreakRewardCard
                  key={item + 1}
                  dayInfo={{
                    day: item + 1,
                    availableAt:
                      new Date(new Date().setDate(new Date().getDate() + item)).toISOString().split("T")[0] +
                      "T00:00:00.000Z",
                    reward: 50 * (item + 1),
                    isCollected: false,
                  }}
                  dayWhichTimmerIsLocated={dayWhichTimmerIsLocated}
                  handleUpdateNextTimerDay={handleUpdateNextTimerDay}
                />
              );
            })}
        </div>
        <div className="flex items-center gap-2 rounded-md bg-[#a5a5a425] px-4 py-2 text-sm text-orange-400">
          <MdOutlineGppMaybe className="h-8 min-w-fit opacity-70" />
          {t("Earn 1000 more coins today to keep your streak! Time left")}
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-4 overflow-hidden sm:flex-row">
        <div className="flex w-full items-center justify-between rounded-lg border-b border-b-gray-300 bg-[#746dac33] p-3 md:w-[300px]">
          <div className="flex w-[20%] items-center justify-center rounded-lg border-b border-b-gray-300 bg-[#191c3aad] py-2">
            <BsTwitter className="text-3xl" />
          </div>

          <div className="flex w-[68%] flex-col items-center justify-center gap-1">
            <span className="font-bold text-[#b3ddb1]">{t("Follow Us On Twitter")}</span>
            <button className="ml-auto flex w-full items-center justify-center rounded-sm border border-gray-400 bg-[#87ec8ed0] font-bold text-black">
              {t("Claim Points")}
            </button>
          </div>
        </div>
        <div className="flex w-full items-center justify-between rounded-lg border-b border-b-gray-300 bg-[#746dac33] p-3 md:w-[300px]">
          <div className="flex w-[20%] items-center justify-center rounded-lg border-b border-b-gray-300 bg-[#191c3aad] py-2">
            <MdAppSettingsAlt className="text-3xl" />
          </div>

          <div className="flex w-[68%] flex-col items-center gap-1">
            <span className="font-bold text-[#b3ddb1]">{t("Download Our App")}</span>
            <button className="flex w-full items-center justify-center rounded-sm border border-gray-400 bg-[#87ec8ed0] font-bold text-black">
              {t("Download For Points")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReward;
