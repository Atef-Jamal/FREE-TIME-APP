import { MouseEvent, useEffect, useRef, useState } from "react";
import { SiApple, SiFirewalla } from "react-icons/si";
import { ImFire } from "react-icons/im";
import { IoDesktop, IoFilter } from "react-icons/io5";
import { DiAndroid } from "react-icons/di";
import { notikLogo, tapresearch, AdscendMediaGlow } from "../assets";
import { IoIosArrowBack, IoMdArrowDropdown, IoMdSearch } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useAppSelector } from "../context/Hooks";
import { arrayoffers } from "../helper/data";
import { Helmet } from "react-helmet-async";
import { makeRequest } from "../utils";
import { FaHeart, FaStar } from "react-icons/fa";
import { TypeTaskApp } from "../types/earn";
import Spinner from "../components/Others/Spinner";
import { VscExpandAll } from "react-icons/vsc";
import { useCloseMenuOnClickOutSide, useFetchAllApps } from "../hooks";
import AppDetail from "../components/Earn/AppDetail";
import AppSkeleton from "../components/Earn/AppSkeleton";
import ParnterCard from "../components/Earn/ParnterCard";
import AppCard from "../components/Earn/AppCard";
import { useScrollToElement } from "../hooks/common";
import Empty from "../components/Others/Empty";

const Earn = () => {
  const { resizeSidebare } = useAppSelector((state) => state.stateManeger);
  const [translate, setTranslate] = useState("");
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [noMoreTasks, setNoMoreTasks] = useState(false);
  const [filterQuery, setFilterQuery] = useState<
    "ALL" | "POPULAR" | "RAITING" | "REWARD"
  >("ALL");
  const [limit] = useState<number>(18);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [appDetail, setAppDetail] = useState<TypeTaskApp | null>(null);

  const filterMenuRef = useRef<HTMLDivElement>(null);
  const allRef = useRef<HTMLSpanElement>(null);
  const androidRef = useRef<HTMLSpanElement>(null);
  const desktopRef = useRef<HTMLSpanElement>(null);
  const iosRef = useRef<HTMLSpanElement>(null);

  const { apps, setApps, loading, error } = useFetchAllApps({
    filterQuery,
    limit,
    setNoMoreTasks,
    dependencies: [filterQuery],
    initialLoading: true,
  });

  useScrollToElement([apps]);

  const fetchMoreApps = async () => {
    setLoadMore(true);
    try {
      const response = await makeRequest.get(
        `api/tasks?page=${currentPage + 1}&&limitedPerPage=${limit}`
      );
      setNoMoreTasks(response.data.noApps);
      setApps((prev) => [...prev, ...response.data.apps]);
      setCurrentPage((prev) => prev + 1);
    } catch (error) {
    } finally {
      setLoadMore(false);
    }
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

  useCloseMenuOnClickOutSide({
    menuRef: filterMenuRef,
    onClose: () => setOpenFilterMenu(false),
  });

  const selectApp = () => {
    setTranslate("-translate-x-[0%]");
  };

  const activeFilteringItem = (
    e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>,
    type: "ALL" | "POPULAR" | "RAITING" | "REWARD"
  ) => {
    [allRef, androidRef, desktopRef, iosRef].forEach((item) =>
      item.current?.classList.remove("bg-[#4d3f72]")
    );
    e.currentTarget.classList.add("bg-[#4d3f72]");
    setFilterQuery(type);
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
    <div className="flex flex-col p-4 lg:p-3 xs:p-2 gap-4 bg-[#21223a]">
      <Helmet>
        <title>Earn</title>
      </Helmet>
      <div className="flex items-ceneter sm:flex-col gap-2">
        <div className="flex justify-between w-[35%] sm:w-full">
          <span className="text-gray-300 text-2xl font-bold flex items-center whitespace-nowrap">
            <span className="mr-1 text-[#bedf65]">EARN</span> ON
          </span>
          <div className=" flex items-center gap-4 bg-[#0b0b22a9] rounded-md px-8 py-2">
            <IoDesktop className="text-lg" />
            <DiAndroid className="text-lg" />
            <SiApple className="text-lg" />
          </div>
        </div>
        <div className="flex xs:flex-col justify-between w-[65%] gap-2 sm:w-full ">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full h-10 rounded-md bg-[#383847] outline-none pl-4 pr-[53px] py-2 xs:text-sm tracking-wide text-[#72abff]"
              placeholder="Search"
            />
            <button className="absolute top-0 right-0 rounded-md bg-[#9486866c] px-3 h-[95%]">
              <IoMdSearch className="text-xl" />
            </button>
          </div>
          <div
            onClick={() => setOpenFilterMenu((prev) => !prev)}
            ref={filterMenuRef}
            className="relative w-full max-w-[300px] xs:max-w-full flex items-center justify-evenly  bg-[#30304b] rounded-lg py-2  sm:gap-1"
          >
            <IoFilter />
            <span className="text-gray-400 font-bold">{filterQuery}</span>
            <IoMdArrowDropdown className="text-2xl" />
            {openFilterMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-11 z-[1] left-0 bg-[#37354b] w-full flex flex-col py-3 px-1 rounded-md"
              >
                <span
                  onClick={() => setOpenFilterMenu(false)}
                  className="absolute top-[2px] right-[2px] px-3 rounded-sm bg-[#555050c4]"
                >
                  x
                </span>
                <span
                  onClick={(e) => activeFilteringItem(e, "ALL")}
                  ref={allRef}
                  className="text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold"
                >
                  <VscExpandAll />
                  All
                </span>
                <span
                  onClick={(e) => activeFilteringItem(e, "REWARD")}
                  ref={androidRef}
                  className="text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold"
                >
                  <SiFirewalla />
                  Highest Reward
                </span>
                <span
                  onClick={(e) => activeFilteringItem(e, "POPULAR")}
                  ref={iosRef}
                  className="text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold"
                >
                  <FaHeart />
                  Most Popular
                </span>
                <span
                  onClick={(e) => activeFilteringItem(e, "RAITING")}
                  ref={desktopRef}
                  className="text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold"
                >
                  <FaStar /> Highest Rating
                </span>
              </div>
            )}
          </div>
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

              {apps.map((taskDetail, i) => {
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
              <div className="w-full h-full flex items-center justify-center">
                {error}
              </div>
            )}
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
            {apps.length === 0 && (
              <Empty
                emptyText="No Apps Matches your Filter Query"
                imgWidthHeight=""
              />
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
