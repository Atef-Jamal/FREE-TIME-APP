import { crown } from "../../assets";
import { FaAngleDoubleUp } from "react-icons/fa";

interface TypeDailyBonusCard {
  animation?: string;
  firstOne?: boolean;
}

const DailyBonusCard = ({ animation, firstOne }: TypeDailyBonusCard) => {
  return (
    <span
      className={`${animation} relative w-full h-[50px] ${
        firstOne ? "bg-[#cde92fe8] " : "bg-[#3d3d5f]"
      } shadow-slate-300 shadow-sm rounded-md mx-auto flex items-center gap-2 justify-center`}
    >
      <span className="absolute top-0 left-[10%] z-[1] w-[80%] h-full border"></span>
      <FaAngleDoubleUp />
      {firstOne ? (
        <img
          alt={""}
          src={crown}
          className="absolute -top-4 right-[11%]  lg:right-[3%] sm:top-[-17px]  w-8 rotate-[40deg] z-[1]"
        />
      ) : undefined}
      <span className=" text-sm mr-8 text-white">5,120</span>
    </span>
  );
};

export default DailyBonusCard;
