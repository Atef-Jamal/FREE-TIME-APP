import React, { Dispatch, RefObject, SetStateAction, useRef } from "react";
import { DiAndroid } from "react-icons/di";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoDesktop } from "react-icons/io5";
import { SiApple } from "react-icons/si";
import { TypeFilterByDevice } from "../../types/earnTypes";
import { useCloseMenuOnClickOutSide } from "../../hooks";
import { useTranslation } from "react-i18next";

interface TypeProps {
  allDevicesRef: RefObject<HTMLDivElement | null>;
  androidRef: RefObject<HTMLDivElement | null>;
  desktopRef: RefObject<HTMLDivElement | null>;
  macRef: RefObject<HTMLDivElement | null>;
  filterByDevice: TypeFilterByDevice;
  setSelectDevice: Dispatch<SetStateAction<boolean>>;
  activeFilterByDevice: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: TypeFilterByDevice
  ) => void;
}

const FilterByDeviceMenu = ({
  allDevicesRef,
  androidRef,
  desktopRef,
  macRef,
  filterByDevice,
  setSelectDevice,
  activeFilterByDevice,
}: TypeProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("earn");
  const handleClose = () => {
    setSelectDevice(false);
  };
  useCloseMenuOnClickOutSide({ menuRef, handleClose });

  return (
    <div
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
      className={`border border-[#3c4053] p-2 xs:p-1 sm:relative ml-auto absolute right-0 z-[1] w-[200px] xs:w-full bg-[#161033] rounded-md mt-1 flex flex-col items-center justify-center cursor-pointer`}
    >
      <div
        ref={allDevicesRef}
        onClick={(e) => activeFilterByDevice(e, "ALL")}
        className={` w-full flex items-center justify-between p-2 sm:p-1  rounded-sm`}
      >
        <div className="flex items-center gap-3">
          <GiHamburgerMenu className="text-lg" />

          <span className="text-gray-400">{t("ALL DEVICES")}</span>
        </div>
        <span
          className={`w-5 h-5 p-[2px] rounded-full border border-gray-400 flex items-center justify-center`}
        >
          <span
            className={`${
              filterByDevice === "ALL" && "bg-[#43da63]"
            } w-full h-full rounded-full`}
          ></span>
        </span>
      </div>
      <div
        ref={desktopRef}
        onClick={(e) => activeFilterByDevice(e, "DESKTOP")}
        className={` w-full flex items-center justify-between p-2 sm:p-1 rounded-sm`}
      >
        <div className="flex items-center gap-3">
          <IoDesktop className="text-lg" />
          <span className="text-gray-400">{t("DESKTOP")}</span>
        </div>
        <span
          className={`w-5 h-5 p-[2px] rounded-full border border-gray-400 flex items-center justify-center`}
        >
          <span
            className={`${
              filterByDevice === "DESKTOP" && "bg-[#43da63]"
            } w-full h-full rounded-full`}
          ></span>
        </span>
      </div>
      <div
        ref={androidRef}
        onClick={(e) => activeFilterByDevice(e, "ANDROID")}
        className={`w-full flex items-center justify-between p-2 sm:p-1 rounded-sm`}
      >
        <div className="flex items-center gap-3">
          <DiAndroid className="text-lg" />
          <span className="text-gray-400">{t("ANDROID")}</span>
        </div>
        <span
          className={`w-5 h-5 p-[2px] rounded-full border border-gray-400 flex items-center justify-center`}
        >
          <span
            className={`${
              filterByDevice === "ANDROID" && "bg-[#43da63]"
            } w-full h-full rounded-full`}
          ></span>
        </span>
      </div>
      <div
        ref={macRef}
        onClick={(e) => activeFilterByDevice(e, "MAC")}
        className={` w-full flex items-center justify-between p-2 sm:p-1 rounded-sm`}
      >
        <div className="flex items-center gap-3">
          <SiApple className="text-lg" />
          <span className="text-gray-400">{t("MAC")}</span>
        </div>
        <span
          className={`w-5 h-5 p-[2px] rounded-full border border-gray-400 flex items-center justify-center`}
        >
          <span
            className={`${
              filterByDevice === "MAC" && "bg-[#43da63]"
            } w-full h-full rounded-full`}
          ></span>
        </span>
      </div>
    </div>
  );
};

export default FilterByDeviceMenu;
