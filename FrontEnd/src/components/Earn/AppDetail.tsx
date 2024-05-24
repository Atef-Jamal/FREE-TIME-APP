import { useState } from "react";
import { useAppSelector } from "../../context/Hooks";
import { TypeTaskApp } from "../../types/earnTypes";
import { IoIosStarOutline, IoMdStar } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { empty, visaShopLogo } from "../../assets";
import { BsArrowDownCircle } from "react-icons/bs";

const AppDetail = ({ appDetail }: { appDetail: TypeTaskApp }) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [expandUsers, setExpandUsers] = useState(false);
  const [openReviews, setOpenReviews] = useState(false);

  const isCompleted = currentUser?.completedTasks.includes(appDetail._id);
  const notActiveStars = 5 - appDetail.rating;

  return (
    <>
      <h1 className="text-2xl font-bold text-[#78bd4f] text-center">
        App Details
      </h1>
      <img
        className="w-full h-[300px] object-cover mb-3"
        src={`${import.meta.env.VITE_SERVER_BASE_URL}/${appDetail.image}`}
        alt=""
      />
      <div className="w-full flex flex-col items-center justify-center gap-3 sm:gap-1">
        <span className="w-full text-[#b9a3a3]">
          <span className="mr-2 text-[#73f1a8]">Name :</span> {appDetail?.title}
        </span>
        <span className="w-full text-[#b9a3a3]">
          <span className="mr-2 text-[#73f1a8]">Description :</span>
          {appDetail?.description}
        </span>
        <span className="w-full text-[#b9a3a3]">
          <span className="mr-2 text-[#73f1a8]">available on :</span>
          {appDetail?.devices === "ALL" ? "ALL DEVICES" : appDetail.devices}
        </span>
        <div
          onClick={() => setExpandUsers((prev) => !prev)}
          className="w-full bg-[#333030] rounded-md flex item-center justify-between p-2"
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
            <span className="text-gray-400 text-sm w-full flex items-center justify-center gap-2">
              <img src={empty} alt="" className="w-5 h-5 object-cover" /> No one
              complete this app before
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
        <span
          onClick={() => setOpenReviews((prev) => !prev)}
          className="w-full flex items-center justify-between bg-[#333030] p-2 rounded-md"
        >
          <span className="text-[#cec8c8]">Rewies</span>
          <BsArrowDownCircle className="text-xl opacity-50" />
        </span>
        <div
          className={`w-full h-0 overflow-hidden ${
            openReviews && "h-auto"
          } px-2 flex flex-col items-center"
          `}
        >
          <div className="flex flex-col items-center border-b">
            <div className="w-full flex items-center gap-2">
              <img
                src={visaShopLogo}
                alt=""
                className="w-8 h-8 rounded-full object-contain"
              />
              <span className="text-sm text-[#d1cfcf]">Atef Jamal</span>
            </div>
            <p className="w-full text-sm text-[#9d79ff]">
              I Encourage everybody to play this app it is an amazing app i have
              ever seenI Encourage everybody to play this app it is an amazing
              app i have ever seen
            </p>
          </div>
          <div className=""></div>
        </div>
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
