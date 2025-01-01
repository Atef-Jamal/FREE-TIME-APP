import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { VscGithub } from "react-icons/vsc";
import { useAppDispatch } from "../../context/Hooks";
import { showPopup } from "../../context/StateManeger";
import Input from "../Navebare/Registration/Input";
import { handleApiError } from "../../utils/common";
import { useTranslation } from "react-i18next";
import { login, signInWithGoogle } from "../../utils/auth";

const HeroSection = () => {
  const { t } = useTranslation("home");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useAppDispatch();
  const isTokenExists = !!localStorage.getItem("token");

  const handlaSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await login({ formData: { email, password }, dispatch });
      localStorage.setItem("token", response.data.token);
      window.location.href = `${window.location.origin}/?redirectedfrom=login`;
    } catch (error) {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    }
  };

  const handleSignInWithGoogle = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signInWithGoogle({ dispatch });
    } catch (error) {
      dispatch(
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        })
      );
    }
  };

  return (
    <div
      className={`w-[90%] max-w-[1400px] mx-auto flex ${
        !isTokenExists ? "justify-between " : "justify-center px-16"
      } lg:flex-col lg:items-center lg:px-0`}
    >
      <div
        className={`${
          isTokenExists && "w-full"
        } flex flex-col items-start justify-center sm:items-center gap-2 sm:gap-1`}
      >
        <h1 className="w-full text-center text-6xl sm:text-4xl font-bold text-[#af5a5a] mb-4">
          {t("Get Paid For")}
        </h1>
        <p className="w-full text-center text-xl sm:text-sm text-[#b8c2ca]">{t("Opening Bank Account")}</p>
        <p className="w-full text-center text-xl sm:text-sm text-[#b8c2ca]">
          {t("Refer Your Friend Through your Referal Link")}
        </p>
        <p className="w-full text-center text-xl sm:text-sm text-[#b8c2ca]">
          {t("complete Tasks and apps, offers and much more")}
        </p>
        <p className="w-full text-center text-lg sm:text-xs text-[#95afff]">
          {t("Earn up to $2.05 per offer 20 Offers available See our 33,225 reviews on Trustpilot")}
        </p>

        <div className="w-full text-center flex items-center justify-center gap-1 rounded-sm mb-6">
          <FaStar className="bg-red-300  w-6 h-6" />
          <FaStar className="bg-red-300  w-6 h-6" />
          <FaStar className="bg-red-300  w-6 h-6" />
          <FaStar className="bg-red-300  w-6 h-6" />
          <FaStar className="bg-red-300  w-6 h-6" />
        </div>
        <div className="mx-auto grid grid-cols-4 gap-2 sm:gap-1 overflow-scroll scrollbar-none">
          <span className=" bg-yellow-400 text-[#fff] sm:text-xs text-center flex items-center justify-center w-[120px] xs:w-[75px] h-[30px] rounded-sm text-sm">
            Bitcoin
          </span>
          <span className=" bg-slate-400 text-[#fff] sm:text-xs text-center flex items-center justify-center w-[120px] xs:w-[75px] h-[30px] rounded-sm text-sm">
            Ethereum
          </span>
          <span className=" bg-red-900 text-[#fff] sm:text-xs flex items-center justify-center w-[120px] xs:w-[75px] h-[30px] rounded-sm text-sm">
            Litecoin
          </span>
          <span className="bg-blue-800 text-[#fff] sm:text-xs flex items-center justify-center w-[120px] xs:w-[75px] h-[30px] rounded-sm text-sm">
            PayPal
          </span>
          <span className=" bg-cyan-700 text-[#fff] sm:text-xs  flex items-center justify-center w-[120px] xs:w-[75px] h-[30px] rounded-sm text-sm">
            Amazon
          </span>
          <span className=" bg-pink-800 text-[#fff] sm:text-xs flex items-center justify-center w-[120px] xs:w-[75px] h-[30px] rounded-sm text-sm">
            Steam
          </span>
          <span className=" bg-green-400 text-[#fff] sm:text-xs flex items-center justify-center w-[120px] xs:w-[75px] h-[30px] rounded-sm text-sm">
            Apple
          </span>
          <span className=" bg-[#63636e] text-[#fff] sm:text-xs flex items-center justify-center w-[120px] xs:w-[75px] h-[30px] rounded-sm text-sm">
            Google Play
          </span>
        </div>
      </div>
      {!isTokenExists && (
        <div className="flex flex-col gap-2 w-[50%] bg-[#33334c] p-8 sm:px-2 sm:py-3 rounded-md sm:w-[92%] lg:w-[87%] lg:mt-10 border border-gray-600 sm:mx-auto ">
          <div className="text-center mb-4 sm:bg-[#18193fb4] sm:py-3 sm:rounded-md ">
            <h1 className="font-bold text-2xl tracking-wider text-white mb-2">{t("Sign Up For Free")}</h1>
            <p className="text-sm text-[#a6ada0] ">{t("and win up to $250 in the free time")}</p>
          </div>
          <div className="bg-blue-900 h-12 mb-4 rounded-md sing-up-free"></div>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleSignInWithGoogle}
              className="text-[.8rem] flex justify-between items-center bg-[#25253b] rounded-md w-full px-4 py-2 sm:text-xs text-[#f7d0d0]"
            >
              {t("Sign In With Google")} <FcGoogle />
            </button>
            <button className=" text-[.8rem] flex justify-between items-center bg-[#25253b] rounded-md px-4 py-2 sm:text-xs w-full text-[#f7d0d0]">
              {t("Sign In With GitHub")}
              <VscGithub />
            </button>
          </div>
          <div className="flex w-[90%] mx-auto gap-2 items-center my-1">
            <div className="w-[45%] h-[1px] bg-gradient-to-l from-blue-300 to-[#2b2350] "></div>
            <span>{t("OR")}</span>
            <div className="w-[45%] h-[1px] bg-gradient-to-r from-blue-300 to-[#342872] "></div>
          </div>
          <form className="flex flex-col gap-2">
            <Input
              label={t("Email")}
              id={"hom-email"}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("Enter Your Email")}
              value={email}
              type={"email"}
              name={"email"}
            />
            <Input
              label={t("Password")}
              id={"home-password"}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("Enter Your Password")}
              value={password}
              type={"password"}
              name={"password"}
            />
            <div className="text-center mt-8 sm:mt-4">
              <button
                type="submit"
                onClick={handlaSignIn}
                className="bg-[#05BA6B] text-black py-2 w-[45%] font-[600] rounded-md border-[0.2px] border-white "
              >
                {t("Sign In")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
