import { lazy, useEffect, useState } from "react";
import { SiApple } from "react-icons/si";
import { ImFire } from "react-icons/im";
import { IoDesktop } from "react-icons/io5";
import { DiAndroid } from "react-icons/di";
import {
  notikLogo,
  tapresearch,
  AdscendMediaGlow,
  guessColor,
} from "../assets";
import { PiExamDuotone } from "react-icons/pi";
import { IoStar } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { useAppSelector } from "../context/Hooks";
import { arrayoffers, tasks } from "../helper/data";
import { TypeGame } from "../types";
import { Helmet } from "react-helmet-async";
import { makeRequest } from "../utils";
const GameCard = lazy(() => import("../components/Offers/GameCard"))
const OfferParnterCard = lazy(() => import("../components/Offers/OfferParnterCard"))
const Skeleton = lazy(() => import("../components/Others/Skeleton"))


const Earn = () => {
  const { resizeSidebare } = useAppSelector((state) => state.stateManeger);
  const [translate, setTranslate] = useState("");
  const [fetchedTasks, setFetchedTasks] = useState<TypeGame[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await makeRequest.get("api/tasks");
        setFetchedTasks(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTasks();
  }, []);

  const next = () => {
    if (translate === "-translate-x-[0%]") return;
    setTranslate("-translate-x-[0%]");
  };

  const prev = () => {
    if (translate === "-translate-x-[50%]") return;
    setTranslate("-translate-x-[50%]");
  };

  return (
    <div className="flex flex-col p-4 lg:p-3 xs:p-2 xs:py-6 gap-4 bg-[#21223a]">
      <Helmet>
        <title>Earn</title>
      </Helmet>
      <div className="flex flex-col mt-[6px]">
        <div className=" flex items-center gap-4 pl-4 mb-2 sm:pl-2 sm:justify-between sm:gap-0">
          <span className="text-gray-300 text-xl font-bold sm:ml-2 xs:text-lg ">
            EARN ON
          </span>
          <div className="flex items-center pr-3 pl-5 py-[6px] gap-3 bg-[#3e3e42a9] text-white rounded-md ">
            <IoDesktop className="text-lg" />
            <DiAndroid className="text-lg" />
            <SiApple className="text-lg" />
            <IoIosArrowDown className="text-xl" />
          </div>
        </div>
      </div>
      <div className=" bg-[#1c1e31] p-4 rounded-xl flex flex-col gap-5 xs:px-2 overflow-x-hidden border border-gray-800">
        <div className="flex justify-between ">
          <div className="flex items-center gap-3">
            <ImFire className="text-xl" />
            <h1 className="text-[#8a9fff] text-xl font-bold sm:text-lg">
              Featured Offers
            </h1>
          </div>
          <div className="flex items-center gap-3 ">
            <button
              onClick={next}
              className="px-4 py-2 sm:py-1 bg-[#85ac3e] rounded-md "
            >
              <IoIosArrowBack className="text-xl" />
            </button>
            <button
              onClick={prev}
              className="px-4 py-2 sm:py-1 bg-[#85ac3e] rounded-md"
            >
              <IoIosArrowForward className="text-xl" />
            </button>
          </div>
        </div>
        <div
          draggable={true}
          className={`${translate} bg-[#1c1e31] transition-all duration-500 ease-in flex  gap-4 w-[200%] `}
        >
          <div
            className={`w-[50%]  border-gray-500 ${
              resizeSidebare
                ? "grid grid-cols-8 xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-4 xs:grid-cols-2"
                : "grid grid-cols-7 xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-3 xs:grid-cols-2"
            } gap-3 xs:gap-2 bg-[#1c1e31] h-fit `}
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
              tasks.map(
                ({ name, description, category, _id, prize, image }) => (
                  <GameCard
                    key={_id}
                    _id={_id}
                    name={name}
                    image={image}
                    description={description}
                    category={category}
                    prize={prize}
                  />
                )
              )}
          </div>
          <div
            className={`bg-[#1c1e31] w-[50%]  ${
              resizeSidebare
                ? "grid grid-cols-8 xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-4 xs:grid-cols-2"
                : "grid grid-cols-7 xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-3 xs:grid-cols-2"
            } gap-3 xs:gap-2 h-fit`}
          >
            {[...Array(21).keys()].map((i) => (
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
          </div>
        </div>
      </div>
      <div>
        <div className="flex gap-3 pl-2 my-8">
          <ImFire />
          <h1 className="text-2xl font-bold  text-white">Offer Partners</h1>
          <PiExamDuotone />
        </div>
        <div className="flex gap-3 flex-wrap ml-4">
          {arrayoffers.map(({ image, title }, index) => (
            <OfferParnterCard key={index} image={image} title={title} />
          ))}
        </div>
      </div>
      <div>
        <div className="flex gap-3 pl-2 my-8">
          <ImFire />
          <h1 className="text-2xl font-bold  text-white">Survey Partners</h1>
          <PiExamDuotone />
        </div>
        <div className="flex gap-3 flex-wrap ml-4">
          <div className="relative bg-gradient-to-b from-[#34353f] to-[#41425c] rounded-lg flex flex-col justify-center px-2 h-56 gap-6">
            <img alt={""} src={notikLogo} className="w-24 h-12" />
            <p className="text-white font-bold tracking-wide ">BitLaps</p>
            <div className="flex gap-1 ">
              <IoStar />
              <IoStar />
              <IoStar />
              <IoStar />
              <IoStar />
            </div>
          </div>
          <div className="relative bg-gradient-to-b from-[#34353f] to-[#41425c] rounded-lg flex flex-col items-center justify-center px-2 h-56 gap-6">
            <img alt={""} src={AdscendMediaGlow} className="w-24 h-12" />
            <p className="text-white font-bold tracking-wide mt-4">BitLaps</p>
            <div className="flex gap-1 mt-2">
              <IoStar />
              <IoStar />
              <IoStar />
              <IoStar />
              <IoStar />
            </div>
          </div>
          <div className="relative bg-gradient-to-b from-[#34353f] to-[#41425c] rounded-lg flex flex-col items-center justify-center px-2 h-56 gap-6">
            <img alt={""} src={tapresearch} className="w-24 h-12" />
            <p className="text-white font-bold tracking-wide mt-4">BitLaps</p>
            <div className="flex gap-1 mt-2">
              <IoStar />
              <IoStar />
              <IoStar />
              <IoStar />
              <IoStar />
            </div>
          </div>
          <div className="relative bg-gradient-to-b from-[#34353f] to-[#41425c] rounded-lg flex flex-col items-center justify-center px-2 h-56 gap-6">
            <img alt={""} src={tapresearch} className="w-24 h-12" />
            <p className="text-white font-bold tracking-wide mt-4">BitLaps</p>
            <div className="flex gap-1 mt-2">
              <IoStar />
              <IoStar />
              <IoStar />
              <IoStar />
              <IoStar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earn;
