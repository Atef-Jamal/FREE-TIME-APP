import { useState } from "react";
import { MdOnlinePrediction } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";
import { MdHeadphones } from "react-icons/md";
import { useAppSelector } from "../../../../context/Hooks";

const ChatHeader = () => {
  const onlineUsers = useAppSelector((state) => state.stateManeger.onlineUsers);
  const [select, setSelect] = useState<boolean>(false);
  return (
    <div className="flex items-center justify-evenly w-full h-[60px] bg-[#1b1d29] ">
      <p className=" text-[#87e72dc4] text-lg flex items-center gap-2 px-1">
        <MdOnlinePrediction className="text-2xl" /> {onlineUsers.length} Online
      </p>
      <span
        onClick={() => setSelect((prev) => !prev)}
        className=" relative flex justify-evenly items-center px-2 py-1 rounded-md w-[35%] bg-[#bacf5aee] "
      >
        {/* <BsAmd className="text-sm" /> */}
        <span className="text-white"> General</span>
        <MdOutlineExpandMore className="text-2xl" />
        {select && (
          <div className=" general__select absolute z-[4] top-9 -left-2 w-52 sm:w-44 bg-[#42427e] rounded-lg flex flex-col items-center py-2">
            <div className="w-[90%] rounded-md p-2 hover:bg-[#3f4566] text-sm text-gray-400">
              VIP 100 46
            </div>
            <div className="w-[90%] hover:bg-[#3f4566] rounded-md p-2 text-sm text-gray-400">
              VIP 100 46
            </div>
          </div>
        )}
      </span>
      <MdHeadphones className="text-2xl sm:text-xl" />
    </div>
  );
};

export default ChatHeader;
