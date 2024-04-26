import { Link } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs";
import { AiFillAndroid } from "react-icons/ai";
import { MdDesktopMac } from "react-icons/md";
import { SiApple } from "react-icons/si";
import { useAppSelector } from "../../context/Hooks";
import { TypeGame } from "../../types/others";
import { User } from "../../types/user";

interface TyepGameCard {
  name: string;
  description: string;
  category: string;
  _id: string;
  prize: number;
  image: string;
  rating: number;
  completedBy: User[];
  firstItem?: boolean;
  setAppDetail: React.Dispatch<React.SetStateAction<TypeGame | null>>;
}

const GameCard = ({
  name,
  description,
  category,
  _id,
  prize,
  image,
  rating,
  completedBy,
  firstItem,
  setAppDetail,
}: TyepGameCard) => {
  const { currentUser, currentUserIsLoading } = useAppSelector(
    (state) => state.stateManeger
  );
  if (currentUserIsLoading) return;
  return (
    <div
      onClick={() =>
        setAppDetail({
          name,
          description,
          category,
          _id,
          prize,
          image,
          rating,
          completedBy,
          createdAt: new Date(),
        })
      }
      className={` ${
        firstItem ? "col-span-2" : ""
      } relative flex flex-col  bg-[#55539b3a] rounded-md p-2 justify-between overflow-hidden border border-gray-700 h-[230px]`}
    >
      {currentUser?.completedTasks.includes(_id) ? (
        <div className="absolute z-[1] top-7 -left-7 py-1 px-6 -rotate-45 flex items-center justify-center gap-2 bg-[#9cf155]">
          <BsCheckCircleFill />
          <span className="font-bold text-xs text-[#5e5656]">Completed</span>
        </div>
      ) : undefined}

      <div className="relative overflow-hidden ">
        <img
          alt={""}
          src={image}
          className={`w-full h-[95px] rounded-md mx-auto`}
        />
        <span
          className={`flex gap-1 absolute top-1 ${
            firstItem ? "left-[38%]" : "left-[25%]"
          }  px-3 py-1 bg-[#0f0a25a9] rounded-md`}
        >
          <MdDesktopMac />
          <AiFillAndroid />
          <SiApple />
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-[#8ad657] font-bold ">
          <span className="font-bold text-sm text-[#8ad657]">{name}</span>
        </span>
        <p className="text-xs text-[#cea5a5] overflow-auto scrollbar-none h-4 truncate ">
          {description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-300 font-bold py-1">
            {category}
          </span>
          <span className="text-sm sm:text-xs text-[#5dd140] text-center font-bold pr-1 ">
            {prize} points
          </span>
        </div>
      </div>
      {currentUser?.completedTasks.includes(_id) ? (
        <button
          className={`w-full py-2  sm:text-xs bg-[#171430d5] text-sm text-white rounded-md border border-gray-700`}
        >
          Completed
        </button>
      ) : (
        <>
          {firstItem !== undefined ? (
            <Link
              to={`/playing/${_id}`}
              className={`bg-[#a4ec52cc] w-full py-2  sm:text-xs text-sm font-bold rounded-md text-center`}
            >
              START NOW
            </Link>
          ) : (
            <button
              className={`bg-[#528feccc] w-full py-2  sm:text-xs text-sm font-bold rounded-md text-center`}
            >
              Not Available
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default GameCard;
