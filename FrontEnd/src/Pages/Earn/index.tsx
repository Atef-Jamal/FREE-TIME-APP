import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SiApple } from "react-icons/si";
import { ImFire } from "react-icons/im";
import { IoDesktop, IoFilter } from "react-icons/io5";
import { DiAndroid } from "react-icons/di";
import { FaCaretDown } from "react-icons/fa6";
import { IoIosArrowBack, IoMdArrowDropdown } from "react-icons/io";
import { notikLogo, tapresearch, AdscendMediaGlow } from "../../assets";
import { IoIosArrowForward } from "react-icons/io";
import { useAppSelector } from "../../context/hooks";
import { arrayoffers } from "../../helper/data";
import type { IFilterByPopularity, IFilterByDevice } from "../../types";
import OfferDetails from "./OfferDetails";
import OfferSkeleton from "./OfferSkeleton";
import ParnterCard from "./ParnterCard";
import OfferCard from "./OfferCard";
import { useScrollToElement } from "../../hooks/useScrollToElement";
import { useSearchParams } from "react-router-dom";
import FilterByDeviceMenu from "./FilterByDeviceMenu";
import FilterByPopularityMenu from "./FilterByPopularityMenu";
import { cn } from "../../utilities";
import SearchBar from "../../components/Shared/Modals/SearchModal/SearchBar";
import Spinner from "../../components/Shared/Common/Spinner";
import Empty from "../../components/Shared/Common/Empty";
import { useInfiniteTasks } from "../../tanstackQuery/queryFetch";
import { selectSidebarCollapsed } from "../../context/appStateSlice";

const Earn = () => {
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const [translate, setTranslate] = useState("");
  const [selectDevice, setSelectDevice] = useState(false);
  const [openFilterByPopularityMenu, setOpenFilterByPopularityMenu] = useState(false);
  const limitPerPage = 15;
  const [offerId, setOfferId] = useState<string | null>(null);
  const [filterByPopularity, setFilterByPopularity] = useState<IFilterByPopularity>("ALL");
  const [filterByDevice, setFilterByDevice] = useState<IFilterByDevice>("ALL");
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("earn");

  useEffect(() => {
    if (!offerId) return;
    setTranslate("-translate-x-[50%]");
    const timout = setTimeout(() => {
      window.scrollTo({
        top: window.innerWidth < 500 ? 155 : window.innerWidth < 1024 ? 110 : 0,
      });
    }, 500);
    return () => clearTimeout(timout);
  }, [offerId]);

  const selectApp = () => {
    setTranslate("-translate-x-[0%]");
  };

  const activeFilterByPopularity = useCallback((type: IFilterByPopularity) => {
    setFilterByPopularity(type);
  }, []);

  const activeFilterByDevice = useCallback((type: IFilterByDevice) => {
    setFilterByDevice(type);
  }, []);

  const handleCloseFilterByPopularityMenu = useCallback((open: boolean) => {
    setOpenFilterByPopularityMenu(open);
  }, []);

  const handleCloseFilterByDevice = useCallback((open: boolean) => {
    setSelectDevice(open);
  }, []);

  const goToAppDetailSection = useCallback(() => {
    const appIdFromUrlSearchParam = searchParams.get("to");
    setOfferId(appIdFromUrlSearchParam);
    setTimeout(() => {
      setSearchParams((prev) => {
        prev.delete("to");
        return prev;
      });
    }, 2000);
  }, [searchParams, setSearchParams]);

  const next = () => {
    if (translate === "-translate-x-[0%]") return;
    setTranslate("-translate-x-[0%]");
  };

  const prev = () => {
    if (translate === "-translate-x-[50%]") return;
    setTranslate("-translate-x-[50%]");
  };

  const { status, data, error, isFetchingNextPage, fetchNextPage, hasNextPage, isFetchNextPageError } =
    useInfiniteTasks({ filterByDevice, filterByPopularity, limitPerPage });

  useScrollToElement({
    startScroll: status === "success",
    callback: goToAppDetailSection,
  });
  const allTasks = data?.pages.map((page) => page.offers).flat();

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
          className={cn(
            "flex w-[207%] gap-4 bg-[#1c1e31] transition-all duration-300 ease-in-out",
            translate,
          )}
        >
          <div className="w-[48%]">
            <div
              className={cn(
                "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5",
                sidebarCollapsed
                  ? "lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9"
                  : "lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8",
              )}
            >
              {status === "pending" && [...Array(50).keys()].map((item) => <OfferSkeleton key={item} />)}

              {allTasks?.map((offerDetails, inedx) => (
                <OfferCard
                  offerDetails={offerDetails}
                  setOfferId={setOfferId}
                  key={offerDetails._id}
                  index={inedx}
                />
              ))}
            </div>

            {status === "error" && !isFetchNextPageError && (
              <p className="py-10 text-center font-bold text-[#e45e3c]">{error.response?.data.error}</p>
            )}

            {isFetchingNextPage && (
              <div className="mt-4 flex items-center justify-center">
                <Spinner className="h-8 w-8" />
              </div>
            )}

            {status === "success" && allTasks && allTasks.length === 0 && (
              <Empty text={t("no offers matches your Filter Query")} />
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
              {offerId && <OfferDetails offerId={offerId} />}
              {!offerId && (
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
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:gap-3">
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
        <div className="mt-4 flex flex-wrap justify-center gap-2 md:gap-3">
          {[notikLogo, AdscendMediaGlow, tapresearch].map((item) => (
            <ParnterCard key={item} image={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Earn;
