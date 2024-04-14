import { IoIosHelpCircleOutline } from "react-icons/io";
import { crown } from "../../assets";
import { lazy } from "react";
const TopWinsLast24Hours = lazy(() => import("./TopWinsLast24Hours"))

const Ladder = () => {
  return (
    <div className="flex flex-col gap-10 py-6 px-4 lg:px-2 bg-[#2C2C44] w-[42%] max-w-[800px] rounded-lg sm:w-full">
      <div className="flex gap-2">
        <h1 className="text-green-400 font-bold text-xl">Daily Bonus Laddar</h1>

        <IoIosHelpCircleOutline />
      </div>
      <div className="relative flex flex-col bg-[#242438] rounded-md gap-3 overflow-hidden py-6">
        <div className="w-[100%] flex flex-col items-center">
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
                className={` flex items-center justify-center relative`}
              >
                <span className="absolute z-[1]">556.48</span>
                <div
                  style={{
                    borderLeftWidth: "3px",
                    borderBottomWidth: "1px",
                    borderRightWidth: "3px",
                    transform: "perspective(280px) rotateX(150deg)",
                  }}
                  className={`${
                    i === 8
                      ? "light__animation__one"
                      : i === 10
                      ? "light__animation__two"
                      : null
                  } ${
                    i === 0
                      ? "bg-[#7af162]"
                      : i === 1
                      ? "bg-[#568bb6a1]"
                      : i === 2
                      ? "bg-[#924747af]"
                      : "bg-[#3b578a5b]"
                  } w-[90%] h-full border border-gray-500 flex items-center justify-center rounded-lg mt-1`}
                >
                  {i === 0 && (
                    <span className="absolute -bottom-[20px] -right-[16px] z-[1]">
                      <img
                        alt={""}
                        src={crown}
                        className="w-8 -rotate-[210deg]"
                      />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-4 lg:gap-2 justify-center items-center bg-[#242438] py-4">
        <button className="bg-[#01D676] rounded-md text-white px-6 text-sm lg:px-4 py-2">
          Double or 0
        </button>
        <button className="bg-[#01D676] rounded-md text-white px-8 text-sm lg:px-4 py-2">
          Claim 10
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-xs ">Level 0</span>
          <span className="text-xs ">Level 1</span>
        </div>
        <div className="relative reach__level w-full h-3 bg-[#242438] rounded-lg"></div>
        <div className="flex justify-between px-5 mt-[-6px]">
          <span className="text-xs text-yellow-200 ml-1">10</span>
          <span className="text-[10px]">
            Reach level 1 to Double or Claim your first daily reward{" "}
          </span>
          <span className="text-xs">10</span>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center bg-[#242438]  py-8 gap-6 ">
        <h1 className="text-sm">Top Wins Last 24 Hours</h1>
        <div className="flex gap-2 w-full px-2 ">
          <TopWinsLast24Hours name={"John"} money={"22,963"} color={"one"} />
          <TopWinsLast24Hours name={"Max"} money={"22,963"} color={"two"} />
          <TopWinsLast24Hours name={"Atef"} money={"22,963"} color={"three"} />
        </div>
      </div>
    </div>
  );
};

export default Ladder;
