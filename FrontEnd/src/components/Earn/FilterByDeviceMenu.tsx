import { memo, useRef } from "react";
import { DiAndroid } from "react-icons/di";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoDesktop } from "react-icons/io5";
import { SiApple } from "react-icons/si";
import { TypeFilterByDevice } from "../../types/earnTypes";
import { useClickOutside } from "../../hooks";
import { useTranslation } from "react-i18next";

interface TypeProps {
  filterByDevice: TypeFilterByDevice;
  handleCloseFilterByDevice: (open: boolean) => void;
  activeFilterByDevice: (item: TypeFilterByDevice) => void;
}

const FilterByDeviceMenu = memo(
  ({ handleCloseFilterByDevice, filterByDevice, activeFilterByDevice }: TypeProps) => {
    const { t } = useTranslation("earn");
    const filterByDeviceRef = useRef<HTMLDivElement | null>(null);

    useClickOutside(filterByDeviceRef, () => handleCloseFilterByDevice(false));

    return (
      <div
        ref={filterByDeviceRef}
        className={`border border-[#3c4053] p-2 xs:p-1 sm:relative ml-auto absolute right-0 z-[1] w-[200px] sm:w-full bg-[#161033] rounded-md mt-1 flex flex-col items-center justify-center cursor-pointer`}
      >
        <div
          onClick={() => activeFilterByDevice("ALL")}
          className={`${filterByDevice === "ALL" ? "bg-[#3d34647e]" : ""} w-full flex items-center justify-between p-2 sm:p-1 rounded-sm`}
        >
          <div className="flex items-center gap-3">
            <GiHamburgerMenu className="text-lg" />

            <span className="text-gray-400">{t("ALL DEVICES")}</span>
          </div>
          <span
            className={`w-5 h-5 p-[2px] rounded-full border border-gray-400 flex items-center justify-center`}
          >
            <span
              className={`${filterByDevice === "ALL" && "bg-[#43da63]"} w-full h-full rounded-full`}
            ></span>
          </span>
        </div>
        <div
          onClick={() => activeFilterByDevice("DESKTOP")}
          className={`${filterByDevice === "DESKTOP" ? "bg-[#3d34647e]" : ""} w-full flex items-center justify-between p-2 sm:p-1 rounded-sm`}
        >
          <div className="flex items-center gap-3">
            <IoDesktop className="text-lg" />
            <span className="text-gray-400">{t("DESKTOP")}</span>
          </div>
          <span
            className={`w-5 h-5 p-[2px] rounded-full border border-gray-400 flex items-center justify-center`}
          >
            <span
              className={`${filterByDevice === "DESKTOP" && "bg-[#43da63]"} w-full h-full rounded-full`}
            ></span>
          </span>
        </div>
        <div
          onClick={() => activeFilterByDevice("ANDROID")}
          className={`${filterByDevice === "ANDROID" ? "bg-[#3d34647e]" : ""} w-full flex items-center justify-between p-2 sm:p-1 rounded-sm`}
        >
          <div className="flex items-center gap-3">
            <DiAndroid className="text-lg" />
            <span className="text-gray-400">{t("ANDROID")}</span>
          </div>
          <span
            className={`w-5 h-5 p-[2px] rounded-full border border-gray-400 flex items-center justify-center`}
          >
            <span
              className={`${filterByDevice === "ANDROID" && "bg-[#43da63]"} w-full h-full rounded-full`}
            ></span>
          </span>
        </div>
        <div
          onClick={() => activeFilterByDevice("MAC")}
          className={`${filterByDevice === "MAC" ? "bg-[#3d34647e]" : ""} w-full flex items-center justify-between p-2 sm:p-1 rounded-sm`}
        >
          <div className="flex items-center gap-3">
            <SiApple className="text-lg" />
            <span className="text-gray-400">{t("MAC")}</span>
          </div>
          <span
            className={`w-5 h-5 p-[2px] rounded-full border border-gray-400 flex items-center justify-center`}
          >
            <span
              className={`${filterByDevice === "MAC" && "bg-[#43da63]"} w-full h-full rounded-full`}
            ></span>
          </span>
        </div>
      </div>
    );
  },
);

export default FilterByDeviceMenu;
