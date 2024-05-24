import { MouseEvent, useEffect, useRef, useState } from "react";
import { SiApple, SiFirewalla } from "react-icons/si";
import { ImFire } from "react-icons/im";
import { IoDesktop, IoFilter } from "react-icons/io5";
import { DiAndroid } from "react-icons/di";
import { notikLogo, tapresearch, AdscendMediaGlow } from "../assets";
import { IoIosArrowBack, IoMdArrowDropdown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useAppSelector } from "../context/Hooks";
import { arrayoffers } from "../helper/data";
import { Helmet } from "react-helmet-async";
import { FaHeart, FaStar } from "react-icons/fa";
import { TypeFilterQuery, TypeTaskApp } from "../types/earnTypes";
import Spinner from "../components/Others/Spinner";
import { VscExpandAll } from "react-icons/vsc";
import { useCloseMenuOnClickOutSideListener, useFetchAllApps } from "../hooks";
import AppDetail from "../components/Earn/AppDetail";
import AppSkeleton from "../components/Earn/AppSkeleton";
import ParnterCard from "../components/Earn/ParnterCard";
import AppCard from "../components/Earn/AppCard";
import { useScrollToElement } from "../hooks/commonHooks";
import Empty from "../components/Others/Empty";
import SearchBar from "../components/Search/SearchBar";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaCaretDown } from "react-icons/fa6";
import { CgClose } from "react-icons/cg";

