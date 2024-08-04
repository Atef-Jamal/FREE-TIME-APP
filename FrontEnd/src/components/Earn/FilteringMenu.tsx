import { CgClose } from "react-icons/cg";
import { FaHeart, FaStar } from "react-icons/fa6";
import { SiFirewalla } from "react-icons/si";
import { VscExpandAll } from "react-icons/vsc";
import { TypeFilterQuery } from "../../types/earnTypes";
import { Dispatch, RefObject, SetStateAction, useRef } from "react";
import { useCloseMenuOnClickOutSide } from "../../hooks";
import { useTranslation } from "react-i18next";

interface TypeProps {
  allRef: RefObject<HTMLSpanElement>;
  heighestRewardRef: RefObject<HTMLSpanElement>;
  popularRef: RefObject<HTMLSpanElement>;
  heighestRatingRef: RefObject<HTMLSpanElement>;
  setOpenFilterMenu: Dispatch<SetStateAction<boolean>>;
  activeFilteringItem: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    item: TypeFilterQuery
  ) => void;
}

const FilteringMenu = ({
  allRef,
  heighestRewardRef,
  popularRef,
  heighestRatingRef,
  setOpenFilterMenu,
  activeFilteringItem,
}: TypeProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("earn");

  const handleClose = () => {
    setOpenFilterMenu(false);
  };

  useCloseMenuOnClickOutSide({
    menuRef,
    handleClose,
  });

  return (
    <div
      ref={menuRef}
      className="sm:relative absolute top-9 sm:top-0 right-0 z-[2] w-[300px] xs:w-full h- ml-auto mt-2 p-1 border border-gray-700 bg-[#2f2f38] flex flex-col rounded-md cursor-pointer"
    >
      <span
        onClick={() => setOpenFilterMenu(false)}
        className="absolute top-0 right-0  rounded-sm ml-auto p-2"
      >
        <CgClose className="text-xl" />
      </span>
      <span
        onClick={(e) => activeFilteringItem(e, "ALL")}
        ref={allRef}
        className="text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold"
      >
        <VscExpandAll className="text-lg" />
        {t("ALL")}
      </span>
      <span
        onClick={(e) => activeFilteringItem(e, "REWARD")}
        ref={heighestRewardRef}
        className="text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold"
      >
        <SiFirewalla className="text-lg" />
        {t("REWARD")}
      </span>
      <span
        onClick={(e) => activeFilteringItem(e, "POPULAR")}
        ref={popularRef}
        className="text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold"
      >
        <FaHeart className="text-lg" />
        {t("POPULAR")}
      </span>
      <span
        onClick={(e) => activeFilteringItem(e, "RAITING")}
        ref={heighestRatingRef}
        className="text-gray-400 flex items-center gap-4 p-2 rounded-sm font-bold"
      >
        <FaStar className="text-lg" /> {t("RAITING")}
      </span>
    </div>
  );
};

export default FilteringMenu;
