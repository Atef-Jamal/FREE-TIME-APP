import { BsCheckCircleFill } from "react-icons/bs";
import { AiFillAndroid } from "react-icons/ai";
import { MdDesktopMac } from "react-icons/md";
import { SiApple } from "react-icons/si";
import { useAppSelector } from "../../context/Hooks";
import { TypeTaskApp } from "../../types/earnTypes";

interface TypeAppCard {
  taskDetail: TypeTaskApp;
  index: number;
  setAppId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppCard = ({ taskDetail, index, setAppId }: TypeAppCard) => {
  const { currentUser, currentUserIsLoading } = useAppSelector(
    (state) => state.stateManeger
  );
  const { _id, description, image, prize, title, isAvailable, devices } =
    taskDetail;
  const isCompleted = currentUser?.completedTasks.includes(_id);
  if (currentUserIsLoading) return;

  return (
    <div
      id={taskDetail._id}
      onClick={() => setAppId(taskDetail._id)}
      className={` ${
        index === 0 ? "col-span-2" : ""
      } relative flex flex-col  bg-[#55539b3a] rounded-md p-2 justify-between overflow-hidden border border-gray-700 h-[230px]`}
    >
      {currentUser?.completedTasks.includes(_id) ? (
        <div className="absolute z-[1] top-7 -left-7 py-1 px-6 -rotate-45 flex items-center justify-center gap-2 bg-[#9cf155]">
          <BsCheckCircleFill />
          <span className="font-bold text-xs text-[#5e5656]">Completed</span>
        </div>
      ) : undefined}

      <div className="relative overflow-hidden">
        <div className="w-full mx-auto  overflow-hidden">
          <img
            alt={""}
            src={`${import.meta.env.VITE_SERVER_BASE_URL}/${image}`}
            className={`w-full h-[95px] rounded-sm  object-fill`}
          />
        </div>
        <span
          className={`flex items-center justify-center gap-1 absolute top-1 left-0 right-0 w-[83px] mx-auto px-3 py-1 bg-[#000000c5] border border-gray-600 rounded-md`}
        >
          {devices === "DESKTOP" && <MdDesktopMac className="min-w-fit" />}
          {devices === "ANDROID" && <AiFillAndroid className="min-w-fit" />}
          {devices === "MAC" && <SiApple className="min-w-fit" />}
          {devices === "ALL" && (
            <>
              <MdDesktopMac className="min-w-fit" />
              <AiFillAndroid className="min-w-fit" />
              <MdDesktopMac className="min-w-fit" />
            </>
          )}
        </span>
      </div>
      <div className="flex flex-col">
        <p className="font-bold text-sm text-[#8ad657]  truncate">{title}</p>
        <p className="text-xs text-[#cea5a5] h-4 truncate">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-300 font-bold py-1">Reward</span>
          <span className="text-sm sm:text-xs text-[#5dd140] text-center font-bold pr-1 ">
            {prize}
          </span>
        </div>
      </div>
      {isCompleted && (
        <button
          className={`w-full py-2 sm:text-xs bg-[#171430d5] text-sm text-white rounded-md border border-gray-700`}
        >
          Completed
        </button>
      )}
      {!isCompleted && isAvailable === "AVAILABLE" && (
        <button
          className={`bg-[#a4ec52cc] w-full py-2  sm:text-xs text-sm font-bold rounded-md text-center`}
        >
          START NOW
        </button>
      )}
      {isAvailable === "UNAVAILABLE" && (
        <button
          className={`bg-[#528feccc] w-full py-2  sm:text-xs text-sm font-bold rounded-md text-center`}
        >
          Not Available
        </button>
      )}
    </div>
  );
};

export default AppCard;
