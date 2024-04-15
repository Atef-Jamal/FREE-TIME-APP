import { timeAgoFromMongoDBDate } from "../../context/functions";

const EachActivity = ({
  message,
  prize,
  price,
  index,
  time,
  icon,
}: {
  index: number;
  message: string;
  time: Date;
  prize?: number;
  price?: number;
  icon: React.ReactNode;
}) => {
  const date = timeAgoFromMongoDBDate(time.toString());
  return (
    <div
      className={`${
        index % 2 === 0 ? "bg-[#2d4c705d]" : ""
      } flex items-center gap-1 rounded-md  h-[40px] overflow-hidden`}
    >
      <div className="flex items-center justify-center bg-[#0d0f2bc9]  rounded-sm px-3 h-full">
        {icon}
      </div>

      <p className="flex-1 text-sm h-full flex items-center whitespace-nowrap overflow-scroll scrollbar-none  text-[#9fadddee] px-2 xs:px-0">
        {message}
      </p>

      <div className="text-sm xs:text-xs  h-full flex items-center justify-center px-8 xs:px-2  text-[#9fadddee]">
        {date}
      </div>
      <div className="text-xs  font-[600] h-full flex items-center justify-center  text-[#9fadddee] xs:p-1 p-2">
        <span className=" w-full h-full px-5 xs:px-2 flex items-center justify-center rounded-md bg-[#7fff294f]">
          {price ? "-" : ""}
          {prize || price}
        </span>
      </div>
    </div>
  );
};

export default EachActivity;
