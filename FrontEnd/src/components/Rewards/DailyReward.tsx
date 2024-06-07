import { Link } from "react-router-dom";
import { BsTwitter } from "react-icons/bs";
import { MdAppSettingsAlt, MdOutlineGppMaybe } from "react-icons/md";
import DailyStreakRewardCard from "./DailyStreakRewardCard";
import { useAppSelector } from "../../context/Hooks";
import { desktopAffiliateGraphicRight } from "../../assets";
import desktopAffiliateBannerBg from "../../assets/images/desktop-affiliate-banner-bg.png";
import DailyStreakRewardCardSkeleton from "./DailyStreakRewardCardSkeleton";
import { useEffect, useState } from "react";

const DailyReward = () => {
  const { currentUser, currentAccountRequestFullfiled, resizeSidebare } =
    useAppSelector((state) => state.stateManeger);

  const [dayWhichTimmerIsLocated, setDayWhichTimmerIsLocated] = useState<
    string | null
  >(null);

  useEffect(() => {
    const today = new Date();
    const nearstNexttDay = currentUser?.dailyReward.find(
      (item) => new Date(item.availableAt) > today
    );
    if (currentUser && nearstNexttDay) {
      setDayWhichTimmerIsLocated(nearstNexttDay.availableAt);
    }
    if (currentAccountRequestFullfiled && !currentUser) {
      const nextDay = new Date(
        new Date(new Date().setHours(0, 0, 0, 0)).setDate(
          new Date().getDay() + 3
        )
      ).toISOString();
      setDayWhichTimmerIsLocated(nextDay);
    }
  }, [currentUser?._id, currentAccountRequestFullfiled]);

  const handleUpdateNextTimerDay = () => {
    if (dayWhichTimmerIsLocated) {
      // const copied = new Date(dayWhichTimmerIsLocated);
      // const nextDay = new Date(copied.setDate(copied.getDate() + 1));
      // setDayWhichTimmerIsLocated(nextDay.toISOString());
      let dayNow = new Date().getDate();

      setDayWhichTimmerIsLocated(`2024-06-0${dayNow + 1}T00:00:00.000Z`);
    }
  };

  // let dayNow = new Date().getDate() + 1;

  // console.log(`2024-06-${dayNow + 1}T00:00:00.000Z`);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative rounded-lg h-[200px] overflow-hidden">
        <img
          src={desktopAffiliateBannerBg}
          alt=""
          className="absolute w-full h-full"
        />
        <img
          alt={""}
          src={desktopAffiliateGraphicRight}
          className="absolute bottom-0 right-0 w-[240px] h-full"
        />
        <div className="absolute flex flex-col gap-3 w-[95%] xs:w-[90%] mt-5 xs:mx-2 mx-5">
          <p className="text-white text-xl lg:text-sm font-bold tracking-wider ">
            The Most Rewarding Affiliate System in The Mareket is Now Live!
          </p>
          <p className="text-white lg:text-sm tracking-wider">
            Earn Up to
            <span className="text-yellow-400 ">30% Commission!</span>
          </p>
          <p className="text-sm lg:text-xs sm:text-[#99a1ce]">
            Git Your Friend A Free time and Earn Up to 30% Commission From What
            They Earn
          </p>
          <Link
            to={"/affiliates"}
            className="w-[200px] bg-[#87ec8ec7] text-black rounded-md font-bold  py-1 text-center"
          >
            Go To Affiliate Page
          </Link>
        </div>
      </div>
      <div className="flex flex-col bg-[#2C2C44] gap-4 sm:gap-2 p-5 rounded-md sm:p-4 xs:p-2 ">
        <div className="flex justify-between items-center gap-x-10 flex-wrap">
          <p className="text-[#4cf871] text-xl sm:text-lg lg:text-lg font-bold tracking-wider">
            7 Day Streak Rewards
          </p>
          {currentUser && (
            <span className="text-[#4cf871] text-xl sm:text-lg lg:text-lg font-bold  tracking-widest">
              week : {currentUser?.week}
            </span>
          )}
        </div>
        <p className="text-yellow-400 text-sm sm:text-xs lg:text-xs">
          Earn 1,000 <span className="text-sm">or more</span> coins{" "}
          <span className="text-sm">within </span> 24 hours{" "}
          <span className="text-sm">to keep you streak</span>
        </p>
        <div
          id="daily-reward"
          className={`gap-2 grid ${
            resizeSidebare
              ? "grid-cols-4 lg:grid-cols-3"
              : "grid-cols-3 lg:grid-cols-2"
          }  sm:grid-cols-3 xs:grid-cols-2`}
        >
          {!currentAccountRequestFullfiled &&
            [...Array(7).keys()].map((item) => (
              <DailyStreakRewardCardSkeleton key={item} />
            ))}

          {currentAccountRequestFullfiled &&
            currentUser?.dailyReward.map((item) => (
              <DailyStreakRewardCard
                key={item.day}
                dayInfo={item}
                dayWhichTimmerIsLocated={dayWhichTimmerIsLocated}
                // setDayWhichTimmerIsLocated={setDayWhichTimmerIsLocated}
                handleUpdateNextTimerDay={handleUpdateNextTimerDay}
              />
            ))}

          {currentAccountRequestFullfiled &&
            !currentUser &&
            [...Array(7).keys()].map((item) => {
              return (
                <DailyStreakRewardCard
                  key={item + 1}
                  dayInfo={{
                    day: item + 1,
                    availableAt:
                      item + 1 === 1
                        ? new Date(
                            new Date().setHours(0, 0, 0, 0)
                          ).toISOString()
                        : new Date(
                            new Date(new Date().setHours(0, 0, 0, 0)).setDate(
                              new Date().getDay() + item + 2
                            )
                          ).toISOString(),
                    reward: 50 * (item + 1),
                    isCollected: false,
                  }}
                  dayWhichTimmerIsLocated={dayWhichTimmerIsLocated}
                  // setDayWhichTimmerIsLocated={setDayWhichTimmerIsLocated}
                  handleUpdateNextTimerDay={handleUpdateNextTimerDay}
                />
              );
            })}
          {/* {currentAccountRequestFullfiled && !currentUser && (
            <>
              <DailyStreakRewardCard
                dayInfo={{
                  day: 1,
                  availableAt: new Date().toISOString(),
                  reward: 50,
                  isCollected: false,
                }}
                dayWhichTimmerIsLocated={dayWhichTimmerIsLocated}
                setDayWhichTimmerIsLocated={setDayWhichTimmerIsLocated}
              />
              <DailyStreakRewardCard
                dayInfo={{
                  day: 2,
                  availableAt: new Date(
                    new Date().setDate(new Date().getDay() + 5)
                  ).toISOString(),
                  reward: 100,
                  isCollected: false,
                }}
                dayWhichTimmerIsLocated={dayWhichTimmerIsLocated}
                setDayWhichTimmerIsLocated={setDayWhichTimmerIsLocated}
              />
              <DailyStreakRewardCard
                dayInfo={{
                  day: 3,
                  availableAt: new Date(
                    new Date().setDate(new Date().getDay() + 5)
                  ).toISOString(),
                  reward: 150,
                  isCollected: false,
                }}
                dayWhichTimmerIsLocated={dayWhichTimmerIsLocated}
                setDayWhichTimmerIsLocated={setDayWhichTimmerIsLocated}
              />
              <DailyStreakRewardCard
                dayInfo={{
                  day: 4,
                  availableAt: new Date(
                    new Date().setDate(new Date().getDay() + 5)
                  ).toISOString(),
                  reward: 200,
                  isCollected: false,
                }}
                dayWhichTimmerIsLocated={dayWhichTimmerIsLocated}
                setDayWhichTimmerIsLocated={setDayWhichTimmerIsLocated}
              />
              <DailyStreakRewardCard
                dayInfo={{
                  day: 5,
                  availableAt: new Date(
                    new Date().setDate(new Date().getDay() + 5)
                  ).toISOString(),
                  reward: 250,
                  isCollected: false,
                }}
                dayWhichTimmerIsLocated={dayWhichTimmerIsLocated}
                setDayWhichTimmerIsLocated={setDayWhichTimmerIsLocated}
              />
              <DailyStreakRewardCard
                dayInfo={{
                  day: 6,
                  availableAt: new Date(
                    new Date().setDate(new Date().getDay() + 5)
                  ).toISOString(),
                  reward: 300,
                  isCollected: false,
                }}
                dayWhichTimmerIsLocated={dayWhichTimmerIsLocated}
                setDayWhichTimmerIsLocated={setDayWhichTimmerIsLocated}
              />
              <DailyStreakRewardCard
                dayInfo={{
                  day: 7,
                  availableAt: new Date(
                    new Date().setDate(new Date().getDay() + 6)
                  ).toISOString(),
                  reward: 350,
                  isCollected: false,
                }}
                dayWhichTimmerIsLocated={dayWhichTimmerIsLocated}
                setDayWhichTimmerIsLocated={setDayWhichTimmerIsLocated}
              />
            </>
          )} */}
        </div>
        <div className="flex items-center gap-2 text-orange-400 text-sm bg-[#a5a5a425] px-4 py-2 rounded-md">
          <MdOutlineGppMaybe className="w-10 h-10 opacity-70" />
          Earn 1000 more coins today to keep your streak! Time left d
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap sm:flex-col overflow-hidden">
        <div className="w-[300px] bg-[#746dac33] flex items-center justify-between  rounded-lg border-b border-b-gray-300 p-3">
          <div className="w-[20%] py-2 bg-[#191c3aad] rounded-lg flex items-center justify-center border-b border-b-gray-300">
            <BsTwitter className="text-3xl " />
          </div>

          <div className="w-[68%] flex flex-col items-center justify-center gap-1 ">
            <span className=" text-[#b3ddb1] font-bold ">
              Follow Us On Twitter
            </span>
            <button className="text-black bg-[#87ec8ed0] rounded-sm w-full border border-gray-400 flex items-center justify-center font-bold ml-auto">
              Claim Coins
            </button>
          </div>
        </div>
        <div className="w-[300px] bg-[#746dac33] flex items-center justify-between rounded-lg border-b border-b-gray-300 p-3">
          <div className="w-[20%] py-2 bg-[#191c3aad] rounded-lg flex items-center justify-center border-b border-b-gray-300">
            <MdAppSettingsAlt className="text-3xl " />
          </div>

          <div className="w-[68%] flex flex-col items-center gap-1  ">
            <span className=" text-[#b3ddb1] font-bold ">Download Our App</span>
            <button className="text-black bg-[#87ec8ed0] rounded-sm w-full border border-gray-400 flex items-center justify-center  font-bold ">
              Download For Coins
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReward;
