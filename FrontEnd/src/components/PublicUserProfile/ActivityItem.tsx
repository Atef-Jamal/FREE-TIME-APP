import { formateDate } from "../../utils/common";
interface TypeProps {
  index: number;
  message: string;
  time: Date;
  prize?: number;
  price?: number;
  icon: React.ReactNode;
}
const ActivityItem = ({ message, prize, price, index, time, icon }: TypeProps) => {
  const date = formateDate(time);
  return (
    <div
      className={`${
        index % 2 === 0 ? "bg-[#2d4c705d]" : ""
      } flex items-center gap-1 rounded-md  h-[70px] sm:h-[60px] overflow-hidden`}
    >
      <div className="flex items-center justify-center bg-[#0d0f2bc9]  rounded-sm px-3 h-full">{icon}</div>

      <p className="flex-1 text-sm h-full flex items-center whitespace-nowrap overflow-scroll scrollbar-none  text-[#9fadddee] px-2 xs:px-0">
        {message}
      </p>

      <div className="text-sm xs:text-xs  h-full flex items-center justify-center px-8 xs:px-2  text-[#9fadddee]">
        {date}
      </div>
      <div className="text-xs  font-[600] h-full flex items-center justify-center  text-[#9fadddee] xs:p-1 p-2">
        <span className="h-[40px] w-[40px] flex items-center justify-center rounded-md bg-[#7fff294f] border">
          {price ? "-" : ""}
          {prize || price}
        </span>
      </div>
    </div>
  );
};

export default ActivityItem;
