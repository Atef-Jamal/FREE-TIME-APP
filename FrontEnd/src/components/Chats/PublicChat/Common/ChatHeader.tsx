import { useState } from "react";
import { MdOutlineExpandMore } from "react-icons/md";
import { MdHeadphones } from "react-icons/md";

const ChatHeader = () => {
  const [select, setSelect] = useState<boolean>(false);
  return (
    <div className="flex items-center justify-between bg-[#1b1d29] px-12 py-2">
      <span
        onClick={() => setSelect((prev) => !prev)}
        className="relative flex items-center justify-center gap-x-3 rounded-[4px] bg-[#01D676] px-6 py-1"
      >
        <span className="text-white"> General</span>
        <MdOutlineExpandMore className="text-2xl" />
        {select && (
          <div className="general__select absolute -left-2 top-9 z-[4] flex w-52 flex-col items-center rounded-lg bg-[#42427e] py-2 sm:w-44">
            <div className="w-[90%] rounded-md p-2 text-sm text-gray-400 hover:bg-[#3f4566]">VIP 100 46</div>
            <div className="w-[90%] rounded-md p-2 text-sm text-gray-400 hover:bg-[#3f4566]">VIP 100 46</div>
          </div>
        )}
      </span>
      <MdHeadphones className="text-2xl" />
    </div>
  );
};

export default ChatHeader;
