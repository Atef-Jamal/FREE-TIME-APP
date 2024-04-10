import { useState } from "react";
import { MdLanguage } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import SelectLang from "./SelectLang";
import UsersLiveStats from "./UsersLiveStats";
import { useAppSelector } from "../../context/Hooks";

const LiveStats = () => {
  const [toggleLanguage, setToggleLanguage] = useState(false);
  const { hiddenLiveStats } = useAppSelector((state) => state.stateManeger);

  return (
    <div
      className={`${
        hiddenLiveStats ? "hidden" : "flex"
      }  items-center w-full sticky top-[75px] sm:top-[55px] z-[2] bg-[#1a1a25] border border-gray-800`}
    >
      <div
        onClick={() => setToggleLanguage(!toggleLanguage)}
        className=" bg-[#222339] m-2 flex items-center gap-2 p-4 sm:p-2 rounded-md"
      >
        <MdLanguage />
        <IoIosArrowDown />
      </div>
      {toggleLanguage && <SelectLang />}
      <UsersLiveStats />
    </div>
  );
};

export default LiveStats;
