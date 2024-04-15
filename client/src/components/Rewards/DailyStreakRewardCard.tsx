import { useState } from "react";
import { setCurrentUser, showPopup } from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import Spinner from "../Others/Spinner";
import { makeRequest } from "../../utils";
import { BiErrorAlt } from "react-icons/bi";
import { IoLockClosed } from "react-icons/io5";

interface TypeProps {
  day: number;
  isCollected: boolean;
  isMock: boolean;
}
const DailyStreakRewardCard = ({ day, isCollected, isMock }: TypeProps) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [isCollectedNow, setIsCollectedNow] = useState<boolean | undefined>(
    isCollected
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const collect = async () => {
    if (isMock === false && currentUser) {
      setIsLoading(true);
      try {
        const response = await makeRequest.post(
          "api/coupons/collectdailyreward",
          {
            day,
          }
        );
        console.log(response.data);

        dispatch(
          setCurrentUser({
            ...currentUser,
            points: response.data.points,
            dailyReward: response.data.dailyReward,
          })
        );
        setIsCollectedNow(true);
      } catch (err) {
        console.log("Failed to collect", err);
        dispatch(
          showPopup({
            status: true,
            message: "Smothing Went Wrong",
            icon: <BiErrorAlt />,
          })
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!currentUser) {
        dispatch(
          showPopup({
            status: true,
            message: "Sign In First",
            icon: <IoLockClosed />,
          })
        );
      } else {
        dispatch(
          showPopup({
            status: true,
            message: "Smothing Went Wrong",
            icon: <BiErrorAlt />,
          })
        );
      }
    }
  };

  return (
    <div className="p-3 flex flex-col gap-4 bg-[#122641c4]">
      <span className="text-center text-lg font-bold text-[#85d361] p-1 bg-[#413fc54b]">
        {day === 1 && "Day ONE"}
        {day === 2 && "Day TWO"}
        {day === 3 && "Day THREE"}
        {day === 4 && "Day FOUR"}
        {day === 5 && "Day FIVE"}
        {day === 6 && "Day SIX"}
        {day === 7 && "Day SEVEN"}
      </span>
      <span className="font-bold text-[#39aa39] text-lg flex flex-col items-center mx-auto ">
        <span className="font-bold text-[#41eb41] text-lg px-2 py-1 bg-[#8edd1021] rounded-md">
          {day * 50}
        </span>
        <span className="font-bold text-[#41eb41] text-lg">Points</span>
      </span>
      {isCollectedNow && isMock === false && (
        <button className="px-2 py-1 bg-[#170e27]  font-bold text-blue-700 rounded-sm">
          Collected
        </button>
      )}
      {!isCollectedNow && isMock === false && (
        <button
          onClick={collect}
          className="px-2 py-1 bg-[#37d132]  font-bold text-[#382452] rounded-sm"
        >
          {isLoading ? (
            <Spinner className="w-5 h-5 border-2 border-b-[#292363] border-l-[#292363] mx-auto" />
          ) : (
            "Claim"
          )}
        </button>
      )}
      {!isCollectedNow && isMock === true && !currentUser && day === 1 && (
        <button
          onClick={() => {
            dispatch(
              showPopup({
                status: true,
                message: "Please, Sign In First",
                icon: <IoLockClosed />,
              })
            );
          }}
          className="px-2 py-1 bg-[#37d132]  font-bold text-[#382452] rounded-sm"
        >
          {isLoading ? (
            <Spinner className="w-5 h-5 border-2 border-b-[#292363] border-l-[#292363] mx-auto" />
          ) : (
            "Claim"
          )}
        </button>
      )}
      {!currentUser && isMock && day !== 1 && (
        <button className="px-2 py-1 bg-[#205764] font-bold text-blue-200 rounded-sm">
          Next
        </button>
      )}
      {currentUser && isMock && (
        <button className="px-2 py-1 bg-[#205764] font-bold text-blue-200 rounded-sm">
          Next
        </button>
      )}
    </div>
  );
};

export default DailyStreakRewardCard;
