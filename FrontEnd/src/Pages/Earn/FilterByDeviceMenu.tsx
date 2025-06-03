import { memo, useRef } from "react";
import type { IFilterByDevice } from "../../types";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useTranslation } from "react-i18next";
import { cn } from "../../utilities";
import { filterByDeviceMenuItems } from "../../helper/data";

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
        className={
          "absolute right-0 top-12 z-[1] flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-[#3c4053] bg-[#161033] p-1 sm:p-2"
        }
      >
        {filterByDeviceMenuItems.map((item) => (
          <div
            key={item.value}
            onClick={() => activeFilterByDevice(item.value)}
            className={cn(
              "flex w-full items-center justify-between rounded-sm p-2 sm:p-1",
              filterByDevice === item.value && "bg-[#3d34647e]",
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon}

              <span className="text-gray-400">{t(item.value)}</span>
            </div>
            <span
              className={
                "flex h-5 w-5 items-center justify-center rounded-full border border-gray-400 p-[2px]"
              }
            >
              <span
                className={cn("h-full w-full rounded-full", filterByDevice === item.value && "bg-[#43da63]")}
              ></span>
            </span>
          </div>
        ))}
      </div>
    );
  },
);

export default FilterByDeviceMenu;
