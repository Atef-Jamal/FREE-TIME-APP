import { MouseEvent, useEffect, useRef, useState } from "react";
import { SiApple } from "react-icons/si";
import { ImFire } from "react-icons/im";
import { IoDesktop, IoFilter } from "react-icons/io5";
import { DiAndroid } from "react-icons/di";
import { notikLogo, tapresearch, AdscendMediaGlow } from "../assets";
import { IoIosArrowBack, IoMdArrowDropdown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useAppSelector } from "../context/Hooks";
import { arrayoffers } from "../helper/data";
import { TypeFilterByPopularity, TypeFilterByDevice } from "../types/earnTypes";
import Spinner from "../components/Others/Spinner";
import TaskDetail from "../components/Earn/TaskDetail";
import AppSkeleton from "../components/Earn/TaskSkeleton";
import ParnterCard from "../components/Earn/ParnterCard";
import TaskCard from "../components/Earn/TaskCard";
import { useScrollToElement } from "../hooks";
import Empty from "../components/Others/Empty";
import SearchBar from "../components/Search/SearchBar";
import { FaCaretDown } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";
import FilterByDeviceMenu from "../components/Earn/FilterByDeviceMenu";
import FilterByPopularityMenu from "../components/Earn/FilterByPopularityMenu";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllTasks } from "../utils";

