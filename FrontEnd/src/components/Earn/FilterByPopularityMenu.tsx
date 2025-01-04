import { memo, useRef } from "react";
import { CgClose } from "react-icons/cg";
import { FaHeart, FaStar } from "react-icons/fa6";
import { SiFirewalla } from "react-icons/si";
import { VscExpandAll } from "react-icons/vsc";
import { TypeFilterByPopularity } from "../../types/earnTypes";
import { useClickOutside } from "../../hooks";
import { useTranslation } from "react-i18next";

interface TypeProps {
  filterByPopularity: TypeFilterByPopularity;
  handleCloseFilterByPopularityMenu: (open: boolean) => void;
  activeFilterByPopularity: (item: TypeFilterByPopularity) => void;
}

const FilterByPopularityMenu = memo(
  ({ filterByPopularity, handleCloseFilterByPopularityMenu, activeFilterByPopularity }: TypeProps) => {
    const { t } = useTranslation("earn");
    const filterByPopularityRef = useRef<HTMLDivElement | null>(null);

    useClickOutside(filterByPopularityRef, () => handleCloseFilterByPopularityMenu(false));

    return (
      <div
        ref={filterByPopularityRef}
        className="sm:relative absolute top-9 sm:top-0 right-0 z-[2] w-[300px] sm:w-full h- ml-auto mt-2 p-1 border border-gray-700 bg-[#2f2f38] flex flex-col rounded-md cursor-pointer"
      >
        <span
          onClick={() => handleCloseFilterByPopularityMenu(false)}
          className="absolute top-0 right-0  rounded-sm ml-auto p-2"
        >
          <CgClose className="text-xl" />
        </span>
        <span
          onClick={() => activeFilterByPopularity("ALL")}
          className={`${filterByPopularity === "ALL" ? "bg-[#3d34647e]" : ""} text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold`}
        >
          <VscExpandAll className="text-lg" />
          {t("ALL")}
        </span>
        <span
          onClick={() => activeFilterByPopularity("REWARD")}
          className={`${filterByPopularity === "REWARD" ? "bg-[#3d34647e]" : ""} text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold`}
        >
          <SiFirewalla className="text-lg" />
          {t("REWARD")}
        </span>
        <span
          onClick={() => activeFilterByPopularity("POPULAR")}
          className={`${filterByPopularity === "POPULAR" ? "bg-[#3d34647e]" : ""} text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold`}
        >
          <FaHeart className="text-lg" />
          {t("POPULAR")}
        </span>
        <span
          onClick={() => activeFilterByPopularity("RAITING")}
          className={`${filterByPopularity === "RAITING" ? "bg-[#3d34647e]" : ""} text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold`}
        >
          <FaStar className="text-lg" /> {t("RAITING")}
        </span>
      </div>
    );
  },
);

export default FilterByPopularityMenu;
