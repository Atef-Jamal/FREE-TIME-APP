import { useTranslation } from "react-i18next";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { crown } from "../../assets";
import TopWinsLast24Hours from "./TopWinsLast24Hours";
import { cn } from "../../utils/common";

const Ladder = () => {
  const { t } = useTranslation("rewards");
  return (
    <div className="flex w-full max-w-[800px] flex-col gap-10 rounded-lg bg-[#2C2C44] px-2 py-6 lg:w-[42%] lg:px-4">
      <div className="flex gap-2">
        <h1 className="text-xl font-bold text-green-400">{t("Daily Bonus Laddar")}</h1>
        <IoIosHelpCircleOutline />
      </div>
      <div className="relative flex flex-col gap-3 overflow-hidden rounded-md bg-[#242438] py-6">
        <div className="flex w-[100%] flex-col items-center">
          {[
            { width: "100%", height: "60px" },
            { width: "88%", height: "60px" },
            { width: "76%", height: "60px" },
            { width: "66%", height: "60px" },
            { width: "58%", height: "55px" },
            { width: "52%", height: "50px" },
            { width: "46%", height: "50px" },
            { width: "39%", height: "45px" },
            { width: "33%", height: "40px" },
            { width: "29%", height: "35px" },
            { width: "25%", height: "35px" },
          ].map((item, i) => {
            return (
              <div
                key={item.width}
                style={{
                  width: item.width,
                  height: item.height,
                }}
                className={`relative flex items-center justify-center`}
              >
                <span className="absolute z-[1]">556.48</span>
                <div
                  style={{
                    borderLeftWidth: "3px",
                    borderBottomWidth: "1px",
                    borderRightWidth: "3px",
                    transform: "perspective(280px) rotateX(150deg)",
                  }}
                  className={cn(
                    "mt-1 flex h-full w-[90%] items-center justify-center rounded-lg border border-gray-500 bg-[#3b578a5b]",
                    i === 0 && "bg-[#7af162]",
                    i === 1 && "bg-[#568bb6a1]",
                    i === 2 && "bg-[#924747af]",
                    i === 8 && "light__animation__one",
                    i === 10 && "light__animation__two",
                  )}
                >
                  {i === 0 && (
                    <span className="absolute -bottom-[20px] -right-[16px] z-[1]">
                      <img alt={""} src={crown} className="w-8 -rotate-[210deg]" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 bg-[#242438] py-4 lg:gap-4">
        <button className="rounded-md bg-[#01D676] px-4 py-2 text-sm text-white lg:px-6">
          {t("Double or 0")}
        </button>
        <button className="rounded-md bg-[#01D676] px-4 py-2 text-sm text-white lg:px-8">
          {t("Claim 10")}
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs">{t("Level 0")}</span>
          <span className="text-xs">{t("Level 1")}</span>
        </div>
        <div className="reach__level relative h-3 w-full rounded-lg bg-[#242438]"></div>
        <div className="mt-[-6px] flex justify-between px-5">
          <span className="ml-1 text-xs text-yellow-200">10</span>
          <span className="text-[10px]">{t("Reach level 1 to Double or Claim your first daily reward")}</span>
          <span className="text-xs">10</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-6 bg-[#242438] py-8">
        <h1 className="text-sm">{t("Top Wins Last 24 Hours")}</h1>
        <div className="flex w-full gap-2 px-2">
          <TopWinsLast24Hours name={"John"} money={"22,963"} color={"one"} />
          <TopWinsLast24Hours name={"Max"} money={"22,963"} color={"two"} />
          <TopWinsLast24Hours name={"Atef"} money={"22,963"} color={"three"} />
        </div>
      </div>
    </div>
  );
};

export default Ladder;
