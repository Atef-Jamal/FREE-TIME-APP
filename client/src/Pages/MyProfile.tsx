import { useEffect, useRef, useState } from "react";
import {
  rank1Desktop,
  rank2Desktop,
  rank3Desktop,
  egypt,
  empty,
} from "../assets";
import { MdAutoAwesomeMosaic } from "react-icons/md";
import { AiFillSetting } from "react-icons/ai";
import { RiNumbersFill } from "react-icons/ri";
import { RiFileCopyLine } from "react-icons/ri";
import { BiTask } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { FcOk } from "react-icons/fc";
import {
  BsCheckCircleFill,
  BsExclamationOctagonFill,
  BsFillClockFill,
} from "react-icons/bs";
import { BsFillExclamationOctagonFill } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import { openModel, setCurrentUser, showPopup } from "../context/StateManeger";
import { TypeFrame, TypeNotifications } from "../types";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import { MusicCard, UserImage } from "../components";
import ProfileSettings from "../components/myProfile/ProfileSettings";
import { makeRequest } from "../utils";

const MyProfile = () => {
  const { currentUser, songs } = useAppSelector((state) => state.stateManeger);
  const [inputeRef, setInputRef] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [statistics, setStatistics] = useState<TypeNotifications[]>([]);

  const framesRef = useRef<HTMLDivElement>(null);
  const referralLinkRef = useRef<HTMLDivElement>(null);
  const musicsRef = useRef<HTMLDivElement>(null);

  const paramValue = searchParams.get("to");

  const dispatch = useAppDispatch();

  let mathLevel: number = currentUser?.points
    ? currentUser.points / 100
    : 0 / 100;

  const level = Math.floor(mathLevel);
  let progress: number = 0;

  if (Number.isInteger(mathLevel)) {
    progress = mathLevel * 0;
  } else {
    progress = Number(mathLevel?.toString().slice(-1).concat("0"));
  }

  const numReferredUsers = statistics.filter(
    (item) => item.type === "REFERRER"
  ).length;
  const numCopletedTasks = statistics.filter(
    (item) => item.type === "GUESS-CARD" || item.type === "QUIZ-APP"
  ).length;

  useEffect(() => {
    const getStatistics = async () => {
      try {
        const response = await makeRequest.get("api/notifications");
        setStatistics(response.data);
      } catch (error) {
        console.log(error);
        dispatch(
          showPopup({ status: true, message: "failed to fetch statistics" })
        );
      }
    };
    getStatistics();
  }, [currentUser]);

  const changeFrame = async (frameObject: TypeFrame) => {
    if (!currentUser) {
      return;
    }
    try {
      const response = await makeRequest.get(
        `api/users/changephotoframe/${frameObject._id}`
      );
      dispatch(setCurrentUser({ ...currentUser, activeFrame: response.data }));
      dispatch(
        showPopup({
          status: true,
          message: "Changed Successfully",
          icon: <BsCheckCircleFill />,
        })
      );
    } catch (err) {
      dispatch(
        showPopup({
          status: true,
          message: "Failing to Change Your Frame. somthing went wrong",
          icon: <BsExclamationOctagonFill />,
        })
      );
    }
  };

  const unselectPhotoFrame = async () => {
    if (!currentUser) {
      return;
    }
    try {
      const response = await makeRequest.get(
        "api/users/unselectuserphotoframe"
      );
      if (response.status === 200) {
        dispatch(setCurrentUser({ ...currentUser, activeFrame: null }));
      }
      dispatch(
        showPopup({
          status: true,
          message: "unselected Successfully",
          icon: <BsCheckCircleFill />,
        })
      );
    } catch (error) {
      console.log(error);
      dispatch(
        showPopup({
          status: true,
          message: "Failing to Unselect Frame, try again",
          icon: <BsExclamationOctagonFill />,
        })
      );
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(inputeRef);
    dispatch(
      showPopup({
        status: true,
        message: "Copied Successfully",
        icon: <BsCheckCircleFill />,
      })
    );
  };

  useEffect(() => {
    if (currentUser)
      setInputRef(`https://make4free.netlify.app/?ref=${currentUser._id}`);
  }, [currentUser]);

  useEffect(() => {
    if (paramValue === "frames") {
      framesRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      framesRef.current?.classList.add("animate-pulse");
      return () => framesRef.current?.classList.remove("animate-pulse");
    } else if (paramValue === "musics") {
      musicsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      musicsRef.current?.classList.add("animate-pulse");
      return () => musicsRef.current?.classList.remove("animate-pulse");
    } else if (paramValue === "referrallink") {
      referralLinkRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      referralLinkRef.current?.classList.add("animate-pulse");
      return () => referralLinkRef.current?.classList.remove("animate-pulse");
    }
  }, [paramValue]);

  const handleClickLinkDiv = (type: string) => {
    if (type === "referrallink") {
      referralLinkRef.current?.classList.remove("animate-pulse");
    } else if (type === "frames") {
      framesRef.current?.classList.remove("animate-pulse");
    } else if (type === "musics") {
      musicsRef.current?.classList.remove("animate-pulse");
    }
    setSearchParams(() => {
      searchParams.delete("to", type);
      return searchParams;
    });
  };

  const handleOpenSetting = () => {
    dispatch(
      openModel({
        status: true,
        children: <ProfileSettings />,
      })
    );
  };

  return (
    <div className="bg-[#141523] py-6 sm:pt-3 min-h-[100vh] sm:min-h-[50vh] flex items-center justify-center w-full">
      {!currentUser ? (
        <div className="text-xl text-[#fccece] flex items-center justify-center h-full">
          Login To View Your Profile
        </div>
      ) : (
        <div className="bg-[#141523] w-full">
          <div className="w-[95%] lg:w-[95%] mx-auto sm:w-[95%]">
            <div className="flex items-center justify-between px-4 mb-5">
              <span className="text-2xl sm:text-xl font-bold text-[#8df174]">
                My Profile
              </span>
              <button
                onClick={handleOpenSetting}
                className="flex items-center gap-2 text-[#8df174] font-bold text-xl tracking-wider"
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
                    <span className="flex items-center gap-4 sm:gap-2 ">
                      <img
                        alt={""}
                        src={egypt}
                        className="w-5 h-5 rounded-md sm:w-3 sm:h-3 "
                      />
                      <span className="sm:text-sm text-[#f75887ee]">EGYPT</span>
                    </span>
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
                          ? 100 -
                            Number(currentUser.points?.toString().slice(1))
                          : 100 - (currentUser.points ? currentUser.points : 0)
                      } Points to reach level ${level + 1}`}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" flex flex-col gap-4 w-[49%] sm:w-[98%] h-[180px] sm:h-[170px] rounded-lg bg-[#222339] justify-center  ">
                <h1 className="text-xl underline sm:text-[16px] font-bold text-[#9ddf53] pl-5 ">
                  Statistics
                </h1>
                <div className="flex flex-wrap justify-between mx-6  sm:mx-auto lg:mx-3 w-[90%] ">
                  <div className="flex items-center gap-2 w-[49%] sm:w-[49%]">
                    <div className="w-10 h-10 lg:w-9 lg:h-9 sm:w-[29px] sm:h-[29px]  rounded-lg bg-[#be914cb7] flex items-center justify-center">
                      <BiTask className="w-8 h-8 lg:w-6 lg:h-6 sm:w-[17px] sm:h-[17px] " />
                    </div>
                    <div className="flex flex-col ">
                      <span className="font-bold text-gray-300">
                        {numCopletedTasks || 0}
                      </span>
                      <span className="text-sm sm:text-[11px] lg:text-xs text-[#b1b07f]">
                        completed Tasks
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-[49%] sm:w-[49%]">
                    <div className="w-10 h-10 lg:w-9 lg:h-9 sm:w-[29px] sm:h-[29px] rounded-lg bg-[#be914cb7] flex items-center justify-center">
                      <BsFillClockFill className="w-8 h-8 lg:w-6 lg:h-6 sm:w-[17px] sm:h-[17px] " />
                    </div>
                    <div className="flex flex-col ">
                      <span className="font-bold text-gray-300">
                        {currentUser.points}
                      </span>
                      <span className="text-sm sm:text-[11px] lg:text-xs text-[#b1b07f]">
                        Earnings last 30 days
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2  w-[49%] sm:w-[49%]  mt-4">
                    <div className="w-10 h-10 lg:w-9 lg:h-9 sm:w-[29px] sm:h-[29px] rounded-lg bg-[#be914cb7] flex items-center justify-center">
                      <MdAutoAwesomeMosaic className="w-8 h-8 lg:w-6 lg:h-6 sm:w-[17px] sm:h-[17px] " />
                    </div>
                    <div className="flex flex-col  ">
                      <span className="font-bold text-gray-300">
                        {currentUser.points}
                      </span>
                      <span className="text-sm sm:text-[11px] lg:text-xs text-[#b1b07f]">
                        Total Earnings
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-[49%] sm:w-[49%] mt-4 ">
                    <div className="w-10 h-10 lg:w-9 lg:h-9 sm:w-[29px] sm:h-[29px] rounded-lg bg-[#be914cb7] flex items-center justify-center">
                      <FaUsers className="w-8 h-8 lg:w-6 lg:h-6 sm:w-[17px] sm:h-[17px] " />
                    </div>
                    <div className="flex flex-col ">
                      <span className="font-bold text-gray-300">
                        {numReferredUsers || 0}
                      </span>
                      <span className="text-sm sm:text-[11px] lg:text-xs text-[#b1b07f]">
                        Users Referred
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => handleClickLinkDiv("referrallink")}
              ref={referralLinkRef}
              className="w-full bg-slate-700 rounded-md py-2 px-4 sm:px-2 sm:mx-auto flex flex-col gap-2 my-7"
            >
              <div className="flex items-center sm:gap-2 justify-between sm:flex-col">
                <p className=" font-bold text-[#55df8a]">Your Referral Link</p>
                <div className=" bg-[#1f2742] w-[50%] lg:w-[70%] sm:w-full rounded-sm px-2 flex items-center gap-1">
                  <input
                    type="text"
                    name="referrallink"
                    className="bg-[#1b243fcb] outline-none w-full text-gray-400 py-1"
                    readOnly={true}
                    value={inputeRef}
                  />
                  <span
                    onClick={copyReferralLink}
                    className="relative w-[15%] h-5 flex items-center justify-center"
                  >
                    <RiFileCopyLine className="text-xl " />
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#26e6ffee] text-center">
                Each Person Sign In through your Referral Link Instantly you get
                100 points as a Reward
              </p>
            </div>
            <div
              onClick={() => handleClickLinkDiv("frames")}
              ref={framesRef}
              className=" mt-5 flex flex-col gap-3 items-center justify-center  bg-[#222339] rounded-md "
            >
              <span className="text-[#7dec73] font-bold ">Change My Frame</span>
              <div
                className={`w-full grid grid-cols-5 lg:grid-cols-4 sm:grid-cols-4 xs:grid-cols-3 gap-2 p-3 `}
              >
                {currentUser?.myFrames.length > 0 &&
                  currentUser?.myFrames?.map((item: TypeFrame) => {
                    return (
                      <div
                        key={item._id}
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
              {currentUser.myFrames.length <= 0 ? (
                <div className="flex flex-col items-center justify-center mb-5 mx-auto ">
                  <img alt={""} src={empty} />
                  <span className="text-gray-400 tracking-wider font-bold my-4 sm:text-sm ">
                    Empty
                  </span>
                  <span className="text-gray-400 tracking-wider sm:text-sm ">
                    {`You Have No Burshased Frames Right Now`}
                  </span>
                </div>
              ) : undefined}
            </div>
            <div
              onClick={() => handleClickLinkDiv("musics")}
              ref={musicsRef}
              className=" w-full mt-5 bg-[#222339] py-2 rounded-md"
            >
              <h1 className="text-[#a0e965ee] font-bold text-center my-4">
                My Musics
              </h1>
              <div className="grid grid-cols-8 xl:grid-cols-6 lg:grid-cols-5 sm:grid-cols-4 xs:grid-cols-2 gap-2 p-4">
                {songs.length &&
                  songs
                    .filter((item) => {
                      if (currentUser?.mySongs?.includes(item.id.toString())) {
                        return item;
                      }
                    })
                    .map((element) => (
                      <MusicCard key={element.id} songDetails={element} />
                    ))}
              </div>
              {currentUser?.mySongs?.length === 0 && (
                <div className="flex flex-col items-center justify-center mb-5 mx-auto">
                  <img alt={""} src={empty} />
                  <span className="text-gray-400 tracking-wider font-bold my-4 sm:text-sm ">
                    Empty
                  </span>
                  <span className="text-gray-400 tracking-wider sm:text-sm text-center ">
                    {`You Have No Burshased Musics Right Now`}
                  </span>
                </div>
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
              <BsFillExclamationOctagonFill />
              <p className="text-md text-[#a19bad]">
                Reach the next Tier to earn a higher commission from your
                affiliates.
              </p>
            </div>
            <div className="mt-7 flex items-center flex-wrap gap-4 justify-center">
              {[...Array(20).keys()].map((item) => (
                <div
                  key={item}
                  className="w-[350px] h-[180px] lg:w-[310px] sm:w-[360px]  p-4 rounded-lg bg-[#1c1e2e]"
                >
                  <div className="flex justify-between items-center py-4 mb-4 border-b border-[#635a5a]">
                    <div className="flex items-center gap-3 text-gray-300 font-bold ">
                      <RiNumbersFill /> Tier 2
                    </div>
                    <span className=" text-gray-300 text-sm">
                      7% Commissions
                    </span>
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
              <p className="text-gray-400 ">
                These are our top affiliate earners.
              </p>
            </div>
            <div className="flex gap-10 justify-center mt-20 sm:gap-3">
              <div className="relative">
                <img
                  alt={""}
                  src={rank2Desktop}
                  className="w-52 h-60 sm:h-48"
                />
                <span className="absolute bottom-[25%] left-[33%] text-lg font-bold text-gray-200">
                  $53.052
                </span>
              </div>
              <div className="relative mt-[-5%]">
                <img
                  alt={""}
                  src={rank1Desktop}
                  className="w-52 h-60 sm:h-48"
                />
                <span className="absolute bottom-[35%] left-[33%] text-lg font-bold text-gray-200">
                  $85.642
                </span>
              </div>
              <div className="relative">
                <img
                  alt={""}
                  src={rank3Desktop}
                  className="w-52 h-60 sm:h-48"
                />
                <span className="absolute bottom-[25%] left-[33%] text-lg font-bold text-gray-200">
                  $20.940
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
