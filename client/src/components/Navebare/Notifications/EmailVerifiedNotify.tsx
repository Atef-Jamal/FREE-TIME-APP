import { GoCheckCircleFill } from "react-icons/go";
import VerifiedIcon from "../../../assets/verified-icon.png";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { setCurrentUser, showPopup } from "../../../context/StateManeger";
import {
  collectReward,
  timeAgoFromMongoDBDate,
} from "../../../context/functions";
import { TypeEmailVerifiedNotify } from "../../../types";
import { BsExclamationOctagonFill } from "react-icons/bs";
import { useState } from "react";
import { Spinner } from "../..";

type PropType = Omit<TypeEmailVerifiedNotify, "isRead" | "type">;

const EmailVerifiedNotify = ({
  createdAt,
  prize,
  isCollected,
  _id,
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
          <img src={VerifiedIcon} alt="" className="w-6 h-6" />
        </span>
        <h1 className="text-[#d67d54]">VERIFYING</h1>
        <span className="text-sm ml-auto text-[#7c7a7a] pr-1">{date}</span>
      </div>
      <p className="text-sm w-full text-[#bbc6d1]">
        successfully verified your Email and get
        <span className="text-sm text-[#696cf3] mx-1 font-bold">{prize}</span>
        as Reward
      </p>

      {isRewardCollected && (
        <button className="text-sm bg-[#1a1e33ee] w-[100px] py-1 rounded-md border border-gray-700  ml-auto">
          collected
        </button>
      )}
      {!isRewardCollected && (
        <button
          onClick={collect}
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

export default EmailVerifiedNotify;
