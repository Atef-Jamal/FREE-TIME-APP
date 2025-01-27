import { memo, useRef } from "react";
import { CgClose } from "react-icons/cg";
import { IFilterByPopularity } from "../../types/earnTypes";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useTranslation } from "react-i18next";
import { filterByPopularMenuItems } from "../../helper/data";
import { cn } from "../../utilities";

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
        {filterByPopularMenuItems.map((item) => (
          <span
            key={item.value}
            onClick={() => activeFilterByPopularity(item.value)}
            className={cn(
              "flex items-center gap-4 rounded-sm p-2 font-bold text-gray-400",
              filterByPopularity === item.value && "bg-[#3d34647e]",
            )}
          >
            {item.icon}
            {t(item.value)}
          </span>
        ))}
      </div>
    );
  },
);

export default FilterByPopularityMenu;
