import {
  howItWorksLeft,
  affiliateExplained,
  howItWorksRight,
  affiliateBag,
} from "../assets";
import { useAppSelector } from "../context/Hooks";

const Affiliates = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  return (
    <div className="flex flex-col bg-[#141523]">
      <div className="affiliate__background__left flex flex-col gap-5 w-[80%] lg:w-[90%] sm:w-[90%] mx-auto items-center justify-center py-8">
        <h1 className="text-3xl font-bold text-white w-[42%]  text-center tracking-wider sm:w-full">
          Earn up to
          <span className="text-3xl text-green-400 sm:w-full ">
            30% commission from your friends!
          </span>
        </h1>
        <p className="font-bold tracking-wide mt-4 text-gray-300 sm:text-center">
          We offer the most rewarding referral system in the market.
        </p>
        {!currentUser && (
          <button className="bg-[#01D676] rounded-md w-[15%] sm:w-[70%] py-2 text-black font-bold tracking-wider mt-6">
            Sign Un
          </button>
        )}
        <img
          alt={""}
          src={affiliateExplained}
          className="w-[80%] sm:w-full  mt-8"
        />
      </div>
      <div className="flex flex-col gap-12 justify-center items-center py-6">
        <h1 className="text-3xl font-bold text-[#5d9ba3]">How it works</h1>
        <div className="flex gap-9 items-center justify-center sm:flex-col">
          <div className="flex flex-col gap-4 border border-gray-400 w-[30%] lg:w-[40%] rounded-xl overflow-hidden sm:w-[90%] sm:mx-auto">
            <img alt={""} src={howItWorksLeft} />
            <h1 className="text-xl font-bold px-6 text-[#6291e7]">
              Gift your friends a free time
            </h1>
            <p className="px-6 pb-12 ">
              When your friends sign up via your referral link, they will
              receive a free time worth up to $250. If they earn $1 within 48
              hours after signing up, they'll receive 3 more cases!{" "}
            </p>
          </div>
          <div className="flex flex-col gap-4 border border-gray-400 w-[30%] lg:w-[40%] rounded-xl overflow-hidden sm:w-[90%] sm:mx-auto">
            <img alt={""} src={howItWorksRight} className="" />
            <h1 className="text-xl font-bold px-6  text-[#6291e7]">
              Gift your friends a free time
            </h1>
            <p className="px-6 pb-12">
              When your friends sign up via your referral link, they will
              receive a free time worth up to $250. If they earn $1 within 48
              hours after signing up, they'll receive 3 more cases!{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 mt-6 ">
        <h1 className="text-2xl text-white font-bold text-center ">
          Our Top Earner
        </h1>
        <div className=" w-[80%] lg:w-[90%] mx-auto flex items-center justify-between my-12 sm:w-[90%] sm:flex-col-reverse sm:gap-6">
          <div className="flex flex-col gap-4 items-center w-[40%] sm:w-full ">
            <div className="flex items-center justify-between w-full">
              <span className=" w-10  h-10 rounded-lg bg-[#bace06] text-center pt-2 text-black">
                1
              </span>
              <span className="text-white ml-[-40px]">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className=" w-10  h-10 rounded-lg bg-[#bbbbba] text-center pt-2 text-black">
                2
              </span>
              <span className="text-white ml-[-40px]">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className=" w-10  h-10 rounded-lg bg-[#bace06] text-center pt-2 text-black">
                3
              </span>
              <span className="text-white ml-[-40px]">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className=" w-10  h-10 rounded-lg bg-[#434344d0] text-center pt-2 text-white font-bold">
                4
              </span>
              <span className="text-white ml-[-40px]">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className=" w-10  h-10 rounded-lg bg-[#434344d0] text-center pt-2 text-white font-bold">
                5
              </span>
              <span className="text-white ml-[-40px]">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className=" w-10  h-10 rounded-lg bg-[#434344d0] text-center pt-2 text-white font-bold">
                6
              </span>
              <span className="text-white ml-[-40px]">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className=" w-10  h-10 rounded-lg bg-[#434344d0] text-center pt-2 text-white font-bold">
                7
              </span>
              <span className="text-white ml-[-40px]">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className=" w-10  h-10 rounded-lg bg-[#434344d0] text-center pt-2 text-white font-bold">
                8
              </span>
              <span className="text-white ml-[-40px]">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className=" w-10  h-10 rounded-lg bg-[#434344d0] text-center pt-2 text-white font-bold">
                9
              </span>
              <span className="text-white ml-[-40px]">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className=" w-10  h-10 rounded-lg bg-[#434344d0] text-center pt-2 text-white font-bold">
                10
              </span>
              <span className="text-white ml-[-40px]">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
          </div>
          <div className=" w-[40%] h-[70%] mx-auto sm:w-full ">
            <div className="flex flex-col gap-5 justify-center items-center stars__background">
              <img alt={""} src={affiliateBag} className="w-[35%] " />
              <h1 className=" text-center text-xl font-bold">
                TOTAL AFFILIATE COMMISSION EARNED
              </h1>
              <p className="text-3xl font-bold text-white text-center">
                $740,516
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Affiliates;
