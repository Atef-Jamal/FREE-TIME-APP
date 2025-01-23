import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdCardGiftcard } from "react-icons/md";
import { BiCopy } from "react-icons/bi";
import { IBounusCode } from "../../types/rewardsTypes";
import { showPopup } from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { makeRequest } from "../../utils";
import { cn, handleApiError } from "../../utils/common";
import { useScrollToElement } from "../../hooks";
import { dollarInHand } from "../../assets";
import Ladder from "./Ladder";
import DailyReward from "./DailyReward";
import Spinner from "../../components/Shared/Common/Spinner";

const Rewards = () => {
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  const [loading, setLoading] = useState<boolean>(false);
  const [bonusCode, setBonusCode] = useState<IBounusCode | null>(null);
  const { t } = useTranslation("rewards");
  const dispatch = useAppDispatch();

  useScrollToElement({});

  const getBonusCode = async () => {
    if (currentUserStatus !== "authenticated") {
      dispatch(
        showPopup({
          message: "Log In first",
          type: "ERROR_LOCK",
        }),
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
        }),
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
        }),
      );
    }
  };
  return (
    <div className="flex flex-col gap-8 bg-[#242438] py-6">
      <div className="flex flex-col items-start justify-between gap-6 bg-[#242438] px-4 md:flex-row md:items-center md:px-6">
        <div className="flex items-center gap-4">
          <img alt={""} src={dollarInHand} className="h-10 w-10 rounded-md bg-neutral-700 p-2" />
          <h1 className="text-2xl font-bold tracking-wider text-yellow-500 md:text-3xl">
            {t("FREETIME REWARDS")}
          </h1>
        </div>
        <button
          id={"bonus-code"}
          onClick={getBonusCode}
          className="relative mr-3 flex items-center gap-4 rounded-md border border-gray-600 bg-[#01D676] px-4 py-2"
        >
          <span
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "absolute left-0 top-0 flex h-full items-center justify-between rounded-md bg-[#4e3636] text-[#8792fa] transition-all",
              bonusCode ? "w-full p-3" : "w-0 overflow-hidden p-0",
            )}
          >
            {bonusCode?.code}
            <span onClick={copyBonusCode} className="opacity-70">
              <BiCopy className="text-2xl" />
            </span>
          </span>
          <MdCardGiftcard />
          <span id="bonus-code" className="w-[120px] text-white">
            {loading ? <Spinner color="blue" /> : t("Bonus Code")}
          </span>
        </button>
      </div>
      <div className="flex flex-col gap-4 rounded-b-lg bg-[#242438] px-3 sm:rounded-none md:px-6 lg:flex-row">
        <div className="w-full max-w-[1500px] lg:w-[68%]">
          <DailyReward />
        </div>
        <Ladder />
      </div>
    </div>
  );
};

export default Rewards;
