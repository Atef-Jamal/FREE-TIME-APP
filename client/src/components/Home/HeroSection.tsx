import { lazy, useState } from "react";
import { BsExclamationOctagonFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { VscGithub } from "react-icons/vsc";
import { useAppDispatch } from "../../context/Hooks";
import { showPopup } from "../../context/StateManeger";
const Input = lazy(() => import("../Navebare/Registration/Input"))

const HeroSection = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const isTokenExists = !!localStorage.getItem("token");

  const handlaSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
    } catch (err: any) {
      let msg = "";
      if (typeof err.response.data.error === "string") {
        msg = err.response.data.error;
      }
      dispatch(
        showPopup({
          status: true,
          message: msg,
          icon: <BsExclamationOctagonFill />,
        })
      );
    }
  };

  const showPassword = () => {
    setHidePassword((previous) => !previous);
  };

  return (
    <div
      className={`flex ${
        !isTokenExists ? "justify-between " : "justify-center "
      } sm:px-0 sm:flex-col lg:flex-col lg:items-center sm:w-full sm:gap-4 sm:py-8`}
    >
      <div
        className={`flex flex-col items-start sm:items-center gap-4 pt-10 sm:pt-0 `}
      >
        <h1 className="font-bold text-5xl text-[#c99d81] mb-4 tracking-wider sm:text-center sm:text-2xl sm:mx-auto">
          Get paid for
          {/* {t("getpaidfor")} */}
        </h1>
        <p className="text-3xl text-white font-[300] tracking-wider pb-4 sm:text-xl ">
          opening up bank accounts
        </p>
        <p className="text-white text-sm mb-4 ">
          Earn up to <span className="text-red-400">$2.05</span> per offer 20
          Offers available
        </p>
        <p className=" text-white text-sm tracking-widest ">
          See our 33,225 reviews on Trustpilot
        </p>
        <div className="flex gap-1 rounded-sm mb-4">
          <FaStar className="bg-red-300  w-6 h-6" />
          <FaStar className="bg-red-300  w-6 h-6" />
          <FaStar className="bg-red-300  w-6 h-6" />
          <FaStar className="bg-red-300  w-6 h-6" />
          <FaStar className="bg-red-300  w-6 h-6" />
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-1 ">
          <span className=" bg-yellow-400 text-[#fff] sm:text-xs text-center py-2 w-[100px] sm:w-[80px] rounded-sm text-sm">
            Bitcoin
          </span>
          <span className=" bg-slate-400 text-[#fff] sm:text-xs text-center py-2 w-[100px] sm:w-[80px] rounded-sm text-sm">
            Ethereum
          </span>
          <span className=" bg-red-900 text-[#fff] sm:text-xs text-center py-2 w-[100px] sm:w-[80px] rounded-sm text-sm">
            Litecoin
          </span>
          <span className="bg-blue-800 text-[#fff] sm:text-xs text-center py-2 w-[100px] sm:w-[80px] rounded-sm text-sm">
            PayPal
          </span>
          <span className=" bg-cyan-700 text-[#fff] sm:text-xs text-center py-2 w-[100px] sm:w-[80px] rounded-sm text-sm">
            Amazon
          </span>
          <span className=" bg-pink-800 text-[#fff] sm:text-xs text-center py-2 w-[100px] sm:w-[80px] rounded-sm text-sm">
            Steam
          </span>
          <span className=" bg-green-400 text-[#fff] sm:text-xs text-center py-2 w-[100px] sm:w-[80px] rounded-sm text-sm">
            Apple
          </span>
          <span className=" bg-[#63636e] text-[#fff] sm:text-xs text-center py-2 w-[100px] sm:w-[80px] rounded-sm text-sm">
            Google Play
          </span>
        </div>
      </div>
      {!isTokenExists && (
        <div className="flex flex-col gap-2 w-[44%] bg-[#33334c] p-8 sm:px-2 sm:py-3 rounded-md sm:w-[92%] lg:w-[87%] lg:mt-10 border border-gray-600 sm:mx-auto ">
          <div className="text-center mb-4 sm:bg-[#18193fb4] sm:py-3 sm:rounded-md ">
            <h1 className="font-bold text-2xl tracking-wider text-white mb-2">
              Sign Up For Free
            </h1>
            <p className="text-sm text-[#a6ada0] ">
              and win up to
              <span className="text-sm text-[#83dd1c]"> $250</span> in the free
              time
            </p>
          </div>
          <div className="bg-blue-900 h-12 mb-4 rounded-md sing-up-free"></div>
          <div className="flex flex-col items-center gap-1">
            <button className="text-[.8rem] flex justify-between items-center bg-[#25253b] rounded-md w-full px-4 py-2 sm:text-xs text-[#f7d0d0]">
              Sign Up With Google <FcGoogle />
            </button>
            <button className=" text-[.8rem] flex justify-between items-center bg-[#25253b] rounded-md px-4 py-2 sm:text-xs w-full text-[#f7d0d0]">
              Sign Up With GitHub <VscGithub />
            </button>
          </div>
          <div className="flex w-[90%] mx-auto gap-2 items-center my-1">
            <div className="w-[45%] h-[1px] bg-gradient-to-l from-blue-300 to-[#2b2350] "></div>
            <span>or</span>
            <div className="w-[45%] h-[1px] bg-gradient-to-r from-blue-300 to-[#342872] "></div>
          </div>
          <form className="flex flex-col gap-2">
            <Input
              label={"Email"}
              id={"hom-email"}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={"Enter Your Email"}
              value={email}
              type={"email"}
              name={"email"}
              home={true}
            />
            <Input
              label={"Password"}
              id={"home-password"}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={"Enter Password"}
              value={password}
              type={hidePassword ? "password" : "text"}
              name={"password"}
              home={true}
              showPassword={showPassword}
            />
            <div className="text-center mt-8 sm:mt-4">
              <button
                type="submit"
                onClick={handlaSignIn}
                className="bg-[#05BA6B] text-black py-2 w-[45%] font-[600] rounded-md border-[0.2px] border-white "
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
