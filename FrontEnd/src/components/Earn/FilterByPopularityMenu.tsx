import { memo, useRef } from "react";
import { CgClose } from "react-icons/cg";
import { FaHeart, FaStar } from "react-icons/fa6";
import { SiFirewalla } from "react-icons/si";
import { VscExpandAll } from "react-icons/vsc";
import { IFilterByPopularity } from "../../types/earnTypes";
import { useClickOutside } from "../../hooks";
import { useTranslation } from "react-i18next";

interface IProps {
  filterByPopularity: IFilterByPopularity;
  handleCloseFilterByPopularityMenu: (open: boolean) => void;
  activeFilterByPopularity: (item: IFilterByPopularity) => void;
}

const FilterByPopularityMenu = memo(
  ({ filterByPopularity, handleCloseFilterByPopularityMenu, activeFilterByPopularity }: IProps) => {
    const { t } = useTranslation("earn");
    const filterByPopularityRef = useRef<HTMLDivElement | null>(null);

    useClickOutside(filterByPopularityRef, () => handleCloseFilterByPopularityMenu(false));

    return (
      <div
        ref={filterByPopularityRef}
        className="absolute right-0 top-12 z-[2] flex w-full cursor-pointer flex-col rounded-md border border-gray-700 bg-[#202029] p-2"
      >
        <span
          onClick={() => handleCloseFilterByPopularityMenu(false)}
          className="absolute right-0 top-0 ml-auto rounded-sm p-2"
        >
          <CgClose className="text-xl" />
        </span>
        <span
          onClick={() => activeFilterByPopularity("ALL")}
          className={`${filterByPopularity === "ALL" ? "bg-[#3d34647e]" : ""} flex items-center gap-4 rounded-sm p-2 font-bold text-gray-400`}
        >
          <VscExpandAll className="text-lg" />
          {t("ALL")}
        </span>
        <span
          onClick={() => activeFilterByPopularity("REWARD")}
          className={`${filterByPopularity === "REWARD" ? "bg-[#3d34647e]" : ""} flex items-center gap-4 rounded-sm p-2 font-bold text-gray-400`}
        >
          <SiFirewalla className="text-lg" />
          {t("REWARD")}
        </span>
        <span
          onClick={() => activeFilterByPopularity("POPULAR")}
          className={`${filterByPopularity === "POPULAR" ? "bg-[#3d34647e]" : ""} flex items-center gap-4 rounded-sm p-2 font-bold text-gray-400`}
        >
          <FaHeart className="text-lg" />
          {t("POPULAR")}
        </span>
        <span
          onClick={() => activeFilterByPopularity("RAITING")}
          className={`${filterByPopularity === "RAITING" ? "bg-[#3d34647e]" : ""} flex items-center gap-4 rounded-sm p-2 font-bold text-gray-400`}
        >
          <FaStar className="text-lg" /> {t("RAITING")}
        </span>
      </div>
    );
  },
);

export default FilterByPopularityMenu;
