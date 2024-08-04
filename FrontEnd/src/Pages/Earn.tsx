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
import { Helmet } from "react-helmet-async";
import { TypeFilterQuery } from "../types/earnTypes";
import Spinner from "../components/Others/Spinner";
import { useFetchAllApps } from "../hooks";
import AppDetail from "../components/Earn/AppDetail";
import AppSkeleton from "../components/Earn/AppSkeleton";
import ParnterCard from "../components/Earn/ParnterCard";
import AppCard from "../components/Earn/AppCard";
import { useScrollToElement } from "../hooks/commonHooks";
import Empty from "../components/Others/Empty";
import SearchBar from "../components/Search/SearchBar";
import { FaCaretDown } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";
import FilterByDeviceMenu from "../components/Earn/FilterByDeviceMenu";
import FilteringMenu from "../components/Earn/FilteringMenu";
import { useTranslation } from "react-i18next";

const Earn = () => {
  const { resizeSidebare } = useAppSelector((state) => state.stateManeger);
  const [translate, setTranslate] = useState("");
  const [selectDevice, setSelectDevice] = useState(false);
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [page, setPage] = useState<number>(1);
  const limitPerPage = 20;
  const [appId, setAppId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState<TypeFilterQuery>("ALL");
  const [searchParams] = useSearchParams();
  const { t } = useTranslation("earn");

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
    if (!appId) return;
    setTranslate("-translate-x-[50%]");
    const timout = setTimeout(() => {
      window.scrollTo({
        top: window.innerWidth < 500 ? 155 : window.innerWidth < 867 ? 110 : 0,
      });
    }, 500);
    return () => clearTimeout(timout);
  }, [appId]);

  useEffect(() => {
    const appIdFromUrlSearchParam = searchParams.get("to");

    if (appIdFromUrlSearchParam && apps.length > 0) {
      const isExistInAppList = apps.find(
        (app) => app._id === appIdFromUrlSearchParam
      );
      const isAppDetailOpen = translate === "-translate-x-[50%]";
      if (isExistInAppList && !isAppDetailOpen) return;
      setAppId(appIdFromUrlSearchParam);
    }
  }, [searchParams, apps]);

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
    setTimeout(() => {
      setAppId(null);
    }, 1000);
  };

  const prev = () => {
    if (translate === "-translate-x-[50%]") return;
    setTranslate("-translate-x-[50%]");
  };

  return (
    <div className="flex flex-col p-4 lg:p-3 xs:p-2 gap-4 bg-[#21223a]">
      <Helmet>
        <title>{t("Earn")}</title>
      </Helmet>
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
              <IoDesktop className="text-lg" />
              <DiAndroid className="text-lg" />
              <SiApple className="text-lg" />
              <FaCaretDown className="text-lg ml-auto" />
            </div>
          </div>
          {selectDevice && (
            <FilterByDeviceMenu
              allDevicesRef={allDevicesRef}
              androidRef={androidRef}
              desktopRef={desktopRef}
              macRef={macRef}
              filterQuery={filterQuery}
              setSelectDevice={setSelectDevice}
              activeFilteringItem={activeFilteringItem}
            />
          )}
        </div>
        <div className="relative w-[60%] gap-2 sm:w-full ">
          <div className="flex xs:flex-col items-center gap-2 justify-between">
            <div className="w-full h-10  rounded-md overflow-hidden">
              <SearchBar
                placeholder={t("search apps and offers...")}
                onChange={() => {}}
              />
            </div>
            <div
              onClick={() => setOpenFilterMenu((prev) => !prev)}
              className="relative w-full max-w-[300px] xs:max-w-full flex items-center justify-evenly  bg-[#30304b] rounded-lg py-2 sm:gap-1 cursor-pointer"
            >
              <IoFilter />
              <span className="text-gray-400 font-bold">
                {["ALL", "POPULAR", "RAITING", "REWARD"].includes(filterQuery)
                  ? t(filterQuery)
                  : t("ALL")}
              </span>
              <IoMdArrowDropdown className="text-2xl" />
            </div>
          </div>
          {openFilterMenu && (
            <FilteringMenu
              allRef={allRef}
              activeFilteringItem={activeFilteringItem}
              setOpenFilterMenu={setOpenFilterMenu}
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
            <h1 className="text-[#8a9fff] text-xl font-bold sm:text-lg">
              {t("FEATURED OFFERS")}
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
                      setAppId={setAppId}
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
            {!loading && apps.length === 0 && !error && (
              <Empty emptyText={t("No Apps Matches your Filter Query")} />
            )}
            {errorLoadMore && (
              <span className="text-sm text-[#4b9734] mx-auto">
                {errorLoadMore}
              </span>
            )}
            {!noMoreApps && !error && (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="w-full text-center py-1 mt-4 font-[600] tracking-wider text-[#c2c2f5] rounded-sm bg-[#6069857e]"
              >
                {t("Load More")}
              </button>
            )}
          </div>
          <div className={`bg-[#1c1e31] w-[50%] `}>
            <div className=" w-[50%] sm:w-full max-w-[500px] mx-auto">
              {appId && <AppDetail appId={appId} />}
              {!appId && (
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
          <h1 className="text-xl font-bold text-[#8a9fff]">
            {t("OFFER PARTNERS")}
          </h1>
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
          <h1 className="text-xl font-bold text-[#8a9fff]">
            {t("SURVEY PARTNERS")}
          </h1>
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
