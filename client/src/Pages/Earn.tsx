import { useEffect, useRef, useState } from "react";
import { SiApple, SiFirewalla } from "react-icons/si";
import { ImFire } from "react-icons/im";
import { IoDesktop } from "react-icons/io5";
import { DiAndroid } from "react-icons/di";
import {
  notikLogo,
  tapresearch,
  AdscendMediaGlow,
  empty,
  // guessColor,
} from "../assets";
import { PiExamDuotone } from "react-icons/pi";
import { IoStar } from "react-icons/io5";
import {
  IoIosArrowBack,
  IoIosStarOutline,
  IoMdArrowDropdown,
  IoMdArrowDropup,
  IoMdSearch,
  IoMdStar,
} from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import {
  arrayoffers,
  // tasks
} from "../helper/data";
import { Helmet } from "react-helmet-async";
import { handleApiError, makeRequest } from "../utils";
import GameCard from "../components/Offers/GameCard";
import OfferParnterCard from "../components/Offers/OfferParnterCard";
import Skeleton from "../components/Others/Skeleton";
import { showPopup } from "../context/StateManeger";
import { BiErrorAlt } from "react-icons/bi";
import { FaHeart, FaRegArrowAltCircleDown, FaStar } from "react-icons/fa";
import { TypeTaskApp } from "../types/others";
import Spinner from "../components/Others/Spinner";
import { Link } from "react-router-dom";
import { VscExpandAll } from "react-icons/vsc";

