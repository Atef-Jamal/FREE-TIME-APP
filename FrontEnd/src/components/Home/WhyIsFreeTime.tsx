import { useTranslation } from "react-i18next";
import { check, moneyBag, paypal, dollarInHand, support, timers } from "../../assets";

const WhyIsFreeTime = () => {
  const { t } = useTranslation("home");
  return (
    <div className="py-3">
      <div className="mb-4 flex justify-center">
        <span className="rounded-md bg-red-400 px-6 py-2 font-bold text-black">{t("Start Earning")}</span>
      </div>
      <h1 className="mx-4 text-center text-xl font-bold tracking-wide text-gray-300 sm:text-3xl sm:tracking-widest">
        {t("Why is Freetime the #1 site to make money")}
      </h1>
      <p className="mx-auto mb-6 w-[80%] text-center text-sm opacity-[.4] sm:text-[#b39beb]">
        {t("A list with all the advantages and features that made us become the #1")}
      </p>
      <div className="mx-auto grid w-[90%] grid-cols-2 gap-3 sm:w-[60%] sm:gap-8 md:w-[75%]">
        <div className="col-span-2 flex flex-col items-center gap-6 rounded-md bg-[#282942] py-4 sm:col-span-1">
          <img alt={""} src={moneyBag} />
          <span className="text-sm">{t("Cashouts starting at $0.50")}</span>
        </div>
        <div className="col-span-2 flex flex-col items-center rounded-md bg-[#282942] py-6 text-center sm:col-span-1">
          <img alt={""} src={timers} />
          <span className="text-sm">
            {t("Earn $1.00 every 5-10 minutes by completing offers on Freetime")}
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-md bg-[#282942] py-9">
          <img alt={""} src={paypal} />
          <span className="text-sm">{t("Instant cashouts")}</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-[#282942]">
          <img alt={""} src={dollarInHand} />
          <span className="text-sm">{t("Highest payouts")}</span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-md bg-[#282942] py-9">
          <img alt={""} src={check} />
          <span className="text-sm">{t("Verified task")}</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-[#282942]">
          <img alt={""} src={support} />
          <span>{t("24 / 7 Support")}</span>
        </div>
      </div>
    </div>
  );
};

export default WhyIsFreeTime;
