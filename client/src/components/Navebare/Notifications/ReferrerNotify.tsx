import { GoCheckCircleFill } from "react-icons/go";
import { BsExclamationOctagonFill } from "react-icons/bs";
import { setCurrentUser, showPopup } from "../../../context/StateManeger";
import { FcConferenceCall } from "react-icons/fc";
import { TypeReferrerNotify } from "../../../types";
import {
  collectReward,
  timeAgoFromMongoDBDate,
} from "../../../context/functions";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Spinner } from "../..";

type PropType = Omit<TypeReferrerNotify, "isRead" | "type">;

const ReferrerNotify = ({
  createdAt,
  _id,
  prize,
  isCollected,
  referredUser,
}: PropType) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [isRewardCollected, setIsRewadCollected] = useState(isCollected);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  if (!currentUser) return;

  const collect = async () => {
    setIsLoading(true);
    try {
      const response = await collectReward(_id);
      setIsRewadCollected(response.isCollected);
      dispatch(
        setCurrentUser({
          ...currentUser,
          points: currentUser.points + response.prize,
        })
      );
      dispatch(
        showPopup({
          status: true,
          message: "collected successfully ",
          icon: <GoCheckCircleFill />,
        })
      );
    } catch (error) {
      console.log(error);
      dispatch(
        showPopup({
          status: true,
          message: "Failed to Collect ",
          icon: <BsExclamationOctagonFill />,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const date = timeAgoFromMongoDBDate(createdAt.toString());

  return (
    <div className="w-full flex flex-col items-center gap-2 bg-[#1010308e] rounded-md p-2 border border-gray-700 ">
      <div className="flex gap-2 w-full">
        <span className="w-8 h-6 rounded-lg bg-[#7aec2e25] flex items-center justify-center">
          <FcConferenceCall className=" text-xl" />
        </span>
        <h1 className="text-[#d67d54]">REFERRER</h1>
        <span className="text-sm ml-auto text-[#7c7a7a] pr-1">{date}</span>
      </div>
      <p className="text-sm w-full text-[#bbc6d1]">
        successfully Reffered Your Friend
        <Link
          to={`/user/${referredUser._id}`}
          className="text-sm text-[#696cf3] mx-1 underline"
        >
          {referredUser.name}
        </Link>{" "}
        and Get {prize} points as a Reward
      </p>
      {isRewardCollected && (
        <button className="text-sm bg-[#1a1e33ee] w-[100px] py-1 rounded-md border border-gray-700  ml-auto">
          collected
        </button>
      )}
      {!isRewardCollected && (
        <button
          onClick={collect}
          disabled={isLoading}
          className="text-sm bg-[#53ec68ee] w-[100px] py-1 rounded-md border border-gray-700 ml-auto"
        >
          {isLoading ? (
            <Spinner className="w-5 h-5 mx-auto border-b-[#533a70] border-l-[#533a70]" />
          ) : (
            "collect"
          )}
        </button>
      )}
    </div>
  );
};

export default ReferrerNotify;