const Earn = () => {
  const resizeSidebare = useAppSelector((state) => state.stateManeger.resizeSidebare);
  const [translate, setTranslate] = useState("");
  const [selectDevice, setSelectDevice] = useState(false);
  const [openFilterByPopularityMenu, setOpenFilterByPopularityMenu] = useState(false);
  const limitPerPage = 15;
  const [taskId, setTaskId] = useState<string | null>(null);
  const [filterByPopularity, setFilterByPopularity] = useState<TypeFilterByPopularity>("ALL");
  const [filterByDevice, setFilterByDevice] = useState<TypeFilterByDevice>("ALL");
  const [searchParams] = useSearchParams();
  const { t } = useTranslation("earn");

  const allDevicesRef = useRef<HTMLDivElement | null>(null);
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const androidRef = useRef<HTMLDivElement | null>(null);
  const macRef = useRef<HTMLDivElement | null>(null);

  const allRef = useRef<HTMLSpanElement | null>(null);
  const popularRef = useRef<HTMLSpanElement | null>(null);
  const heighestRewardRef = useRef<HTMLSpanElement | null>(null);
  const heighestRatingRef = useRef<HTMLSpanElement | null>(null);

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: ["tasks", filterByDevice, filterByPopularity, limitPerPage],
    queryFn: ({ pageParam }) =>
      fetchAllTasks({
        filterByDevice,
        filterByPopularity,
        limitPerPage,
        pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });

  const allTasks = data?.pages.map((page) => page.tasks).flat();

  useScrollToElement({ dependencies: [allTasks?.length] });

  useEffect(() => {
    if (!taskId) return;
    setTranslate("-translate-x-[50%]");
    const timout = setTimeout(() => {
      window.scrollTo({
        top: window.innerWidth < 500 ? 155 : window.innerWidth < 867 ? 110 : 0,
      });
    }, 500);
    return () => clearTimeout(timout);
  }, [taskId]);

  useEffect(() => {
    const appIdFromUrlSearchParam = searchParams.get("to");
    if (appIdFromUrlSearchParam && allTasks && allTasks.length > 0) {
      const isExistInAppList = allTasks.find((task) => task._id === appIdFromUrlSearchParam);
      const isAppDetailOpen = translate === "-translate-x-[50%]";
      if (isExistInAppList && !isAppDetailOpen) return;
      setTaskId(appIdFromUrlSearchParam);
    }
  }, [searchParams, allTasks, translate]);

  const selectApp = () => {
    setTranslate("-translate-x-[0%]");
  };

  const activeFilterByPopularity = (
    e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>,
    type: TypeFilterByPopularity,
  ) => {
    [allRef, popularRef, heighestRewardRef, heighestRatingRef].forEach((item) =>
      item.current?.classList.remove("bg-[#3d34647e]"),
    );
    e.currentTarget.classList.add("bg-[#3d34647e]");
    setFilterByPopularity(type);
    refetch();
  };

  const activeFilterByDevice = (
    e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>,
    type: TypeFilterByDevice,
  ) => {
    [allDevicesRef, desktopRef, androidRef, macRef].forEach((item) =>
      item.current?.classList.remove("bg-[#3d34647e]"),
    );
    e.currentTarget.classList.add("bg-[#3d34647e]");
    setFilterByDevice(type);
    refetch();
  };

  const next = () => {
    if (translate === "-translate-x-[0%]") return;
    setTranslate("-translate-x-[0%]");
    setTimeout(() => {
      setTaskId(null);
    }, 1000);
  };

  const prev = () => {
    if (translate === "-translate-x-[50%]") return;
    setTranslate("-translate-x-[50%]");
  };

  return (
    <div className="flex flex-col p-4 lg:p-3 xs:p-2 gap-4 bg-[#21223a]">
      <div className="flex items-ceneter sm:flex-col sm:gap-1 gap-2">
        <div className="relative w-[40%] sm:w-full">
          <div className=" flex justify-between overflow-hidden">
            <span className="text-gray-300 text-2xl font-bold flex items-center whitespace-nowrap mr-1">
              <span className="mr-1 text-[#bedf65]">{t("EARN")}</span> {t("ON")}
            </span>
            <div
              onClick={() => setSelectDevice((prev) => !prev)}
              className="flex items-center justify-center gap-4 lg:gap-2 bg-[#0b0b22a9] rounded-md w-[200px] sm:py-2 sm:px-4 py-[11px] px-6 lg:px-4 cursor-pointer"
            >
              {filterByDevice === "ALL" && (
                <>
                  <IoDesktop className="text-lg" />
                  <DiAndroid className="text-lg" />
                  <SiApple className="text-lg" />
                </>
              )}
              {filterByDevice === "DESKTOP" && <IoDesktop className="text-lg" />}
              {filterByDevice === "ANDROID" && <DiAndroid className="text-lg" />}
              {filterByDevice === "MAC" && <SiApple className="text-lg" />}
              <FaCaretDown className="text-lg ml-auto" />
            </div>
          </div>
          {selectDevice && (
            <FilterByDeviceMenu
              allDevicesRef={allDevicesRef}
              androidRef={androidRef}
              desktopRef={desktopRef}
              macRef={macRef}
              filterByDevice={filterByDevice}
              setSelectDevice={setSelectDevice}
              activeFilterByDevice={activeFilterByDevice}
            />
          )}
        </div>
        <div className="relative w-[60%] gap-2 sm:w-full ">
          <div className="flex xs:flex-col items-center gap-2 justify-between">
            <div className="w-full h-10  rounded-md overflow-hidden">
              <SearchBar placeholder={t("search apps and offers...")} onChange={() => {}} />
            </div>
            <div
              onClick={() => setOpenFilterByPopularityMenu((prev) => !prev)}
              className="relative w-full max-w-[300px] xs:max-w-full flex items-center justify-evenly  bg-[#30304b] rounded-lg py-2 sm:gap-1 cursor-pointer"
            >
              <IoFilter />
              <span className="text-gray-400 font-bold">{t(filterByPopularity)}</span>
              <IoMdArrowDropdown className="text-2xl" />
            </div>
          </div>
          {openFilterByPopularityMenu && (
            <FilterByPopularityMenu
              allRef={allRef}
              activeFilterByPopularity={activeFilterByPopularity}
              setOpenFilterByPopularityMenu={setOpenFilterByPopularityMenu}
              heighestRatingRef={heighestRatingRef}
              popularRef={popularRef}
              heighestRewardRef={heighestRewardRef}
            />
          )}
        </div>
      </div>
      <div className=" bg-[#1c1e31] p-4 rounded-xl flex flex-col gap-5 xs:px-2 overflow-x-hidden border border-gray-800">
        <div className="flex xs:flex-col justify-between ">
          <div className="flex items-center gap-3">
            <ImFire className="text-xl" />
            <h1 className="text-[#8a9fff] text-xl font-bold sm:text-lg">{t("FEATURED OFFERS")}</h1>
          </div>
          <div className="flex items-center gap-3 justify-end">
            <button onClick={next} className="px-4 py-2 sm:py-1 bg-[#85ac3e] rounded-md ">
              <IoIosArrowBack className="text-xl" />
            </button>
            <button onClick={prev} className="px-4 py-2 sm:py-1 bg-[#85ac3e] rounded-md">
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
              {status === "pending" && [...Array(21).keys()].map((item) => <AppSkeleton key={item} />)}

              {data?.pages.map((page) =>
                page.tasks.map((taskDetail, inedx) => (
                  <TaskCard
                    taskDetail={taskDetail}
                    setTaskId={setTaskId}
                    key={taskDetail._id}
                    index={inedx}
                  />
                )),
              )}
            </div>

            {status === "error" && !isFetchNextPageError && (
              <p className="py-10 font-bold text-center text-[#e45e3c]">{error.response?.data.error}</p>
            )}

            {isFetchingNextPage && (
              <div className="mt-4">
                <Spinner className="w-8 h-8 border-[3px] border-b-yellow-400 border-l-yellow-400 mx-auto" />
              </div>
            )}

            {status === "success" && allTasks && allTasks.length === 0 && (
              <Empty emptyText={t("No Apps Matches your Filter Query")} />
            )}

            {!isFetchingNextPage && isFetchNextPageError && (
              <p className="font-bold text-[#e45e3c] text-center">An Error Occurred During Loading More !</p>
            )}

            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                className="w-full text-center py-1 mt-4 font-[600] tracking-wider text-[#c2c2f5] rounded-sm bg-[#6069857e]"
              >
                {t("Load More")}
              </button>
            )}
          </div>
          <div className={`bg-[#1c1e31] w-[50%] `}>
            <div className=" w-[50%] sm:w-full max-w-[500px] mx-auto">
              {taskId && <TaskDetail taskId={taskId} />}
              {!taskId && (
                <button
                  onClick={selectApp}
                  className="w-[90%] max-w-[500px] p-5 mt-5 text-gray-500 underline text-xl font-bold"
                >
                  {t("select an app to preview")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3">
          <ImFire className="text-2xl" />
          <h1 className="text-xl font-bold text-[#8a9fff]">{t("OFFER PARTNERS")}</h1>
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
          <h1 className="text-xl font-bold text-[#8a9fff]">{t("SURVEY PARTNERS")}</h1>
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
