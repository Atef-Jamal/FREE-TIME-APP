import { Link } from "react-router-dom";
import { BsTwitter } from "react-icons/bs";
import { MdAppSettingsAlt, MdOutlineGppMaybe } from "react-icons/md";
import DailyStreakRewardCard from "./DailyStreakRewardCard";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { desktopAffiliateGraphicRight } from "../../assets";
import desktopAffiliateBannerBg from "../../assets/images/desktop-affiliate-banner-bg.png";
import DailyStreakRewardCardSkeleton from "./DailyStreakRewardCardSkeleton";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { makeRequest } from "../../utils";
import { showPopup } from "../../context/StateManeger";

const DailyReward = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const isCurrentUserReqFinished = useAppSelector((state) => state.stateManeger.isCurrentUserReqFinished);
  const resizeSidebare = useAppSelector((state) => state.stateManeger.resizeSidebare);

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
    if (isCurrentUserReqFinished && !currentUser) {
      const nextDay =
        new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0] + "T00:00:00.000Z";
      setDayWhichTimmerIsLocated(nextDay);
    }
  }, [currentUser, isCurrentUserReqFinished]);

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
        dispatch(showPopup({ message: "an error occured!", type: "ERROR_GENERAL" }));
      }
    };
    getDate();
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative rounded-lg h-[200px] overflow-hidden">
        <img src={desktopAffiliateBannerBg} alt="" className="absolute w-full h-full" />
        <img
          alt={""}
          src={desktopAffiliateGraphicRight}
          className="absolute bottom-0 right-0 w-[240px] h-full"
        />
        <div className="absolute flex flex-col gap-3 w-[95%] xs:w-[90%] mt-5 xs:mx-2 mx-5">
          <p className="text-white text-xl lg:text-sm font-bold tracking-wider ">
            {t("The Most Rewarding Affiliate System in The Mareket is Now Live")}
          </p>
          <p className="text-white lg:text-sm tracking-wider">
            {t("Earn Up to")}
            <span className="text-yellow-400 ">30% Commission!</span>
          </p>
          <p className="text-sm lg:text-xs sm:text-[#99a1ce]">
            {t("Git Your Friend A Free time and Earn Up to 30% Commission From What They Earn")}
          </p>
          <Link
            to={"/affiliates"}
            className="w-[200px] bg-[#87ec8ec7] text-black rounded-md font-bold  py-1 text-center"
          >
            {t("Go To Affiliate Page")}
          </Link>
        </div>
      </div>
      <div className="flex flex-col bg-[#2C2C44] gap-4 sm:gap-2 p-5 rounded-md sm:p-4 xs:p-2 ">
        <div className="flex justify-between items-center gap-x-10 flex-wrap">
          <p className="text-[#4cf871] text-xl sm:text-lg lg:text-lg font-bold tracking-wider">
            {t("7 Day Streak Rewards")}
          </p>
          {currentUser && (
            <span className="text-[#4cf871] text-xl sm:text-lg lg:text-lg font-bold  tracking-widest">
              {t("week")} : {currentUser?.week}
            </span>
          )}
        </div>
        <p className="text-yellow-400  sm:text-sm lg:text-xs ">
          {t("Earn 1,000 or more points within 24 hours to keep you streak")}
        </p>
        <p className="text-yellow-400 sm:text-sm lg:text-xs">
          {t("according to your timezoon the day beginning at")}{" "}
          <span className="font-bold text-[#646df5]">
            {new Date(today).toLocaleTimeString().split(" ")[0].slice(0, -3)}{" "}
            {t(new Date(today).toLocaleTimeString().split(" ")[1].toLocaleLowerCase())}
          </span>
        </p>
        <div
          id={!currentUser ? "daily-reward" : undefined}
          className={`gap-2 grid ${
            resizeSidebare ? "grid-cols-4 lg:grid-cols-3" : "grid-cols-3 lg:grid-cols-2"
          }  sm:grid-cols-3 xs:grid-cols-2`}
        >
          {!isCurrentUserReqFinished &&
            [...Array(7).keys()].map((item) => <DailyStreakRewardCardSkeleton key={item} />)}

          {isCurrentUserReqFinished &&
            currentUser?.dailyReward.map((item) => (
              <DailyStreakRewardCard
                key={item.day}
                dayInfo={item}
                dayWhichTimmerIsLocated={dayWhichTimmerIsLocated}
                handleUpdateNextTimerDay={handleUpdateNextTimerDay}
              />
            ))}

          {isCurrentUserReqFinished &&
            !currentUser &&
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
        <div className="flex items-center gap-2 text-orange-400 text-sm bg-[#a5a5a425] px-4 py-2 rounded-md">
          <MdOutlineGppMaybe className="min-w-fit h-8 opacity-70" />
          {t("Earn 1000 more coins today to keep your streak! Time left")}
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap sm:flex-col overflow-hidden">
        <div className="w-[300px] xs:w-full bg-[#746dac33] flex items-center justify-between  rounded-lg border-b border-b-gray-300 p-3">
          <div className="w-[20%] py-2 bg-[#191c3aad] rounded-lg flex items-center justify-center border-b border-b-gray-300">
            <BsTwitter className="text-3xl " />
          </div>

          <div className="w-[68%] flex flex-col items-center justify-center gap-1 ">
            <span className=" text-[#b3ddb1] font-bold ">{t("Follow Us On Twitter")}</span>
            <button className="text-black bg-[#87ec8ed0] rounded-sm w-full border border-gray-400 flex items-center justify-center font-bold ml-auto">
              {t("Claim Points")}
            </button>
          </div>
        </div>
        <div className="w-[300px] xs:w-full bg-[#746dac33] flex items-center justify-between rounded-lg border-b border-b-gray-300 p-3">
          <div className="w-[20%] py-2 bg-[#191c3aad] rounded-lg flex items-center justify-center border-b border-b-gray-300">
            <MdAppSettingsAlt className="text-3xl " />
          </div>

          <div className="w-[68%] flex flex-col items-center gap-1  ">
            <span className=" text-[#b3ddb1] font-bold ">{t("Download Our App")}</span>
            <button className="text-black bg-[#87ec8ed0] rounded-sm w-full border border-gray-400 flex items-center justify-center  font-bold ">
              {t("Download For Points")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReward;
