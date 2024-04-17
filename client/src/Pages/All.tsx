import { useEffect, useState } from "react";
import { IoDesktop } from "react-icons/io5";
import { DiAndroid } from "react-icons/di";
import { SiApple } from "react-icons/si";
import { IoMdSearch } from "react-icons/io";
import { FaStar } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { useAppSelector } from "../context/Hooks";
import { GameCard, Skeleton } from "../components";
import { tasks } from "../helper/data";
import { guessColor } from "../assets";
import { TypeGame } from "../types";
import { makeRequest } from "../utils";

const All = () => {
  const { resizeSidebare } = useAppSelector((state) => state.stateManeger);
  const [fetchedTasks, setFetchedTasks] = useState<TypeGame[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await makeRequest.get("api/tasks");
        setFetchedTasks(response.data);
      } catch (err) {}
    };
    fetchTasks();
  }, []);

  return (
    <div className="py-7 px-5 sm:px-2 bg-[#1b1c33] ">
      <div className="flex flex-wrap gap-4 items-center border-b border-gray-500 pb-5  pr-6 mb-5">
        <span className="text-gray-300 text-xl font-bold sm:ml-2  xs:text-lg ">
          ALL OFFERS
        </span>
        <div className="flex items-center pr-3 pl-5 py-[6px] gap-3 bg-[#3e3e42a9] text-white rounded-md ">
          <IoDesktop className="text-lg" />
          <DiAndroid className="text-lg" />
          <SiApple className="text-lg" />
          <IoIosArrowDown />
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-[280px] h-10 rounded-md bg-[#383847] outline-none pl-4 pr-[53px] py-2 text-sm tracking-wide text-[#72abff]"
            placeholder="Search"
          />
          <button className="absolute top-0 right-0 rounded-md bg-[#9486866c] px-3 h-[95%]">
            <IoMdSearch className="text-xl" />
          </button>
        </div>
        <div className=" w-[280px] flex items-center justify-evenly  bg-[#30304b] rounded-lg py-2  sm:gap-1">
          <FaStar />
          <span className="text-gray-400 font-bold">Most Popular</span>
          <IoMdArrowDropdown />
        </div>
      </div>
      <div
        className={`${
          resizeSidebare
            ? "grid grid-cols-8 xl:grid-cols-6 lg:grid-cols-5 sm:grid-cols-4 xs:grid-cols-2"
            : "grid grid-cols-7 xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-3 xs:grid-cols-2"
        } gap-3 p-2`}
      >
        {fetchedTasks.length === 0 &&
          [...Array(21).keys()].map((i) => (
            <div
              key={i}
              className="h-[250px] p-3 rounded-md flex flex-col items-center justify-between bg-[#2a244481] border border-gray-700"
            >
              <Skeleton className="h-[120px] w-full" />
              <div className="w-full flex flex-col gap-1 ">
                <div className="w-full flex items-center justify-between">
                  <Skeleton className="w-[60%] h-[13px] " />
                  <Skeleton className="w-[35%] h-[13px] " />
                </div>
                <Skeleton className="w-full h-[18px]" />
              </div>
              <div className="w-full flex flex-col items-center gap-1">
                <Skeleton className="h-[12px] w-full" />
              </div>
              <div className="w-full flex items-center justify-between">
                <Skeleton className="w-[35%] h-[22px]" />
                <Skeleton className="w-[60%] h-[22px]" />
              </div>
            </div>
          ))}
        {fetchedTasks.map(
          ({ name, description, category, _id, prize, image }, i) => {
            if (category === "quiz") {
              return (
                <GameCard
                  key={_id}
                  _id={_id}
                  name={name}
                  image={image}
                  description={description}
                  category={category}
                  prize={prize}
                  firstItem={i === 0 ? true : false}
                />
              );
            }
            if (category === "game") {
              return (
                <GameCard
                  key={_id}
                  _id={_id}
                  name={name}
                  image={guessColor}
                  description={description}
                  category={category}
                  prize={prize}
                  firstItem={false}
                />
              );
            }
          }
        )}
        {fetchedTasks.length > 0 &&
          tasks.map(({ name, description, category, _id, prize, image }) => (
            <GameCard
              key={_id}
              _id={_id}
              name={name}
              image={image}
              description={description}
              category={category}
              prize={prize}
            />
          ))}
      </div>
    </div>
  );
};

export default All;
