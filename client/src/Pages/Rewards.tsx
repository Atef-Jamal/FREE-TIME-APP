import { useEffect, useState } from "react";
import { dollarInHand, desktopAffiliateGraphicRight } from "../assets";
import { MdCardGiftcard } from "react-icons/md";
import { MdOutlineGppMaybe } from "react-icons/md";
import { MdAppSettingsAlt } from "react-icons/md";
import { BsCheckCircleFill, BsTwitter } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import { DailyStreakRewardCard, Spinner } from "../components";
import { showPopup } from "../context/StateManeger";
import desktopAffiliateBannerBg from "../assets/desktop-affiliate-banner-bg.png";
import { BiCopy } from "react-icons/bi";
import { Link } from "react-router-dom";
import { makeRequest } from "../utils";
import Ladder from "../components/Rewards/Ladder";

interface TypeBounusCode {
  _id: string;
  code: string;
  prize: number;
  expirationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const Rewards = () => {
  const { currentUser, currentUserIsLoading, resizeSidebare } = useAppSelector(
    (state) => state.stateManeger
  );
  const [otherDays, setOtherDays] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [bonusCode, setBonusCode] = useState<TypeBounusCode | null>(null);
  const dispatch = useAppDispatch();

  const getOtherDays = () => {
    if (currentUser) {
      let dayes = [];
      for (
        let index = currentUser?.dailyReward.days.length + 1;
        index <= 7;
        index++
      ) {
        dayes.push(index);
      }
      setOtherDays(dayes);
    }
  };

  useEffect(() => {
    getOtherDays();
  }, [currentUser]);

  const getBonusCode = async () => {
    if (!currentUser) {
      dispatch(showPopup({ status: true, message: "Sign In first" }));
      return;
    }
    setLoading(true);
    try {
      const response = await makeRequest.get("api/coupons");
      setBonusCode(response.data);
    } catch (err) {
      console.log(err);
      dispatch(
        showPopup({
          status: true,
          message: "can not get Bounus Code, an error occurred",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const copyBonusCode = () => {
    if (bonusCode) {
      navigator.clipboard.writeText(bonusCode.code);
      dispatch(
        showPopup({
          status: true,
          message: "Copied!",
          icon: <BsCheckCircleFill />,
        })
      );
    }
  };

  return (
    <div className="flex flex-col bg-[#242438] gap-8 py-6">
      <div className="flex justify-between items-center bg-[#242438] px-8 sm:flex-col sm:p-4 sm:items-start sm:gap-6">
        <div className="flex items-center gap-4">
          <img
            alt={""}
            src={dollarInHand}
            className="w-10 h-10 p-2 bg-neutral-700 rounded-md"
          />
          <h1 className="text-3xl font-bold text-yellow-500 tracking-wider sm:text-2xl">
            FREETIME REWARDS
          </h1>
        </div>
        <button
          onClick={getBonusCode}
          className="relative flex gap-4 items-center bg-[#b6da7cce] py-2 px-4 rounded-md mr-3 border border-gray-600 "
        >
          <span
            onClick={(e) => e.stopPropagation()}
            className={`transition-all ${
              bonusCode ? "w-full p-3" : "w-0 p-0 overflow-hidden"
            } absolute top-0 left-0  h-full bg-[#4e3636]  rounded-md flex items-center justify-between  text-[#8792fa] `}
          >
            {bonusCode?.code}
            <span onClick={copyBonusCode} className=" opacity-70">
              <BiCopy className="text-2xl" />
            </span>
          </span>
          <MdCardGiftcard />
          <span className="text-white w-24">
            {loading ? (
              <Spinner className="w-5 h-5 mx-auto border-b-blue-800 border-l-blue-800" />
            ) : (
              "Bonus Code"
            )}
          </span>
        </button>
      </div>
      <div className="flex gap-4 bg-[#242438] px-6 lg:px-2  rounded-b-lg sm:rounded-none sm:flex-col sm:px-3 ">
        <div className="flex flex-col gap-4 w-[68%] max-w-[1500px] sm:w-full  ">
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
                Git Your Friend A Free time and Earn Up to 30% Commission From
                What They Earn
              </p>
              <Link
                to={"/affiliates"}
                className="w-[200px] bg-[#87ec8ec7] text-black rounded-md font-bold  py-1 text-center"
              >
                Go To Affiliate Page
              </Link>
            </div>
          </div>
          <div className="flex flex-col bg-[#2C2C44] gap-4 p-5 rounded-md sm:p-4 ">
            <div className="flex justify-between items-center sm:flex-col sm:items-start sm:gap-3">
              <p className="text-yellow-300 text-xl sm:text-lg lg:text-lg font-bold">
                7 Day Streak Rewards
              </p>
              <p className="text-yellow-400 text-sm sm:text-xs lg:text-xs">
                Earn 1,000 <span className="text-sm">or more</span> coins{" "}
                <span className="text-sm">within </span> 24 hours{" "}
                <span className="text-sm">to keep you streak week: {5}</span>
              </p>
            </div>
            <div
              className={`gap-2 grid ${
                resizeSidebare ? "grid-cols-4 " : "grid-cols-3 lg:grid-cols-2"
              }  sm:grid-cols-3 xs:grid-cols-2`}
            >
              {currentUser?.dailyReward.days.map((item) => {
                return (
                  <DailyStreakRewardCard
                    key={item.day}
                    day={item.day}
                    isCollected={item.isCollected}
                    isMock={false}
                  />
                );
              })}
              {otherDays.map((item) => {
                return (
                  <DailyStreakRewardCard
                    key={item}
                    day={item}
                    isMock={true}
                    isCollected={true}
                  />
                );
              })}
              {!currentUser && !currentUserIsLoading && (
                <>
                  <DailyStreakRewardCard
                    day={1}
                    isMock={true}
                    isCollected={false}
                  />
                  <DailyStreakRewardCard
                    day={2}
                    isMock={true}
                    isCollected={false}
                  />
                  <DailyStreakRewardCard
                    day={3}
                    isMock={true}
                    isCollected={false}
                  />
                  <DailyStreakRewardCard
                    day={4}
                    isMock={true}
                    isCollected={false}
                  />
                  <DailyStreakRewardCard
                    day={5}
                    isMock={true}
                    isCollected={false}
                  />
                  <DailyStreakRewardCard
                    day={6}
                    isMock={true}
                    isCollected={false}
                  />
                  <DailyStreakRewardCard
                    day={7}
                    isMock={true}
                    isCollected={false}
                  />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-orange-400 text-sm bg-[#a5a5a425] px-4 py-2 rounded-md">
              <MdOutlineGppMaybe />
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
                <span className=" text-[#b3ddb1] font-bold ">
                  Download Our App
                </span>
                <button className="text-black bg-[#87ec8ed0] rounded-sm w-full border border-gray-400 flex items-center justify-center  font-bold ">
                  Download For Coins
                </button>
              </div>
            </div>
          </div>
        </div>
        <Ladder />
      </div>
    </div>
  );
};

export default Rewards;