const Earn = () => {
  const { resizeSidebare } = useAppSelector((state) => state.stateManeger);

  const [translate, setTranslate] = useState("");
  const [selectDevice, setSelectDevice] = useState(false);
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [page, setPage] = useState<number>(1);
  const limitPerPage = 20;
  const [appDetail, setAppDetail] = useState<TypeTaskApp | null>(null);
  const [filterQuery, setFilterQuery] = useState<TypeFilterQuery>("ALL");

  const deviceMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const allDevicesRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const androidRef = useRef<HTMLDivElement>(null);
  const macRef = useRef<HTMLDivElement>(null);

  const allRef = useRef<HTMLSpanElement>(null);
  const popularRef = useRef<HTMLSpanElement>(null);
  const heighestRewardRef = useRef<HTMLSpanElement>(null);
  const heighestRatingRef = useRef<HTMLSpanElement>(null);

  const { loading, apps, error, loadMore, noMoreApps, errorLoadMore } =
    useFetchAllApps({
      filterQuery,
      limitPerPage,
      page,
    });

  useScrollToElement([apps]);

  useEffect(() => {
    if (appDetail !== null) {
      setTranslate("-translate-x-[50%]");
      const timout = setTimeout(() => {
        window.scrollTo({
          top:
            window.innerWidth < 500 ? 155 : window.innerWidth < 867 ? 110 : 0,
        });
      }, 500);
      return () => clearTimeout(timout);
    }
  }, [appDetail]);

  useCloseMenuOnClickOutSideListener({
    menuRef: filterMenuRef,
    onClose: () => setOpenFilterMenu(false),
  });

  useCloseMenuOnClickOutSideListener({
    menuRef: deviceMenuRef,
    onClose: () => setSelectDevice(false),
  });

  const selectApp = () => {
    setTranslate("-translate-x-[0%]");
  };

  const activeFilteringItem = (
    e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>,
    type: TypeFilterQuery
  ) => {
    [
      allDevicesRef,
      allRef,
      heighestRewardRef,
      popularRef,
      heighestRatingRef,
      desktopRef,
      androidRef,
      macRef,
    ].forEach((item) => item.current?.classList.remove("bg-[#3d34647e]"));
    e.currentTarget.classList.add("bg-[#3d34647e]");
    setFilterQuery(type);
    setPage(1);
  };

  const next = () => {
    if (translate === "-translate-x-[0%]") return;
    setTranslate("-translate-x-[0%]");
    const timeout = setTimeout(() => {
      setAppDetail(null);
    }, 1000);
    return () => clearTimeout(timeout);
  };

  const prev = () => {
    if (translate === "-translate-x-[50%]") return;
    setTranslate("-translate-x-[50%]");
  };

  return (
    <div className="flex flex-col p-4 lg:p-3 xs:p-2 gap-4 bg-[#21223a]">
      <Helmet>
        <title>Earn</title>
      </Helmet>
      <div className="flex items-ceneter sm:flex-col sm:gap-1 gap-2">
        <div className="relative w-[40%] sm:w-full">
          <div className=" flex justify-between">
            <span className="text-gray-300 text-2xl font-bold flex items-center whitespace-nowrap mr-1">
              <span className="mr-1 text-[#bedf65]">EARN</span> ON
            </span>
            <div
              ref={deviceMenuRef}
              onClick={() => setSelectDevice((prev) => !prev)}
              className="flex items-center justify-center gap-4 lg:gap-2 bg-[#0b0b22a9] rounded-md w-[200px] sm:py-2 sm:px-4 py-[11px] px-6 lg:px-4 cursor-pointer"
            >
              <IoDesktop className="text-lg" />
              <DiAndroid className="text-lg" />
              <SiApple className="text-lg" />
              <FaCaretDown className="text-lg ml-auto" />
            </div>
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            className={`transition-shadow ${
              selectDevice
                ? "border border-[#3c4053] p-2 xs:p-1"
                : "overflow-hidden p-0 h-0"
            } sm:relative ml-auto absolute right-0 z-[1] w-[200px] xs:w-full bg-[#161033] rounded-md mt-1 flex flex-col items-center justify-center cursor-pointer`}
          >
            <div
              ref={allDevicesRef}
              onClick={(e) => activeFilteringItem(e, "ALL")}
              className={` w-full flex items-center justify-between p-2 sm:p-1  rounded-sm`}
            >
              <div className="flex items-center gap-3">
                <GiHamburgerMenu className="text-lg" />

                <span className="text-gray-400">ALL DEVICES</span>
              </div>
              <span
                className={`w-5 h-5 p-[2px] rounded-full border border-gray-400 flex items-center justify-center`}
              >
                <span
                  className={`${
                    filterQuery === "ALL" && "bg-[#43da63]"
                  } w-full h-full rounded-full`}
                ></span>
              </span>
            </div>
            <div
              ref={desktopRef}
              onClick={(e) => activeFilteringItem(e, "DESKTOP")}
              className={` w-full flex items-center justify-between p-2 sm:p-1 rounded-sm`}
            >
              <div className="flex items-center gap-3">
                <IoDesktop className="text-lg" />
                <span className="text-gray-400">DESKTOP</span>
              </div>
              <span
                className={`w-5 h-5 p-[2px] rounded-full border border-gray-400 flex items-center justify-center`}
              >
                <span
                  className={`${
                    filterQuery === "DESKTOP" && "bg-[#43da63]"
                  } w-full h-full rounded-full`}
                ></span>
              </span>
            </div>
            <div
              ref={androidRef}
              onClick={(e) => activeFilteringItem(e, "ANDROID")}
              className={`w-full flex items-center justify-between p-2 sm:p-1 rounded-sm`}
            >
              <div className="flex items-center gap-3">
                <DiAndroid className="text-lg" />
                <span className="text-gray-400">ANDROID</span>
              </div>
              <span
                className={`w-5 h-5 p-[2px] rounded-full border border-gray-400 flex items-center justify-center`}
              >
                <span
                  className={`${
                    filterQuery === "ANDROID" && "bg-[#43da63]"
                  } w-full h-full rounded-full`}
                ></span>
              </span>
            </div>
            <div
              ref={macRef}
              onClick={(e) => activeFilteringItem(e, "MAC")}
              className={` w-full flex items-center justify-between p-2 sm:p-1 rounded-sm`}
            >
              <div className="flex items-center gap-3">
                <SiApple className="text-lg" />
                <span className="text-gray-400">MAC</span>
              </div>
              <span
                className={`w-5 h-5 p-[2px] rounded-full border border-gray-400 flex items-center justify-center`}
              >
                <span
                  className={`${
                    filterQuery === "MAC" && "bg-[#43da63]"
                  } w-full h-full rounded-full`}
                ></span>
              </span>
            </div>
          </div>
        </div>
        <div className="relative w-[60%] gap-2 sm:w-full ">
          <div className="flex xs:flex-col items-center gap-2 justify-between">
            <div className="w-full h-10  rounded-md overflow-hidden">
              <SearchBar
                placeholder="search apps and offers..."
                onChange={() => {}}
              />
            </div>
            <div
              onClick={() => setOpenFilterMenu((prev) => !prev)}
              ref={filterMenuRef}
              className="relative w-full max-w-[300px] xs:max-w-full flex items-center justify-evenly  bg-[#30304b] rounded-lg py-2 sm:gap-1 cursor-pointer"
            >
              <IoFilter />
              <span className="text-gray-400 font-bold">
                {["ALL", "POPULAR", "RAITING", "REWARD"].includes(filterQuery)
                  ? filterQuery
                  : "ALL"}
              </span>
              <IoMdArrowDropdown className="text-2xl" />
            </div>
          </div>
          {openFilterMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="sm:relative absolute top-9 sm:top-0 right-0 z-[2] w-[300px] xs:w-full h- ml-auto mt-2 p-1 border border-gray-700 bg-[#2f2f38] flex flex-col rounded-md cursor-pointer"
            >
              <span
                onClick={() => setOpenFilterMenu(false)}
                className="absolute top-0 right-0  rounded-sm ml-auto p-2"
              >
                <CgClose className="text-xl" />
              </span>
              <span
                onClick={(e) => activeFilteringItem(e, "ALL")}
                ref={allRef}
                className="text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold"
              >
                <VscExpandAll className="text-lg" />
                All
              </span>
              <span
                onClick={(e) => activeFilteringItem(e, "REWARD")}
                ref={heighestRewardRef}
                className="text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold"
              >
                <SiFirewalla className="text-lg" />
                Highest Reward
              </span>
              <span
                onClick={(e) => activeFilteringItem(e, "POPULAR")}
                ref={popularRef}
                className="text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold"
              >
                <FaHeart className="text-lg" />
                Most Popular
              </span>
              <span
                onClick={(e) => activeFilteringItem(e, "RAITING")}
                ref={heighestRatingRef}
                className="text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold"
              >
                <FaStar className="text-lg" /> Highest Rating
              </span>
            </div>
          )}
        </div>
      </div>
      <div className=" bg-[#1c1e31] p-4 rounded-xl flex flex-col gap-5 xs:px-2 overflow-x-hidden border border-gray-800">
        <div className="flex xs:flex-col justify-between ">
          <div className="flex items-center gap-3">
            <ImFire className="text-xl" />
            <h1 className="text-[#8a9fff] text-xl font-bold sm:text-lg">
              FEATURED OFFERS
            </h1>
          </div>
          <div className="flex items-center gap-3 justify-end">
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
              {loading &&
                [...Array(21).keys()].map((item) => <AppSkeleton key={item} />)}

              {!error &&
                !loading &&
                apps.map((taskDetail, i) => {
                  return (
                    <AppCard
                      taskDetail={taskDetail}
                      setAppDetail={setAppDetail}
                      key={taskDetail._id}
                      index={i}
                    />
                  );
                })}
            </div>
            {error && (
              <div className="w-full h-full flex items-center justify-center text-[#2d9435]">
                {error}
              </div>
            )}
            {loadMore && (
              <div className="mt-4">
                <Spinner className="w-8 h-8 border-[3px] border-b-yellow-400 border-l-yellow-400 mx-auto" />
              </div>
            )}
            {!loading && apps.length === 0 && (
              <Empty
                emptyText="No Apps Matches your Filter Query"
                imgWidthHeight=""
              />
            )}
            {errorLoadMore && (
              <span className="text-sm text-[#4b9734] mx-auto">
                {errorLoadMore}
              </span>
            )}
            {!noMoreApps && (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="w-full text-center py-1 mt-4 font-[600] tracking-wider text-[#c2c2f5] rounded-sm bg-[#6069857e]"
              >
                Load More
              </button>
            )}
          </div>
          <div className={`bg-[#1c1e31] w-[50%] `}>
            <div className=" w-[50%] sm:w-full max-w-[500px] mx-auto">
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
        <div className="flex items-center gap-3">
          <ImFire className="text-2xl" />
          <h1 className="text-xl font-bold text-[#8a9fff]">OFFER PARTNERS</h1>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 xs:gap-2 mt-4">
          {arrayoffers.map(({ image }, index) => (
            <ParnterCard key={index} image={image} />
          ))}
        </div>
      </div>
      <div className="mt-5">
        <div className="flex items-center gap-3">
          <ImFire className="text-2xl" />
          <h1 className="text-xl font-bold text-[#8a9fff]">SURVEY PARTNERS</h1>
        </div>
        <div className="flex justify-center gap-3  xs:gap-2  flex-wrap mt-4">
          {[notikLogo, AdscendMediaGlow, tapresearch].map((item) => (
            <ParnterCard key={item} image={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Earn;
