import { memo, useRef } from "react";
import { DiAndroid } from "react-icons/di";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoDesktop } from "react-icons/io5";
import { SiApple } from "react-icons/si";
import { IFilterByDevice } from "../../types/earnTypes";
import { useClickOutside } from "../../hooks";
import { useTranslation } from "react-i18next";

interface IProps {
  filterByDevice: IFilterByDevice;
  handleCloseFilterByDevice: (open: boolean) => void;
  activeFilterByDevice: (item: IFilterByDevice) => void;
}

const FilterByDeviceMenu = memo(
  ({ handleCloseFilterByDevice, filterByDevice, activeFilterByDevice }: IProps) => {
    const { t } = useTranslation("earn");
    const filterByDeviceRef = useRef<HTMLDivElement | null>(null);

    useClickOutside(filterByDeviceRef, () => handleCloseFilterByDevice(false));

    return (
      <div
        ref={filterByDeviceRef}
        className={`absolute right-0 top-12 z-[1] flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-[#3c4053] bg-[#161033] p-1 sm:p-2`}
      >
        <div
          onClick={() => activeFilterByDevice("ALL")}
          className={`${filterByDevice === "ALL" ? "bg-[#3d34647e]" : ""} flex w-full items-center justify-between rounded-sm p-2 sm:p-1`}
        >
          <div className="flex items-center gap-3">
            <GiHamburgerMenu className="text-lg" />

            <span className="text-gray-400">{t("ALL DEVICES")}</span>
          </div>
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border border-gray-400 p-[2px]`}
          >
            <span
              className={`${filterByDevice === "ALL" && "bg-[#43da63]"} h-full w-full rounded-full`}
            ></span>
          </span>
        </div>
        <div
          onClick={() => activeFilterByDevice("DESKTOP")}
          className={`${filterByDevice === "DESKTOP" ? "bg-[#3d34647e]" : ""} flex w-full items-center justify-between rounded-sm p-2 sm:p-1`}
        >
          <div className="flex items-center gap-3">
            <IoDesktop className="text-lg" />
            <span className="text-gray-400">{t("DESKTOP")}</span>
          </div>
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border border-gray-400 p-[2px]`}
          >
            <span
              className={`${filterByDevice === "DESKTOP" && "bg-[#43da63]"} h-full w-full rounded-full`}
            ></span>
          </span>
        </div>
        <div
          onClick={() => activeFilterByDevice("ANDROID")}
          className={`${filterByDevice === "ANDROID" ? "bg-[#3d34647e]" : ""} flex w-full items-center justify-between rounded-sm p-2 sm:p-1`}
        >
          <div className="flex items-center gap-3">
            <DiAndroid className="text-lg" />
            <span className="text-gray-400">{t("ANDROID")}</span>
          </div>
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border border-gray-400 p-[2px]`}
          >
            <span
              className={`${filterByDevice === "ANDROID" && "bg-[#43da63]"} h-full w-full rounded-full`}
            ></span>
          </span>
        </div>
        <div
          onClick={() => activeFilterByDevice("MAC")}
          className={`${filterByDevice === "MAC" ? "bg-[#3d34647e]" : ""} flex w-full items-center justify-between rounded-sm p-2 sm:p-1`}
        >
          <div className="flex items-center gap-3">
            <SiApple className="text-lg" />
            <span className="text-gray-400">{t("MAC")}</span>
          </div>
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border border-gray-400 p-[2px]`}
          >
            <span
              className={`${filterByDevice === "MAC" && "bg-[#43da63]"} h-full w-full rounded-full`}
            ></span>
          </span>
        </div>
      </div>
    );
  },
);

export default FilterByDeviceMenu;