const Earn = () => {
  const { resizeSidebare } = useAppSelector((state) => state.stateManeger);
  const [translate, setTranslate] = useState("");
  const [selectDevice, setSelectDevice] = useState(false);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [noMoreTasks, setNoMoreTasks] = useState(false);
  const [filterQuery, setFilterQuery] = useState<
    "ALL" | "POPULAR" | "RAITING" | "REWARD"
  >("ALL");
  const [limit] = useState<number>(18);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fetchedApps, setFetchedApps] = useState<TypeTaskApp[]>([]);
  const [appDetail, setAppDetail] = useState<TypeTaskApp | null>(null);
  const dispatch = useAppDispatch();

  const allRef = useRef<HTMLSpanElement>(null);
  const androidRef = useRef<HTMLSpanElement>(null);
  const desktopRef = useRef<HTMLSpanElement>(null);
  const iosRef = useRef<HTMLSpanElement>(null);

  const selectApp = () => {
    setTranslate("-translate-x-[0%]");
  };

  useEffect(() => {
    if (appDetail !== null) {
      setTranslate("-translate-x-[50%]");
      const timout = setTimeout(() => {
        window.scrollTo({
          top:
            window.innerWidth < 500 ? 180 : window.innerWidth < 867 ? 130 : 0,
        });
      }, 500);
      return () => clearTimeout(timout);
    }
  }, [appDetail]);

  const activeFilteringItem = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    type: "ALL" | "POPULAR" | "RAITING" | "REWARD"
  ) => {
    [allRef, androidRef, desktopRef, iosRef].forEach((item) =>
      item.current?.classList.remove("bg-[#4d3f72]")
    );
    e.currentTarget.classList.add("bg-[#4d3f72]");
    setFilterQuery(type);
  };

  useEffect(() => {
    const fetchApps = async () => {
      if (!loadingApps) setLoadingApps(true);
      try {
        const response: { data: { apps: TypeTaskApp[]; noApps: boolean } } =
          await makeRequest.get(
            `api/tasks?filter=${filterQuery}&&page=${currentPage}&&limitedPerPage=${limit}`
          );

        setNoMoreTasks(response.data.noApps);

        const sorted = response.data.apps.sort((a, b) => {
          if (a.completedBy.length > b.completedBy.length) {
            return -1;
          }
          return 1;
        });
        setFetchedApps(sorted);
      } catch (error) {
        dispatch(
          showPopup({
            status: true,
            message: handleApiError(error),
            icon: <BiErrorAlt />,
          })
        );
      } finally {
        setLoadingApps(false);
      }
    };
    fetchApps();
  }, [filterQuery]);

  const fetchMoreApps = async () => {
    setLoadMore(true);
    try {
      const response = await makeRequest.get(
        `api/tasks?page=${currentPage + 1}&&limitedPerPage=${limit}`
      );
      if (response.data.noApps) {
        setNoMoreTasks(true);
      }
      setFetchedApps((prev) => [...prev, ...response.data.apps]);
      setCurrentPage((prev) => prev + 1);
    } catch (error) {
    } finally {
      setLoadMore(false);
    }
  };

  const next = () => {
    if (translate === "-translate-x-[0%]") return;
    setTranslate("-translate-x-[0%]");
    setAppDetail(null);
  };

  const prev = () => {
    if (translate === "-translate-x-[50%]") return;
    setTranslate("-translate-x-[50%]");
  };

  return (
    <div className="flex flex-col p-4 lg:p-3 xs:p-2 xs:py-6 gap-4 bg-[#21223a]">
      <Helmet>
        <title>Earn</title>
      </Helmet>
      <div className="flex items-ceneter flex-wrap gap-2">
        <span className="text-gray-300 text-2xl font-bold flex items-center whitespace-nowrap">
          <span className="mr-1 text-[#bedf65]">EARN</span> ON
        </span>
        <div className=" flex items-center gap-3 bg-[#0b0b22a9] rounded-md px-6 py-2">
          <IoDesktop className="text-lg" />
          <DiAndroid className="text-lg" />
          <SiApple className="text-lg" />
        </div>
        <div className="relative sm:w-[280px]">
          <input
            type="text"
            className="w-full h-10 rounded-md bg-[#383847] outline-none pl-4 pr-[53px] py-2 text-sm tracking-wide text-[#72abff]"
            placeholder="Search"
          />
          <button className="absolute top-0 right-0 rounded-md bg-[#9486866c] px-3 h-[95%]">
            <IoMdSearch className="text-xl" />
          </button>
        </div>
        <div
          onClick={() => setSelectDevice((prev) => !prev)}
          className="relative w-[280px] flex items-center justify-evenly  bg-[#30304b] rounded-lg py-2  sm:gap-1"
        >
          <FaStar />
          <span className="text-gray-400 font-bold">{filterQuery}</span>
          {selectDevice ? (
            <IoMdArrowDropup className="text-2xl" />
          ) : (
            <IoMdArrowDropdown className="text-2xl" />
          )}
          {selectDevice && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-11 z-[1] left-0 bg-[#37354b] w-full flex flex-col py-3 px-1 rounded-md"
            >
              <span
                onClick={() => setSelectDevice(false)}
                className="absolute top-1 right-2 px-2 rounded-md bg-slate-600"
              >
                x
              </span>
              <span
                onClick={(e) => activeFilteringItem(e, "ALL")}
                ref={allRef}
                className="text-gray-300 flex items-center gap-4 p-2 rounded-sm"
              >
                <VscExpandAll />
                All
              </span>
              <span
                onClick={(e) => activeFilteringItem(e, "REWARD")}
                ref={androidRef}
                className="text-gray-300 flex items-center gap-4 p-2 rounded-sm"
              >
                <SiFirewalla />
                Highest Reward
              </span>
              <span
                onClick={(e) => activeFilteringItem(e, "POPULAR")}
                ref={iosRef}
                className="text-gray-300 flex items-center gap-4 p-2 rounded-sm"
              >
                <FaHeart />
                Most Popular
              </span>
              <span
                onClick={(e) => activeFilteringItem(e, "RAITING")}
                ref={desktopRef}
                className="text-gray-300 flex items-center gap-4 p-2 rounded-sm "
              >
                <FaStar /> Highest Rating
              </span>
            </div>
          )}
        </div>
      </div>
      <div className=" bg-[#1c1e31] p-4 rounded-xl flex flex-col gap-5 xs:px-2 overflow-x-hidden border border-gray-800">
        <div className="flex justify-between ">
          <div className="flex items-center gap-3">
            <ImFire className="text-xl" />
            <h1 className="text-[#8a9fff] text-xl font-bold sm:text-lg">
              Featured Offers
            </h1>
          </div>
          <div className="flex items-center gap-3 ">
            <button
              onClick={next}
              className="px-4 py-2 sm:py-1 bg-[#85ac3e] rounded-md "
            >
              <IoIosArrowBack className="text-xl" />
            </button>
            <button
              onClick={prev}
              className="px-4 py-2 sm:py-1 bg-[#85ac3e] rounded-md"
            >
              <IoIosArrowForward className="text-xl" />
            </button>
          </div>
        </div>
        <div
          className={`${translate} bg-[#1c1e31] transition-all duration-500 ease-in flex  gap-4 w-[200%] `}
        >
          <div className="w-[50%]">
            <div
              className={`w-fll border-gray-500 ${
                resizeSidebare
                  ? "grid grid-cols-8 xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-4 xs:grid-cols-2"
                  : "grid grid-cols-7 xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-3 xs:grid-cols-2"
              } gap-3 xs:gap-2 bg-[#1c1e31] h-fit`}
            >
              {loadingApps &&
                [...Array(21).keys()].map((i) => (
                  <div
                    key={i}
                    className="h-[250px] p-3 rounded-md flex flex-col items-center justify-between bg-[#2a244481] border border-gray-700"
                  >
                    <Skeleton className="h-[120px] w-full" />
                    <div className="w-full flex flex-col gap-1 ">
                      <div className="w-full flex items-center justify-between">
                        <Skeleton className="w-[60%] h-[13px] " />
                        <Skeleton className="w-[35%] h-[13px] " />
                      </div>
                      <Skeleton className="w-full h-[18px]" />
                    </div>
                    <div className="w-full flex flex-col items-center gap-1">
                      <Skeleton className="h-[12px] w-full" />
                    </div>
                    <div className="w-full flex items-center justify-between">
                      <Skeleton className="w-[35%] h-[22px]" />
                      <Skeleton className="w-[60%] h-[22px]" />
                    </div>
                  </div>
                ))}
              {fetchedApps.length > 0 &&
                fetchedApps.map((taskDetail, i) => {
                  return (
                    <GameCard
                      taskDetail={taskDetail}
                      setAppDetail={setAppDetail}
                      key={taskDetail._id}
                      index={i}
                    />
                  );
                })}
            </div>
            {loadMore && (
              <div className="mt-4">
                <Spinner className="w-8 h-8 border-[3px] border-b-yellow-400 border-l-yellow-400 mx-auto" />
              </div>
            )}
            {!noMoreTasks && (
              <button
                onClick={fetchMoreApps}
                className="w-full text-center py-1 mt-4 font-[600] tracking-wider text-[#c2c2f5] rounded-sm bg-[#6069857e]"
              >
                Load More
              </button>
            )}
            {fetchedApps.length === 0 && (
              <div className="opacity-40 w-full h-[300px] flex flex-col items-center justify-center gap-2">
                <img
                  src={empty}
                  alt=""
                  className="w-12 h-12 object-cover object-center"
                />{" "}
                <p>No Apps Matches your Filter Query</p>{" "}
              </div>
            )}
          </div>
          <div className={`bg-[#1c1e31] w-[50%] `}>
            <div className=" w-[50%] sm:w-full max-w-[500px] mt-5 mx-auto">
              {appDetail && <AppDetail appDetail={appDetail} />}
              {!appDetail && (
                <button
                  onClick={selectApp}
                  className="w-[90%] max-w-[500px] p-5 mt-5 text-gray-500 underline text-xl font-bold"
                >
                  select an app to preview
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex gap-3 pl-2 my-8">
          <ImFire />
          <h1 className="text-2xl font-bold  text-white">Offer Partners</h1>
          <PiExamDuotone />
        </div>
        <div className="flex gap-3 flex-wrap ml-4">
          {arrayoffers.map(({ image, title }, index) => (
            <OfferParnterCard key={index} image={image} title={title} />
          ))}
        </div>
      </div>
      <div>
        <div className="flex gap-3 pl-2 my-8">
          <ImFire />
          <h1 className="text-2xl font-bold  text-white">Survey Partners</h1>
          <PiExamDuotone />
        </div>
        <div className="flex gap-3 flex-wrap ml-4">
          {[notikLogo, AdscendMediaGlow, tapresearch, tapresearch].map(
            (item, i) => (
              <div
                key={item + i}
                className="relative bg-gradient-to-b from-[#34353f] to-[#41425c] rounded-lg flex flex-col justify-center px-2 h-56 gap-6"
              >
                <img alt={""} src={item} className="w-24 h-12" />
                <p className="text-white font-bold tracking-wide ">BitLaps</p>
                <div className="flex gap-1 ">
                  <IoStar />
                  <IoStar />
                  <IoStar />
                  <IoStar />
                  <IoStar />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Earn;

const AppDetail = ({ appDetail }: { appDetail: TypeTaskApp }) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [expandUsers, setExpandUsers] = useState(false);
  const isCompleted = currentUser?.completedTasks.includes(appDetail._id);

  const notActiveStars = 5 - appDetail.rating;

  return (
    <>
      <h1 className="text-2xl font-bold text-[#78bd4f] text-center mb-4">
        App Details
      </h1>
      <div className="w-full flex flex-col items-center justify-center gap-3 sm:gap-1">
        <span className="w-full text-[#b9a3a3]">
          <span className="mr-2 text-[#73f1a8]">Name :</span> {appDetail?.title}
        </span>
        <span className="w-full text-[#b9a3a3]">
          <span className="mr-2 text-[#73f1a8]">Description :</span>
          {appDetail?.description}
        </span>
        <div
          onClick={() => setExpandUsers((prev) => !prev)}
          className="w-full bg-[#230d259f] rounded-md flex item.center justify-between pr-2 py-[3px]"
        >
          <span className="text-[#73f1a8]">People who completed this app</span>
          <FaRegArrowAltCircleDown className="opacity-50 text-xl" />
        </div>
        <div
          className={`w-full transition-all flex flex-col gap-1  ${
            expandUsers ? "p-1" : "overflow-hidden h-0 p-0"
          }`}
        >
          {appDetail.completedBy.length === 0 && (
            <span className="text-gray-400 text-sm block w-full text-center">
              No one complete this app before
            </span>
          )}
          {appDetail.completedBy.length > 0 &&
            appDetail.completedBy.map((item) => (
              <Link
                key={item._id}
                to={`/user/${item._id}`}
                className="text-gray-400 text-sm block underline "
              >
                {item.name}
              </Link>
            ))}
        </div>
        <span className="flex items-center gap-3 w-full text-[#73f1a8]">
          Rating :
          <span className="flex items-center justify-center gap-1">
            {[...Array(appDetail.rating).keys()].map((item) => (
              <IoMdStar key={item} />
            ))}
            {[...Array(notActiveStars).keys()].map((item) => (
              <IoIosStarOutline key={item} />
            ))}
          </span>
        </span>
        <span className="text-[#73f1a8] flex items-center gap-3 w-full">
          Reward :
          <span className="text-[#6676ff]">{appDetail.prize} Points</span>
        </span>
        {isCompleted && (
          <button
            className={`w-full py-2 sm:text-xs bg-[#171430d5] text-sm text-white rounded-md border border-gray-700`}
          >
            Completed
          </button>
        )}
        {!isCompleted && appDetail.isAvailable === "AVAILABLE" && (
          <Link
            to={`/playing/${appDetail._id}`}
            className={`bg-[#a4ec52cc] w-full py-2  sm:text-xs text-sm font-bold rounded-md text-center`}
          >
            START NOW
          </Link>
        )}
        {appDetail.isAvailable === "UNAVAILABLE" && (
          <button
            className={`bg-[#528feccc] w-full py-2  sm:text-xs text-sm font-bold rounded-md text-center`}
          >
            Not Available
          </button>
        )}
      </div>
    </>
  );
};
