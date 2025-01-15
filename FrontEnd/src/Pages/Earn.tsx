import { useCallback, useEffect, useState } from "react";
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
import { cn } from "../utils/common";

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
  // const filterByDeviceRef = useRef<HTMLDivElement | null>(null);
  // const filterByPopularityRef = useRef<HTMLDivElement | null>(null);

  const { t } = useTranslation("earn");

  const { status, data, error, isFetchingNextPage, fetchNextPage, hasNextPage, isFetchNextPageError } =
    useInfiniteQuery({
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
      staleTime: 60 * 60 * 1000,
    });

  const allTasks = data?.pages.map((page) => page.tasks).flat();

  useScrollToElement({ dependencies: [allTasks?.length] });

  useEffect(() => {
    if (!taskId) return;
    setTranslate("-translate-x-[50%]");
    const timout = setTimeout(() => {
      window.scrollTo({
        top: window.innerWidth < 500 ? 155 : window.innerWidth < 1024 ? 110 : 0,
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

  const activeFilterByPopularity = useCallback((type: TypeFilterByPopularity) => {
    setFilterByPopularity(type);
  }, []);

  const activeFilterByDevice = useCallback((type: TypeFilterByDevice) => {
    setFilterByDevice(type);
  }, []);

  const handleCloseFilterByPopularityMenu = useCallback((open: boolean) => {
    setOpenFilterByPopularityMenu(open);
  }, []);

  const handleCloseFilterByDevice = useCallback((open: boolean) => {
    setSelectDevice(open);
  }, []);

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
    <div className="flex flex-col gap-4 bg-[#21223a] p-2 md:p-4">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <div className="relative flex items-center justify-between">
          <span className="mr-1 flex items-center whitespace-nowrap text-2xl font-bold text-gray-300">
            <span className="mr-1 text-[#bedf65]">{t("EARN")}</span> {t("ON")}
          </span>
          <div
            onClick={() => setSelectDevice((prev) => !prev)}
            className="flex cursor-pointer items-center justify-around gap-4 rounded-md bg-[#0b0b22a9] px-4 py-3 lg:px-6"
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
            <FaCaretDown className="text-lg" />
          </div>
          {selectDevice && (
            <FilterByDeviceMenu
              handleCloseFilterByDevice={handleCloseFilterByDevice}
              filterByDevice={filterByDevice}
              activeFilterByDevice={activeFilterByDevice}
            />
          )}
        </div>

        <div className="h-10 w-full overflow-hidden rounded-md">
          <SearchBar placeholder={t("search apps and offers...")} onChange={() => {}} />
        </div>
        <div className="relative">
          <div
            onClick={() => setOpenFilterByPopularityMenu((prev) => !prev)}
            className="relative flex cursor-pointer items-center justify-evenly rounded-lg bg-[#30304b] py-2 sm:gap-1"
          >
            <IoFilter />
            <span className="font-bold text-gray-400">{t(filterByPopularity)}</span>
            <IoMdArrowDropdown className="text-2xl" />
          </div>
          {openFilterByPopularityMenu && (
            <FilterByPopularityMenu
              filterByPopularity={filterByPopularity}
              activeFilterByPopularity={activeFilterByPopularity}
              handleCloseFilterByPopularityMenu={handleCloseFilterByPopularityMenu}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-x-hidden rounded-xl border border-gray-800 bg-[#1c1e31] px-2 py-4 md:px-4">
        <div className="flex flex-wrap justify-between gap-y-2">
          <div className="flex items-center gap-3">
            <ImFire className="text-xl" />
            <h1 className="text-lg font-bold text-[#8a9fff] lg:text-xl">{t("FEATURED OFFERS")}</h1>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button onClick={next} className="rounded-md bg-[#85ac3e] px-4 py-2 sm:py-1">
              <IoIosArrowBack className="text-xl" />
            </button>
            <button onClick={prev} className="rounded-md bg-[#85ac3e] px-4 py-2 sm:py-1">
              <IoIosArrowForward className="text-xl" />
            </button>
          </div>
        </div>
        <div
          className={`${translate} flex w-[207%] gap-4 bg-[#1c1e31] transition-all duration-300 ease-in-out`}
        >
          <div className="w-[48%]">
            <div
              className={cn(
                "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5",
                resizeSidebare
                  ? "lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9"
                  : "lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8",
              )}
            >
              {status === "pending" && [...Array(50).keys()].map((item) => <AppSkeleton key={item} />)}

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
              <p className="py-10 text-center font-bold text-[#e45e3c]">{error.response?.data.error}</p>
            )}

            {isFetchingNextPage && (
              <div className="mt-4">
                <Spinner className="mx-auto h-8 w-8 border-[3px] border-b-yellow-400 border-l-yellow-400" />
              </div>
            )}

            {status === "success" && allTasks && allTasks.length === 0 && (
              <Empty emptyText={t("No Apps Matches your Filter Query")} />
            )}

            {!isFetchingNextPage && isFetchNextPageError && (
              <p className="text-center font-bold text-[#e45e3c]">An Error Occurred During Loading More !</p>
            )}

            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                className="mt-4 w-full rounded-sm bg-[#6069857e] py-1 text-center font-[600] tracking-wider text-[#c2c2f5]"
              >
                {t("Load More")}
              </button>
            )}
          </div>
          <div className={`w-[50%] bg-[#1c1e31]`}>
            <div className="mx-auto w-full max-w-[500px] pr-4 lg:w-[50%]">
              {taskId && <TaskDetail taskId={taskId} />}
              {!taskId && (
                <button
                  onClick={selectApp}
                  className="mt-5 w-[90%] max-w-[500px] p-5 text-xl font-bold text-gray-500 underline"
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
        <div className="xs:gap-2 mt-4 flex flex-wrap items-center justify-center gap-3">
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
        <div className="xs:gap-2 mt-4 flex flex-wrap justify-center gap-3">
          {[notikLogo, AdscendMediaGlow, tapresearch].map((item) => (
            <ParnterCard key={item} image={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Earn;
