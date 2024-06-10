import { useTranslation } from "react-i18next";
import {
  check,
  moneyBag,
  paypal,
  dollarInHand,
  support,
  timers,
} from "../../assets";

const WhyIsFreeTime = () => {
  const { t } = useTranslation("home");
  return (
    <div className="py-3">
      <div className="flex justify-center mb-4">
        <span className="bg-red-400 text-black px-6 py-2 rounded-md font-bold">
          {t("startEarning")}
        </span>
      </div>
      <h1 className="font-bold tracking-widest text-3xl text-gray-300 text-center sm:text-xl sm:tracking-wide mx-4">
        {t("whyFreeTime")}
      </h1>
      <p className="text-center opacity-[.4] sm:w-[80%] sm:mx-auto sm:text-sm sm:text-[#b39beb] mb-6">
        {t("alistOfAllAdvantages")}
      </p>
      <div className=" w-[60%] grid grid-cols-2 gap-8 mx-auto sm:w-[90%] lg:w-[75%] sm:gap-3">
        <div className=" sm:col-span-2 flex flex-col items-center py-4 gap-6 bg-[#282942] rounded-md">
          <img alt={""} src={moneyBag} />
          <span className="text-sm">{t("cashoutsStartingAt")}</span>
        </div>
        <div className="sm:col-span-2 flex flex-col items-center text-center py-6 bg-[#282942] rounded-md">
          <img alt={""} src={timers} />
          <span className="text-sm">{t("EarnEveryMinutes")}</span>
        </div>
        <div className="flex flex-col items-center py-9 bg-[#282942] rounded-md gap-2">
          <img alt={""} src={paypal} />
          <span className="text-sm">{t("instantCashouts")}</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#282942] rounded-md gap-2">
          <img alt={""} src={dollarInHand} />
          <span className="text-sm">{t("highestPayouts")}</span>
        </div>
        <div className="flex flex-col items-center py-9 bg-[#282942] rounded-md gap-2">
          <img alt={""} src={check} />
          <span className="text-sm">{t("verifiedTask")}</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#282942] rounded-md gap-2">
          <img alt={""} src={support} />
          <span>{t("24/7Support")}</span>
        </div>
      </div>
    </div>
  );
};

export default WhyIsFreeTime;
