import { MdOutlineWatchLater } from "react-icons/md";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { ezgifLogo, stashLogo, chooseTask, moneyHome } from "../../assets";

const HowToStart = () => {
  return (
    <div className="">
      <div className="flex sm:flex-col items-center justify-center sm:gap-2 mx-3">
        <div className="bg-[#101127] sm:rounded-t-lg sm:w-full w-[320px] flex flex-col items-center justify-center h-[110px] border-r-gray-100 border-r-[0.2px] sm:border-none">
          <div className="flex items-center gap-4 ">
            <MdOutlineWatchLater />
            <span className="text-green-400 font-bold"> 0h 17m 16s</span>
          </div>
          <p className="text-sm w-[200px] mt-2 text-center text-[#ddc2c2]">
            Average time until user makes first cashout
          </p>
        </div>
        <div className="bg-[#101127] sm:w-full w-[320px] flex flex-col items-center justify-center h-[110px] border-r-gray-100 border-r-[0.2px] sm:border-none">
          <div className="flex items-center gap-4">
            <FaMoneyBillWave />
            <span className="text-green-400 font-bold"> $ 10.32</span>
          </div>
          <p className="text-sm w-[200px] mt-2 text-center text-[#ddc2c2]">
            Average money earned by users yesterday
          </p>
        </div>
        <div className="bg-[#101127] sm:rounded-b-lg sm:w-full w-[320px]  flex flex-col items-center justify-center h-[110px]">
          <div className="flex items-center gap-4">
            <MdOutlineAccountBalanceWallet />
            <span className="text-green-400 font-bold"> $ 32,539,299.52</span>
          </div>
          <p className="text-sm w-[200px] mt-2 text-center text-[#ddc2c2]">
            Total USD earned on Freetime
          </p>
        </div>
      </div>
      <h1 className="text-3xl tracking-widest font-bold text-gray-300 text-center mt-12 sm:mt-4 sm:text-xl sm:tracking-wide">
        How to get started?
      </h1>
      <p className="font-bold text-center mt-4 mb-12 mx-6 text-[#156999]">
        Earning money on Freetime has been made as simple as possible
      </p>
      <div className="w-[90%] mx-auto flex items-center justify-around sm:flex-col gap-7">
        <div className="w-[320px] h-[160px] sm:w-[60%] xs:w-full bg-[#4346745e] rounded-md relative ">
          <span className="text-5xl font-bold text-yellow-300 absolute top-[-12%] left-[6%]">
            01
          </span>
          <p className="text-sm font-bold ml-8 mt-8 text-white blur-sm">
            This text have some Blure
          </p>
          <p className="text-xs  ml-8 mt-2 text-white blur-sm">
            This text have some Blure again
          </p>
          <p className="text-xs  ml-8 mt-10 text-white blur-sm">another</p>
          <div className=" bg-[#241c38d3] w-[90%] h-[140px] absolute top-[6%] left-[5%] rounded-md flex flex-col items-center overflow-hidden opacity-[0.6]">
            <h1 className="font-bold tracking-wider text-center text-yellow-300 ">
              Choose a task
            </h1>
            <div className="w-[80%] h-8 mt-1 flex justify-between p-2 rounded-lg bg-[#5c46aa80]">
              <img alt={""} src={stashLogo} className="rounded-md" />
              <p className="text-sm text-gray-50">sign up for..</p>
              <button className=" rounded-md bg-[#120d3863] px-2 border-t text-white text-sm">
                $69.00
              </button>
            </div>
            <div className="w-[90%] h-8 mt-3 flex justify-between scale-110 bg-[#0e086633] rounded-md py-1 px-3 shadow-amber-300 shadow-lg ">
              <img alt={""} src={chooseTask} className="rounded-md" />
              <p className="text-sm text-gray-50">Play and reach lev..</p>
              <button className="rounded-md bg-[#120d3863] px-2 border-t text-yellow-200 text-sm ">
                $100.00
              </button>
            </div>
            <div className="w-[85%] rounded-md px-2 bg-[#2b1f36a6] h-8 flex absolute left-5 bottom-[-10%] items-center justify-between">
              <img alt={""} src={ezgifLogo} className="rounded-md" />
              <p className="text-sm text-gray-50">deposit</p>
              <button className=" rounded-md ">$80.00</button>
            </div>
          </div>
        </div>
        <div className="w-[320px] h-[160px] sm:w-[60%] xs:w-full bg-[#4346745e] rounded-md relative ">
          <span className="text-5xl font-bold text-yellow-300 absolute top-[-12%] left-[6%] ">
            02
          </span>
          <p className="text-xs  ml-8 mt-10 text-white blur-sm">someThing</p>
          <div className=" m-auto bg-[#171125cc] w-[90%] h-[140px] absolute top-[6%] left-[5%] rounded-md flex flex-col items-center overflow-hidden opacity-[0.6] sm:w-[90%] ">
            <h1 className="font-bold tracking-wider text-center text-yellow-300 mb-4 mt-4">
              Complete a Task
            </h1>
            <p className="text-xs text-center text-white font-[200]">
              Read the description before you start
            </p>
            <span className="px-4 py-2 bg-black rounded-md mt-2 border-t-[0.3px] border-white text-white">
              START
            </span>
          </div>
        </div>
      </div>
      <div className="w-[90%] flex items-center justify-center mx-auto">
        <div className="w-[320px] h-[160px] sm:w-[60%] xs:w-full bg-[#4346745e] rounded-md relative mx-auto mt-16 sm:mt-7 ">
          <span className="text-5xl font-bold text-yellow-300 absolute top-[-12%] left-[6%]">
            03
          </span>
          <div className="m-auto bg-[#130f1fbb] w-[293px] h-[140px] absolute top-[6%] left-[5%] rounded-md flex flex-col items-center overflow-hidden opacity-[0.6]  sm:w-[90%] sm:pl-8">
            <h1 className="font-bold tracking-wider text-center text-yellow-200 mt-4 mb-2">
              Recieve a Coins
            </h1>
            <img
              alt={""}
              src={moneyHome}
              className="absolute w-36 h-36 left-[-20px] top-5 "
            />
            <p className="text-white mb-2">And Cash Them Out</p>
            <button className=" rounded-md bg-black text-white px-2 py-2 border-t-[0.6px] border-gray-300 sm:ml-8 sm:text-sm">
              Cash out $1,00 bitcoin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToStart;
