import { cn, formateDate } from "../../utils/common";

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
      className={cn(
        "flex h-[45px] items-center gap-1 overflow-hidden rounded-md lg:h-[50px]",
        index % 2 === 0 && "bg-[#2d4c705d]",
      )}
    >
      <div className="flex h-full items-center justify-center rounded-sm bg-[#0d0f2bc9] px-1 md:px-3">
        {icon}
      </div>

      <p className="flex h-full flex-1 items-center overflow-auto whitespace-nowrap px-1 text-sm text-[#9fadddee] scrollbar-none md:px-2">
        {message}
      </p>

      <div className="flex h-full items-center justify-center px-1 text-xs text-[#7e7f83ee] md:w-[10%]">
        {date}
      </div>
      <div className="flex h-full items-center justify-center p-1 text-xs font-[600] text-[#9fadddee] md:w-[10%] md:p-2">
        <span className="flex h-[30px] w-[35px] items-center justify-center rounded-md border border-gray-400 bg-[#ff1f1f80] md:w-[45px]">
          {price ? "- " : prize ? "+ " : ""}
          {price ? price : prize}
        </span>
      </div>
    </div>
  );
};

export default ActivityItem;
