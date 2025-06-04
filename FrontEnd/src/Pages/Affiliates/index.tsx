import { howItWorksLeft, affiliateExplained, howItWorksRight, affiliateBag } from "../../assets";
import { selectUserAuth, showModal, updateThisEntity } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/hooks";

const Affiliates = () => {
  const userAuth = useAppSelector(selectUserAuth);
  const dispatch = useAppDispatch();

  const handleOpenRegisterModal = () => {
    dispatch(updateThisEntity({ entity: "isSignInMode", value: false }));
    dispatch(showModal("register-modal"));
  };
  return (
    <div className="flex flex-col bg-[#141523]">
      <div className="affiliate__background__left mx-auto flex flex-col items-center justify-center gap-5 py-8 lg:w-[80%]">
        <h1 className="w-full text-center text-3xl font-bold tracking-wider text-white lg:w-[42%]">
          Earn up to
          <span className="w-full text-3xl text-green-400">30% commission from your friends!</span>
        </h1>
        <p className="mt-4 text-center font-bold tracking-wide text-gray-300">
          We offer the most rewarding referral system in the market.
        </p>
        {userAuth === "unauthenticated" && (
          <button
            onClick={handleOpenRegisterModal}
            className="mt-6 w-40 rounded-md bg-[#01D676] py-2 font-bold tracking-wider text-black"
          >
            Sign Up
          </button>
        )}
        <img alt={""} src={affiliateExplained} className="mt-8 w-full lg:w-[80%]" />
      </div>
      <div className="flex flex-col items-center justify-center gap-12 py-6">
        <h1 className="text-3xl font-bold text-[#5d9ba3]">How it works</h1>
        <div className="flex flex-col items-center justify-center gap-9 lg:flex-row">
          <div className="mx-auto flex w-[90%] flex-col gap-4 overflow-hidden rounded-xl border border-gray-400 lg:w-[30%]">
            <img alt={""} src={howItWorksLeft} />
            <h1 className="px-6 text-xl font-bold text-[#6291e7]">Gift your friends a free time</h1>
            <p className="px-6 pb-12">
              When your friends sign up via your referral link, they will receive a free time worth up to
              $250. If they earn $1 within 48 hours after signing up, they'll receive 3 more cases!{" "}
            </p>
          </div>
          <div className="mx-auto flex w-[90%] flex-col gap-4 overflow-hidden rounded-xl border border-gray-400 lg:w-[30%]">
            <img alt={""} src={howItWorksRight} className="" />
            <h1 className="px-6 text-xl font-bold text-[#6291e7]">Gift your friends a free time</h1>
            <p className="px-6 pb-12">
              When your friends sign up via your referral link, they will receive a free time worth up to
              $250. If they earn $1 within 48 hours after signing up, they'll receive 3 more cases!{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-4">
        <h1 className="text-center text-2xl font-bold text-white">Our Top Earner</h1>
        <div className="mx-auto my-12 flex w-[90%] flex-col-reverse items-center justify-between gap-6 lg:w-[80%] lg:flex-row">
          <div className="flex w-full flex-col items-center gap-4 lg:w-[40%]">
            <div className="flex w-full items-center justify-between">
              <span className="h-10 w-10 rounded-lg bg-[#bace06] pt-2 text-center text-black">1</span>
              <span className="ml-[-40px] text-white">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="h-10 w-10 rounded-lg bg-[#bbbbba] pt-2 text-center text-black">2</span>
              <span className="ml-[-40px] text-white">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="h-10 w-10 rounded-lg bg-[#bace06] pt-2 text-center text-black">3</span>
              <span className="ml-[-40px] text-white">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="h-10 w-10 rounded-lg bg-[#434344d0] pt-2 text-center font-bold text-white">
                4
              </span>
              <span className="ml-[-40px] text-white">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="h-10 w-10 rounded-lg bg-[#434344d0] pt-2 text-center font-bold text-white">
                5
              </span>
              <span className="ml-[-40px] text-white">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="h-10 w-10 rounded-lg bg-[#434344d0] pt-2 text-center font-bold text-white">
                6
              </span>
              <span className="ml-[-40px] text-white">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="h-10 w-10 rounded-lg bg-[#434344d0] pt-2 text-center font-bold text-white">
                7
              </span>
              <span className="ml-[-40px] text-white">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="h-10 w-10 rounded-lg bg-[#434344d0] pt-2 text-center font-bold text-white">
                8
              </span>
              <span className="ml-[-40px] text-white">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="h-10 w-10 rounded-lg bg-[#434344d0] pt-2 text-center font-bold text-white">
                9
              </span>
              <span className="ml-[-40px] text-white">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="h-10 w-10 rounded-lg bg-[#434344d0] pt-2 text-center font-bold text-white">
                10
              </span>
              <span className="ml-[-40px] text-white">Anonymous</span>
              <span className="text-white">$89,236</span>
            </div>
          </div>
          <div className="mx-auto h-[70%] w-full lg:w-[40%]">
            <div className="stars__background flex flex-col items-center justify-center gap-5">
              <img alt={""} src={affiliateBag} className="w-[35%]" />
              <h1 className="text-center text-xl font-bold">TOTAL AFFILIATE COMMISSION EARNED</h1>
              <p className="text-center text-3xl font-bold text-white">$740,516</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Affiliates;
