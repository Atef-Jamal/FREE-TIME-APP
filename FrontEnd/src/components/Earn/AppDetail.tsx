import { useState } from "react";
import { useAppSelector } from "../../context/Hooks";
import { TypeTaskApp } from "../../types/earn";
import { IoIosStarOutline, IoMdStar } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaRegArrowAltCircleDown } from "react-icons/fa";

const AppDetail = ({ appDetail }: { appDetail: TypeTaskApp }) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [expandUsers, setExpandUsers] = useState(false);
  const isCompleted = currentUser?.completedTasks.includes(appDetail._id);

  const notActiveStars = 5 - appDetail.rating;
  return (
    <>
      <h1 className="text-2xl font-bold text-[#78bd4f] text-center mb-4">
        App Details
      </h1>
      <div className="w-full flex flex-col items-center justify-center gap-3 sm:gap-1">
        <span className="w-full text-[#b9a3a3]">
          <span className="mr-2 text-[#73f1a8]">Name :</span> {appDetail?.title}
        </span>
        <span className="w-full text-[#b9a3a3]">
          <span className="mr-2 text-[#73f1a8]">Description :</span>
          {appDetail?.description}
        </span>
        <div
          onClick={() => setExpandUsers((prev) => !prev)}
          className="w-full bg-[#230d259f] rounded-md flex item.center justify-between pr-2 py-[3px]"
        >
          <span className="text-[#73f1a8]">People who completed this app</span>
          <FaRegArrowAltCircleDown className="opacity-50 text-xl" />
        </div>
        <div
          className={`w-full transition-all flex flex-col gap-1  ${
            expandUsers ? "p-1" : "overflow-hidden h-0 p-0"
          }`}
        >
          {appDetail.completedBy.length === 0 && (
            <span className="text-gray-400 text-sm block w-full text-center">
              No one complete this app before
            </span>
          )}
          {appDetail.completedBy.length > 0 &&
            appDetail.completedBy.map((item) => (
              <Link
                key={item._id}
                to={`/user/${item._id}`}
                className="text-gray-400 text-sm block underline "
              >
                {item.name}
              </Link>
            ))}
        </div>
        <span className="flex items-center gap-3 w-full text-[#73f1a8]">
          Rating :
          <span className="flex items-center justify-center gap-1">
            {[...Array(appDetail.rating).keys()].map((item) => (
              <IoMdStar key={item} />
            ))}
            {[...Array(notActiveStars).keys()].map((item) => (
              <IoIosStarOutline key={item} />
            ))}
          </span>
        </span>
        <span className="text-[#73f1a8] flex items-center gap-3 w-full">
          Reward :
          <span className="text-[#6676ff]">{appDetail.prize} Points</span>
        </span>
        {isCompleted && (
          <button
            className={`w-full py-2 sm:text-xs bg-[#171430d5] text-sm text-white rounded-md border border-gray-700`}
          >
            Completed
          </button>
        )}
        {!isCompleted && appDetail.isAvailable === "AVAILABLE" && (
          <Link
            to={`/playing/${appDetail._id}`}
            className={`bg-[#a4ec52cc] w-full py-2  sm:text-xs text-sm font-bold rounded-md text-center`}
          >
            START NOW
          </Link>
        )}
        {appDetail.isAvailable === "UNAVAILABLE" && (
          <button
            className={`bg-[#528feccc] w-full py-2  sm:text-xs text-sm font-bold rounded-md text-center`}
          >
            Not Available
          </button>
        )}
      </div>
    </>
  );
};

export default AppDetail;
