import { useState } from "react";
import { MdCardGiftcard } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import { showPopup } from "../context/StateManeger";
import { BiCopy } from "react-icons/bi";
import { makeRequest } from "../utils";
import { handleApiError } from "../utils/common";

import { dollarInHand } from "../assets";
import Spinner from "../components/Others/Spinner";
import Ladder from "../components/Rewards/Ladder";
import DailyReward from "../components/Rewards/DailyReward";
import { TypeBounusCode } from "../types/rewardsTypes";
import { useScrollToElement } from "../hooks/commonHooks";

const Rewards = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);

  const [loading, setLoading] = useState<boolean>(false);
  const [bonusCode, setBonusCode] = useState<TypeBounusCode | null>(null);
  const dispatch = useAppDispatch();

  useScrollToElement();

  const getBonusCode = async () => {
    if (!currentUser) {
      dispatch(
        showPopup({
          message: "Log In first",
          type: "ERROR_LOCK",
        })
      );
      return;
    }
    setLoading(true);
    try {
      const response = await makeRequest.get("api/coupons");
      setBonusCode(response.data);
    } catch (error) {
      dispatch(
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const copyBonusCode = () => {
    if (bonusCode) {
      navigator.clipboard.writeText(bonusCode.code);
      dispatch(
        showPopup({
          message: "Copied!",
          type: "SUCESS",
        })
      );
    }
  };

  return (
    <div className="flex flex-col bg-[#242438] gap-8 py-6 xs:pt-2 xs:pb-5">
      <div className="flex justify-between items-center bg-[#242438] px-6 sm:flex-col sm:items-start sm:gap-6">
        <div className="flex items-center gap-4">
          <img
            alt={""}
            src={dollarInHand}
            className="w-10 h-10 p-2 bg-neutral-700 rounded-md"
          />
          <h1 className="text-3xl font-bold text-yellow-500 tracking-wider sm:text-2xl">
            FREETIME REWARDS
          </h1>
        </div>
        <button
          id={"bonus-code"}
          onClick={getBonusCode}
          className="relative flex gap-4 items-center bg-[#b6da7cce] py-2 px-4 rounded-md mr-3 border border-gray-600 "
        >
          <span
            onClick={(e) => e.stopPropagation()}
            className={`transition-all ${
              bonusCode ? "w-full p-3" : "w-0 p-0 overflow-hidden"
            } absolute top-0 left-0  h-full bg-[#4e3636]  rounded-md flex items-center justify-between  text-[#8792fa] `}
          >
            {bonusCode?.code}
            <span onClick={copyBonusCode} className=" opacity-70">
              <BiCopy className="text-2xl" />
            </span>
          </span>
          <MdCardGiftcard />
          <span id="bonus-code" className="text-white w-[100px]">
            {loading ? (
              <Spinner className="w-6 h-6 border-[3px] mx-auto border-b-blue-800 border-l-blue-800" />
            ) : (
              "Bonus Code"
            )}
          </span>
        </button>
      </div>
      <div className="flex gap-4 bg-[#242438] px-6 lg:px-2 rounded-b-lg sm:rounded-none sm:flex-col sm:px-3 ">
        <div className="w-[68%] max-w-[1500px] sm:w-full">
          <DailyReward />
        </div>
        <Ladder />
      </div>
    </div>
  );
};

export default Rewards;
