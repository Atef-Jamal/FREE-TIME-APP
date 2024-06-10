import React, { Dispatch, RefObject, SetStateAction, useRef } from "react";
import { DiAndroid } from "react-icons/di";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoDesktop } from "react-icons/io5";
import { SiApple } from "react-icons/si";
import { TypeFilterQuery } from "../../types/earnTypes";
import { useCloseMenuOnClickOutSide } from "../../hooks";

interface TypeProps {
  allDevicesRef: RefObject<HTMLDivElement>;
  androidRef: RefObject<HTMLDivElement>;
  desktopRef: RefObject<HTMLDivElement>;
  macRef: RefObject<HTMLDivElement>;
  filterQuery: string;
  setSelectDevice: Dispatch<SetStateAction<boolean>>;
  activeFilteringItem: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: TypeFilterQuery
  ) => void;
}

const FilterByDeviceMenu = ({
  allDevicesRef,
  androidRef,
  desktopRef,
  macRef,
  filterQuery,
  setSelectDevice,
  activeFilteringItem,
}: TypeProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

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
  );
};

export default FilterByDeviceMenu;
