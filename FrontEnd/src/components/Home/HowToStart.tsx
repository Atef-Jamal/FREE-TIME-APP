import { MdOutlineWatchLater } from "react-icons/md";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { ezgifLogo, stashLogo, chooseTask, moneyHome } from "../../assets";
import { useTranslation } from "react-i18next";

const HowToStart = () => {
  const { t } = useTranslation("home");
  return (
    <div className="">
      <div className="mx-3 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-0">
        <div className="flex h-[110px] w-full flex-col items-center justify-center rounded-t-lg border-r-gray-100 bg-[#101127] sm:w-[320px] sm:rounded-t-none sm:border-r">
          <div className="flex items-center gap-4">
            <MdOutlineWatchLater />
            <span className="font-bold text-green-400"> 0h 17m 16s</span>
          </div>
          <p className="mt-2 w-[200px] text-center text-sm text-[#ddc2c2]">
            {t("Average time until user makes first cashout")}
          </p>
        </div>
        <div className="flex h-[110px] w-full flex-col items-center justify-center border-r-gray-100 bg-[#101127] sm:w-[320px] sm:border-r">
          <div className="flex items-center gap-4">
            <FaMoneyBillWave />
            <span className="font-bold text-green-400"> $ 10.32</span>
          </div>
          <p className="mt-2 w-[200px] text-center text-sm text-[#ddc2c2]">
            {t("Average money earned by users yesterday")}
          </p>
        </div>
        <div className="flex h-[110px] w-full flex-col items-center justify-center rounded-b-lg bg-[#101127] sm:w-[320px]">
          <div className="flex items-center gap-4">
            <MdOutlineAccountBalanceWallet />
            <span className="font-bold text-green-400"> $ 32,539,299.52</span>
          </div>
          <p className="mt-2 w-[200px] text-center text-sm text-[#ddc2c2]">
            {t("Total USD earned on Freetime")}
          </p>
        </div>
      </div>
      <h1 className="mt-4 text-center text-xl font-bold tracking-widest text-gray-300 sm:mt-12 sm:text-3xl sm:tracking-wide">
        {t("How to get started")}
      </h1>
      <p className="mx-6 mb-12 mt-4 text-center font-bold text-[#156999]">
        {t("Earning money on Freetime has been made as simple as possible")}
      </p>
      <div className="mx-auto flex w-[90%] flex-col items-center justify-around gap-7 sm:flex-row">
        <div className="relative h-[180px] w-full rounded-md bg-[#4346745e] sm:w-[70%] md:h-[160px] md:w-[320px] lg:w-[420px]">
          <span className="absolute left-[6%] top-[-12%] text-5xl font-bold text-yellow-300">01</span>
          <p className="ml-8 mt-8 text-sm font-bold text-white blur-sm">This text have some Blure</p>
          <p className="ml-8 mt-2 text-xs text-white blur-sm">This text have some Blure again</p>
          <p className="ml-8 mt-10 text-xs text-white blur-sm">another</p>
          <div className="absolute left-[5%] top-[6%] flex h-[90%] w-[90%] flex-col items-center overflow-hidden rounded-md bg-[#241c38d3] opacity-[0.6]">
            <h1 className="text-center font-bold tracking-wider text-yellow-300">{t("Choose a Task")}</h1>
            <div className="mt-1 flex h-9 w-[90%] justify-between rounded-lg bg-[#5c46aa80] p-2">
              <img alt={""} src={stashLogo} className="rounded-md" />
              <p className="text-sm text-gray-50">{t("sign up for")}..</p>
              <button className="rounded-md border-t bg-[#120d3863] px-2 text-sm text-white">$69.00</button>
            </div>
            <div className="mt-4 flex h-10 w-[95%] scale-110 justify-between rounded-md bg-[#0e086633] px-3 py-1 shadow-lg shadow-amber-300">
              <img alt={""} src={chooseTask} className="rounded-md" />
              <p className="text-sm text-gray-50">{t("Play and Reach Level")}...</p>
              <button className="rounded-md border-t bg-[#120d3863] px-2 text-sm text-yellow-200">
                $100.00
              </button>
            </div>
            <div className="absolute bottom-[-10%] left-9 flex h-8 w-[80%] items-center justify-between rounded-md bg-[#322e36ec] px-2">
              <img alt={""} src={ezgifLogo} className="rounded-md" />
              <p className="text-sm text-gray-50">{t("Deposit")}</p>
              <button className="rounded-md">$80.00</button>
            </div>
          </div>
        </div>
        <div className="relative h-[180px] w-full rounded-md bg-[#4346745e] sm:w-[70%] md:h-[160px] md:w-[320px] lg:w-[420px]">
          <span className="absolute left-[6%] top-[-12%] text-5xl font-bold text-yellow-300">02</span>
          <p className="ml-8 mt-10 text-xs text-white blur-sm">someThing</p>
          <div className="absolute left-[5%] top-[6%] m-auto flex h-[90%] w-[90%] flex-col items-center overflow-hidden rounded-md bg-[#171125cc] opacity-[0.6] sm:w-[90%]">
            <h1 className="mb-4 mt-4 text-center font-bold tracking-wider text-yellow-300">
              {t("Complete a Task")}
            </h1>
            <p className="text-center text-xs font-[200] text-white">
              {t("Read the description before you start")}
            </p>
            <span className="mt-5 w-[80%] rounded-md border-t border-[#e0dfdf] bg-black py-2 text-center text-white">
              {t("start")}
            </span>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-[90%] items-center justify-center">
        <div className="relative mx-auto mt-16 h-[180px] w-full rounded-md bg-[#4346745e] sm:mt-7 sm:w-[70%] md:h-[160px] md:w-[320px] lg:w-[420px]">
          <span className="absolute left-[6%] top-[-12%] text-5xl font-bold text-yellow-300">03</span>
          <div className="absolute left-[5%] top-[6%] m-auto flex h-[90%] w-[90%] flex-col items-center overflow-hidden rounded-md bg-[#130f1fbb] pl-8 opacity-[0.6] sm:pl-0">
            <h1 className="mb-2 mt-4 text-center font-bold tracking-wider text-yellow-200">
              {t("Recieve a Points")}
            </h1>
            <img alt={""} src={moneyHome} className="absolute left-[-20px] top-5 h-36 w-36" />
            <p className="mb-2 text-white">{t("And Cash Them Out")}</p>
            <button className="ml-8 w-[80%] rounded-md border-t-[0.6px] border-gray-300 bg-black py-2 text-center text-sm text-white sm:ml-0 sm:text-base">
              {t("About $1,000 Bitcoins")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToStart;
