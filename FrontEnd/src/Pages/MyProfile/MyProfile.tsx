import { useCallback, useEffect } from "react";
import { BsFillExclamationOctagonFill } from "react-icons/bs";
import { MdOutlineEventNote } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { RiFileCopyLine } from "react-icons/ri";
import { AiFillSetting } from "react-icons/ai";
import { RiNumbersFill } from "react-icons/ri";
import { FcOk } from "react-icons/fc";
import { rank1Desktop, rank2Desktop, rank3Desktop, verifiedImage } from "../../assets";
import { showModal, openToast } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import Statistics from "./Statistics";
import WhoVisitProfile from "./WhoVisitProfile";
import MyFrames from "./MyFrames";
import MyMusics from "./MyMusics";
import UserImage from "../../components/Shared/Common/UserImage";

const MyProfile = () => {
  const currentUser = useAppSelector((state) => state.appState.currentUser);
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const queryParam = searchParams.get("to");

  const mathLevel: number = currentUser?.points ? currentUser.points / 100 : 0 / 100;
  const level = Math.floor(mathLevel);
  let progress: number = 0;
  if (Number.isInteger(mathLevel)) {
    progress = mathLevel * 0;
  } else {
    progress = Number(mathLevel?.toString().slice(-1).concat("0"));
  }

  const copyReferralLink = (text: string) => {
    navigator.clipboard.writeText(text);
    dispatch(
      openToast({
        message: "Copied!",
        type: "SUCESS",
      }),
    );
  };

  const handleOpenSetting = useCallback(() => {
    dispatch(showModal("profile-setting-modal"));
  }, [dispatch]);

  useEffect(() => {
    if (queryParam === "settings") {
      handleOpenSetting();
    }
  }, [queryParam, handleOpenSetting]);

  if (!currentUser) return;

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#141523] py-4 md:py-6">
      <div className="mx-auto w-[95%]">
        <div className="mb-2 flex items-center justify-between px-4 md:mb-5">
          <span className="text-xl font-bold text-[#8df174] md:text-2xl">My Profile</span>
          <button
            onClick={handleOpenSetting}
            className="flex items-center gap-2 rounded-md bg-[#ade66de3] px-3 py-[2px] text-sm font-bold tracking-wider text-[#131b2b] md:px-5 md:py-1 md:text-xl"
          >
            <AiFillSetting />
            Settings
          </button>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
          <div className="flex h-[140px] w-[98%] flex-col items-center justify-evenly overflow-hidden rounded-lg bg-[#222339] lg:h-[180px] lg:w-[49%]">
            <div className="flex w-full items-center justify-evenly">
              <div className="h-[90px] w-[110px] sm:h-[90px] sm:w-[90px]">
                <UserImage user={currentUser} />
              </div>
              <div className="flex w-[60%] flex-col items-center gap-1 md:gap-2">
                <span className="text-lg font-bold text-[#ab9df8ee] sm:text-sm">{currentUser.name}</span>
                {currentUser.emailVerified && (
                  <div className="flex items-center gap-4">
                    <img src={verifiedImage} alt="" className="h-8 w-8 object-cover" />
                    <span className="text-gray-400">Verified</span>
                  </div>
                )}
                <div className="flex w-[75%] flex-col items-center">
                  <div className="relative flex w-full flex-col">
                    <div
                      className={`relative h-1 w-full animate-pulse bg-[#acb0ffc4] transition-all sm:h-1`}
                    ></div>
                    <span
                      style={{
                        marginLeft: `${progress}%`,
                      }}
                      className={`h-[10px] w-[0px] animate-pulse border-l-[5px] border-r-[5px] border-t-[8px] border-l-[#222339] border-r-[#222339] border-t-[#acb0ffc4] transition-all`}
                    ></span>
                  </div>
                  <div
                    style={{
                      paddingLeft: `${progress}%`,
                    }}
                    className={`z-[1] flex w-full animate-pulse items-center gap-2 transition-all sm:gap-1`}
                  >
                    <span className="pl-[3px] text-xs text-[#72fa50] sm:text-[8px]">{level ? level : 0}</span>
                    <span className="text-xs text-[#789ed6ee] sm:text-[8px]">Level</span>
                  </div>
                  <span className={"text-xs tracking-wider text-[#cfaa44] lg:text-[8px]"}>
                    You Need{" "}
                    {currentUser.points && currentUser.points > 100
                      ? 100 - Number(currentUser.points?.toString().slice(1))
                      : 100 - (currentUser.points ? currentUser.points : 0)}{" "}
                    Points to reach level {level + 1}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Statistics />
        </div>
        <div id="who-visite-profile">
          <WhoVisitProfile />
        </div>
        <div
          id={"my-referral-link"}
          className="mx-auto my-7 flex w-full flex-col gap-y-2 rounded-md bg-slate-700 px-2 py-2 md:px-4"
        >
          <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
            <p className="font-bold text-[#55df8a]">Your Referral Link</p>
            <div className="flex w-full items-center gap-1 rounded-sm bg-[#1f2742] px-2 md:w-[70%] lg:w-[50%]">
              <input
                type="text"
                name="referral-link"
                className="w-full bg-[#1b243fcb] py-1 text-gray-400 outline-none"
                readOnly={true}
                value={`${window.location.origin}/?referrerUser=${currentUser._id}`}
              />
              <span
                onClick={() => copyReferralLink(`${window.location.origin}/?referrerUser=${currentUser._id}`)}
                className="relative flex h-5 w-[15%] items-center justify-center"
              >
                <RiFileCopyLine className="text-xl" />
              </span>
            </div>
          </div>
          <p className="text-center text-sm text-[#26e6ffee]">
            Each Person Sign In through your Referral Link Instantly you get 100 points as a Reward
          </p>
        </div>
        <MyFrames />
        <MyMusics />
        <div className="mx-auto mt-7 flex max-w-[95%] items-center gap-2 overflow-x-auto scrollbar-none md:gap-5">
          <span className="rounded-md bg-[#20212e] px-4 py-2 text-gray-400 sm:text-xs">Tiers</span>
          <span className="rounded-md bg-[#20212e] px-4 py-2 text-gray-400 sm:text-xs">Affiliates</span>
          <span className="rounded-md bg-[#20212e] px-4 py-2 text-gray-400 sm:text-xs">Leaderboard</span>
          <span className="rounded-md bg-[#20212e] px-4 py-2 text-gray-400 sm:text-xs">Earnings</span>
          <span className="rounded-md bg-[#20212e] px-4 py-2 text-gray-400 sm:text-xs">Promo</span>
        </div>
        <div className="mx-auto mt-8 flex w-[95%] items-center gap-3 md:gap-x-6">
          <MdOutlineEventNote className="h-10 w-10 min-w-fit opacity-60 lg:h-16 lg:w-16" />
          <p className="text-md text-[#a19bad]">
            Reach the next Tier to earn a higher commission from your affiliates.
          </p>
        </div>
        <div className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(20).keys()].map((item) => (
            <div key={item} className="h-[180px] rounded-lg bg-[#1c1e2e] p-2">
              <div className="mb-4 flex items-center justify-between border-b border-[#635a5a] py-4">
                <div className="flex items-center gap-2 font-bold text-gray-300">
                  <RiNumbersFill /> Tier 2
                </div>
                <span className="text-sm text-gray-300">7% Commissions</span>
              </div>

              <span className="text-sm text-gray-400">Requirments</span>
              <span className="mt-3 flex items-center gap-3">
                <FcOk />
                <span className="text-sm text-gray-300">$0.00 affiliate earnings</span>
              </span>
            </div>
          ))}
        </div>
        <div className="mx-auto my-8 flex w-[95%] items-center gap-6 gap-x-3">
          <BsFillExclamationOctagonFill />
          <p className="text-gray-400">These are our top affiliate earners.</p>
        </div>
        <div className="mt-20 flex justify-center gap-3 overflow-hidden md:gap-10">
          <div className="relative">
            <img alt={""} src={rank2Desktop} className="h-48 w-52 lg:h-60" />
            <span className="absolute bottom-[25%] left-[33%] text-lg font-bold text-gray-200">$53.052</span>
          </div>
          <div className="relative mt-[-5%]">
            <img alt={""} src={rank1Desktop} className="h-60 w-52 sm:h-48" />
            <span className="absolute bottom-[35%] left-[33%] text-lg font-bold text-gray-200">$85.642</span>
          </div>
          <div className="relative">
            <img alt={""} src={rank3Desktop} className="h-60 w-52 sm:h-48" />
            <span className="absolute bottom-[25%] left-[33%] text-lg font-bold text-gray-200">$20.940</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
