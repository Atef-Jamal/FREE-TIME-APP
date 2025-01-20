import { formateDate } from "../../utils/common";

interface IProps {
  index: number;
  message: string;
  time: Date;
  prize?: number;
  price?: number;
  icon: React.ReactNode;
}

const ActivityItem = ({ message, prize, price, index, time, icon }: IProps) => {
  const date = formateDate(time);
  return (
    <div
      className={`${
        index % 2 === 0 ? "bg-[#2d4c705d]" : ""
      } flex h-[70px] items-center gap-1 overflow-hidden rounded-md sm:h-[60px]`}
    >
      <div className="flex h-full items-center justify-center rounded-sm bg-[#0d0f2bc9] px-3">{icon}</div>

      <p className="xs:px-0 flex h-full flex-1 items-center overflow-scroll whitespace-nowrap px-2 text-sm text-[#9fadddee] scrollbar-none">
        {message}
      </p>

      <div className="xs:text-xs xs:px-2 flex h-full items-center justify-center px-8 text-sm text-[#9fadddee]">
        {date}
      </div>
      <div className="xs:p-1 flex h-full items-center justify-center p-2 text-xs font-[600] text-[#9fadddee]">
        <span className="flex h-[40px] w-[40px] items-center justify-center rounded-md border bg-[#7fff294f]">
          {price ? "-" : ""}
          {prize || price}
        </span>
      </div>
    </div>
  );
};

export default ActivityItem;
