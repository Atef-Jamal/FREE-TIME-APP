import { BiSolidReport } from "react-icons/bi";
import { moneyActive } from "../../assets";
import { withdrawCash, withdrawGiftCards, withdrawSkins } from "../../helper/data";
import { useTranslation } from "react-i18next";

const CashOut = () => {
  const { t } = useTranslation("cashout");
  return (
    <div className="flex flex-col gap-6 bg-[#222339] p-3 lg:p-5">
      <div className="mt-4 flex gap-4">
        <img alt={""} src={moneyActive} className="h-10 w-10" />
        <h1 className="text-2xl font-bold tracking-wider text-white">{t("CashOut")}</h1>
      </div>
      <div className="flex w-full justify-center gap-4 rounded-md border border-gray-700 bg-[#0703033b] px-4 py-8 md:w-[60%]">
        <BiSolidReport className="min-w-fit text-4xl" />
        <p className="text-xs text-[#785f9ee0] md:text-base">
          {t(
            "Use your earned coins on Freetime.com to withdraw PayPal, Bitcoin, VISA, Amazon & much more! Crypto withdrawals start from $0.50, Stake withdrawals at $0.25",
          )}
        </p>
      </div>
      <h1 className="font-extrabold text-blue-200">{t("WITHDRAW CASH")}</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {withdrawCash.map((item, i) => (
          <div
            key={i + new Date().toString()}
            style={{
              backgroundColor: item.bgColor,
            }}
            className={"flex h-[80px] items-center justify-center rounded-lg"}
          >
            <img alt={""} className="h-[60%] w-[60%]" src={item.image} />
          </div>
        ))}
      </div>
      <h1 className="font-extrabold text-blue-200">{t("WITHDRAW GIFTCARDS")}</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {withdrawGiftCards.map((item, i) => (
          <div
            key={i + new Date().toString()}
            style={{
              backgroundColor: item.bgColor,
            }}
            className={"flex h-[80px] items-center justify-center rounded-lg"}
          >
            <img alt={""} className="h-[60%] w-[60%]" src={item.image} />
          </div>
        ))}
      </div>
      <h1 className="font-extrabold text-gray-300">WITHDRAW SKINS</h1>
      <div className="flex flex-wrap gap-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {withdrawSkins.map((item, i) => (
            <div
              key={i + new Date().toString()}
              style={{
                backgroundColor: item.bgColor,
              }}
              className={"flex h-[80px] items-center justify-center rounded-lg"}
            >
              <img alt={""} className="h-[60%] w-[60%]" src={item.image} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CashOut;
