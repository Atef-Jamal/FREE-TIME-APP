import {
  rank1Desktop,
  rank2Desktop,
  rank3Desktop,
  verifiedImage,
} from "../assets";
import { AiFillSetting } from "react-icons/ai";
import { RiNumbersFill } from "react-icons/ri";
import { RiFileCopyLine } from "react-icons/ri";

import { FcOk } from "react-icons/fc";
import { BsFillExclamationOctagonFill } from "react-icons/bs";
import { openModel, setCurrentUser, showPopup } from "../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import ProfileSettings from "../components/myProfile/ProfileSettings";

import MusicCard from "../components/Music/MusicCard";
import UserImage from "../components/Others/UserImage";
import { makeRequest } from "../utils";
import { handleApiError } from "../utils/common";
import Statistics from "../components/myProfile/Statistics";
import WhoVisitProfile from "../components/myProfile/WhoVisitProfile";
import { TypeFrame } from "../types/frameTypes";
import { useFetchMusics } from "../hooks";
import { useScrollToElement } from "../hooks/commonHooks";
import Empty from "../components/Others/Empty";
import { MdOutlineEventNote } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect } from "react";

const MyProfile = () => {
  const { currentUser, socket } = useAppSelector((state) => state.stateManeger);
  const { musics } = useFetchMusics();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("to");
  const dispatch = useAppDispatch();

  const mathLevel: number = currentUser?.points
    ? currentUser.points / 100
    : 0 / 100;

  const level = Math.floor(mathLevel);
  let progress: number = 0;

  if (Number.isInteger(mathLevel)) {
    progress = mathLevel * 0;
  } else {
    progress = Number(mathLevel?.toString().slice(-1).concat("0"));
  }

  useScrollToElement({ dependencies: [musics] });

  const changeFrame = async (frameObject: TypeFrame) => {
    if (!currentUser) {
      return;
    }
    try {
      const response = await makeRequest.get(
        `api/users/select-myphoto-frame/${frameObject._id}`
      );
      dispatch(setCurrentUser({ ...currentUser, activeFrame: response.data }));
      dispatch(
        showPopup({
          message: "Changed Successfully",
          type: "SUCESS",
        })
      );
      socket?.emit("user-updated", {
        ...currentUser,
        activeFrame: response.data,
      });
    } catch (error) {
      dispatch(
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        })
      );
    }
  };

  const unselectPhotoFrame = async () => {
    if (!currentUser) {
      return;
    }
    try {
      await makeRequest.get("api/users/unselect-myphoto-frame");
      dispatch(setCurrentUser({ ...currentUser, activeFrame: null }));
      dispatch(
        showPopup({
          message: "Removed Successfully",
          type: "SUCESS",
        })
      );
      socket?.emit("user-updated", { ...currentUser, activeFrame: null });
    } catch (error) {
      dispatch(
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        })
      );
    }
  };

  const copyReferralLink = (text: string) => {
    navigator.clipboard.writeText(text);
    dispatch(
      showPopup({
        message: "Copied!",
        type: "SUCESS",
      })
    );
  };

  const handleOpenSetting = useCallback(() => {
    dispatch(
      openModel({
        status: true,
        children: <ProfileSettings />,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (queryParam === "settings") {
      handleOpenSetting();
    }
  }, [queryParam, handleOpenSetting]);

  if (!currentUser) return;

  return (
    <div className="bg-[#141523] py-6 sm:py-4 h-full w-full flex items-center justify-center">
      <div className="w-[95%] lg:w-[95%] mx-auto sm:w-[95%]">
        <div className="flex items-center justify-between px-4 mb-5 sm:mb-2">
          <span className="text-2xl sm:text-xl font-bold text-[#8df174]">
            My Profile
          </span>
          <button
            onClick={handleOpenSetting}
            className="flex items-center gap-2 text-[#131b2b] font-bold text-xl tracking-wider py-1 sm:py-[2px] px-5 sm:px-3 sm:text-sm rounded-md bg-[#ade66de3] "
          >
            <AiFillSetting />
            Settings
          </button>
        </div>
        <div className="flex items-center justify-between sm:flex-col sm:gap-4 w-full">
          <div className="flex items-center justify-evenly bg-[#222339] w-[49%] flex-col sm:w-[98%] h-[180px] sm:h-[140px] rounded-lg ">
            <div className="flex items-center justify-evenly w-full ">
              <div className="w-[110px] h-[90px] sm:w-[90px] sm:h-[90px] ">
                <UserImage user={currentUser} />
              </div>
              <div className=" w-[60%] flex flex-col items-center gap-2 xs:gap-1">
                <span className="text-lg font-bold sm:text-sm text-[#ab9df8ee]">
                  {currentUser.name}
                </span>
                {currentUser.emailVerified && (
                  <div className="flex items-center gap-4">
                    <img
                      src={verifiedImage}
                      alt=""
                      className="w-8 h-8 object-cover"
                    />
                    <span className="text-gray-400">Verified</span>
                  </div>
                )}
                <div className="flex flex-col items-center w-[75%]">
                  <div className="relative w-full flex flex-col">
                    <div
                      className={`transition-all relative animate-pulse  h-1 sm:h-1 w-full  bg-[#acb0ffc4]`}
                    ></div>
                    <span
                      style={{
                        marginLeft: `${progress}%`,
                      }}
                      className={`transition-all border-t-[8px] border-l-[5px] border-r-[5px] animate-pulse
                      border-t-[#acb0ffc4] border-r-[#222339] border-l-[#222339] w-[0px] h-[10px]`}
                    ></span>
                  </div>
                  <div
                    style={{
                      paddingLeft: `${progress}%`,
                    }}
                    className={`transition-all flex items-center animate-pulse gap-2 sm:gap-1 w-full z-[1] `}
                  >
                    <span className="text-xs sm:text-[8px] text-[#72fa50] pl-[3px]">
                      {level ? level : 0}
                    </span>
                    <span className="text-xs sm:text-[8px] text-[#789ed6ee]">
                      Level
                    </span>
                  </div>
                  <span
                    className={`text-xs lg:text-[8px] text-[#cfaa44] tracking-wider`}
                  >{`You Need ${
                    currentUser.points && currentUser.points > 100
                      ? 100 - Number(currentUser.points?.toString().slice(1))
                      : 100 - (currentUser.points ? currentUser.points : 0)
                  } Points to reach level ${level + 1}`}</span>
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
          className="w-full bg-slate-700 rounded-md py-2 px-4 sm:px-2 sm:mx-auto flex flex-col gap-2 my-7"
        >
          <div className="flex items-center sm:gap-2 justify-between sm:flex-col">
            <p className=" font-bold text-[#55df8a]">Your Referral Link</p>
            <div className=" bg-[#1f2742] w-[50%] lg:w-[70%] sm:w-full rounded-sm px-2 flex items-center gap-1">
              <input
                type="text"
                name="referral-link"
                className="bg-[#1b243fcb] outline-none w-full text-gray-400 py-1"
                readOnly={true}
                value={`${window.location.origin}/?referrerUser=${currentUser._id}`}
              />
              <span
                onClick={() =>
                  copyReferralLink(
                    `${window.location.origin}/?referrerUser=${currentUser._id}`
                  )
                }
                className="relative w-[15%] h-5 flex items-center justify-center"
              >
                <RiFileCopyLine className="text-xl " />
              </span>
            </div>
          </div>
          <p className="text-sm text-[#26e6ffee] text-center">
            Each Person Sign In through your Referral Link Instantly you get 100
            points as a Reward
          </p>
        </div>
        <div
          id="my-frames"
          className=" mt-5 flex flex-col gap-2 p-2 items-center justify-center bg-[#222339] rounded-md"
        >
          <span className="text-[#7dec73] font-bold">My Frames</span>
          <div
            className={`w-full grid grid-cols-5 lg:grid-cols-4 sm:grid-cols-4 xs:grid-cols-3 gap-2`}
          >
            {currentUser?.myFrames?.map((item: TypeFrame) => {
              return (
                <div
                  key={item._id}
                  id={item._id}
                  className="flex flex-col items-center w-full justify-center gap-3 px-2 py-3 bg-[#5b667a42] rounded-md"
                >
                  <div className="relative w-full flex items-center justify-center">
                    <img
                      src={item.image}
                      alt=""
                      className="w-[70%] lg:w-full h-[120px] sm:h-[90px] lg:h-[110px] rounded-md mb-3"
                    />
                    <span className="absolute bg-[#222339] top-[16%] lg:top-[18%] left-[29%] lg:left-[22%] w-[43%] lg:w-[55%] sm:w-[55%] lg:h-[52%] h-[59%]"></span>
                  </div>
                  {currentUser?.activeFrame?._id === item._id ? (
                    <button
                      onClick={unselectPhotoFrame}
                      className="rounded-md font-bold bg-[#2d704ad8] w-[80%] xs:w-[95%] py-1 text-center mx-auto"
                    >
                      unselect
                    </button>
                  ) : (
                    <button
                      onClick={() => changeFrame(item)}
                      className=" rounded-md font-bold bg-[#467cce71] w-[80%] xs:w-[95%]  py-1 text-center mx-auto"
                    >
                      select
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {currentUser.myFrames.length === 0 && (
            <Empty emptyText="No Frames Buyed" />
          )}
        </div>
        <div
          id="my-musics"
          className=" w-full flex flex-col items-center gap-2 mt-5 bg-[#222339] p-2 rounded-md"
        >
          <h1 className="text-[#a0e965ee] font-bold text-center ">My Musics</h1>
          <div className="w-full grid grid-cols-8 xl:grid-cols-6 lg:grid-cols-5 sm:grid-cols-4 xs:grid-cols-2 gap-2">
            {musics
              ?.filter((item) => {
                if (currentUser?.mySongs?.includes(item.id.toString())) {
                  return item;
                }
              })
              .map((element) => (
                <MusicCard key={element.id} songDetails={element} />
              ))}
          </div>
          {currentUser?.mySongs?.length === 0 && (
            <Empty emptyText="No Musics Buyed" />
          )}
        </div>

        <div className="flex items-center gap-5 mt-7 sm:gap-2 sm:max-w-[95%] sm:mx-auto sm:overflow-scroll sm:scrollbar-none ">
          <span className="px-4 py-2 text-gray-400 bg-[#20212e] rounded-md sm:text-xs">
            Tiers
          </span>
          <span className="px-4 py-2 text-gray-400 bg-[#20212e] rounded-md sm:text-xs">
            Affiliates
          </span>
          <span className="px-4 py-2 text-gray-400 bg-[#20212e] rounded-md sm:text-xs">
            Leaderboard
          </span>
          <span className="px-4 py-2 text-gray-400 bg-[#20212e] rounded-md sm:text-xs">
            Earnings
          </span>
          <span className="px-4 py-2 text-gray-400 bg-[#20212e] rounded-md sm:text-xs">
            Promo
          </span>
        </div>
        <div className="flex gap-6 items-center mt-8 sm:w-[95%] sm:gap-3  mx-auto">
          <MdOutlineEventNote className="w-16 h-16 sm:w-10 sm:h-10 opacity-60 min-w-fit" />
          <p className="text-md text-[#a19bad]">
            Reach the next Tier to earn a higher commission from your
            affiliates.
          </p>
        </div>
        <div className="mt-7 grid grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2">
          {[...Array(20).keys()].map((item) => (
            <div key={item} className="h-[180px] p-2 rounded-lg bg-[#1c1e2e]">
              <div className="flex justify-between items-center py-4 mb-4 border-b border-[#635a5a]">
                <div className="flex items-center gap-2 text-gray-300 font-bold ">
                  <RiNumbersFill /> Tier 2
                </div>
                <span className=" text-gray-300 text-sm">7% Commissions</span>
              </div>

              <span className="text-sm text-gray-400 ">Requirments</span>
              <span className="flex items-center gap-3 mt-3">
                <FcOk />
                <span className="text-gray-300 text-sm ">
                  $0.00 affiliate earnings
                </span>
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-6 items-center my-8 sm:w-[95%] sm:gap-3 mx-auto">
          <BsFillExclamationOctagonFill />
          <p className="text-gray-400 ">These are our top affiliate earners.</p>
        </div>
        <div className="flex gap-10 justify-center mt-20 sm:gap-3">
          <div className="relative">
            <img alt={""} src={rank2Desktop} className="w-52 h-60 sm:h-48" />
            <span className="absolute bottom-[25%] left-[33%] text-lg font-bold text-gray-200">
              $53.052
            </span>
          </div>
          <div className="relative mt-[-5%]">
            <img alt={""} src={rank1Desktop} className="w-52 h-60 sm:h-48" />
            <span className="absolute bottom-[35%] left-[33%] text-lg font-bold text-gray-200">
              $85.642
            </span>
          </div>
          <div className="relative">
            <img alt={""} src={rank3Desktop} className="w-52 h-60 sm:h-48" />
            <span className="absolute bottom-[25%] left-[33%] text-lg font-bold text-gray-200">
              $20.940
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
