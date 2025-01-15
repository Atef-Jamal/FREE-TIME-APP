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
        }),
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
        }),
      );
    }
  };

  return (
    <div
      className={`mx-auto flex w-[90%] max-w-[1400px] ${
        !isTokenExists ? "justify-between" : "justify-center px-16"
      } lg:flex-col lg:items-center lg:px-0`}
    >
      <div
        className={`${
          isTokenExists && "w-full"
        } flex flex-col items-center justify-center gap-1 sm:items-start sm:gap-2`}
      >
        <h1 className="mb-4 w-full text-center text-4xl font-bold text-[#af5a5a] sm:text-6xl">
          {t("Get Paid For")}
        </h1>
        <p className="w-full text-center text-sm text-[#b8c2ca] sm:text-xl">{t("Opening Bank Account")}</p>
        <p className="w-full text-center text-sm text-[#b8c2ca] sm:text-xl">
          {t("Refer Your Friend Through your Referal Link")}
        </p>
        <p className="w-full text-center text-sm text-[#b8c2ca] sm:text-xl">
          {t("complete Tasks and apps, offers and much more")}
        </p>
        <p className="w-full text-center text-xs text-[#95afff] sm:text-lg">
          {t("Earn up to $2.05 per offer 20 Offers available See our 33,225 reviews on Trustpilot")}
        </p>

        <div className="mb-6 flex w-full items-center justify-center gap-1 rounded-sm text-center">
          <FaStar className="h-6 w-6 bg-red-300" />
          <FaStar className="h-6 w-6 bg-red-300" />
          <FaStar className="h-6 w-6 bg-red-300" />
          <FaStar className="h-6 w-6 bg-red-300" />
          <FaStar className="h-6 w-6 bg-red-300" />
        </div>
        <div className="mx-auto grid grid-cols-4 gap-1 overflow-scroll scrollbar-none sm:gap-2">
          <span className="flex h-[30px] w-[75px] items-center justify-center rounded-sm bg-yellow-400 text-center text-xs text-[#fff] sm:w-[120px] sm:text-sm">
            Bitcoin
          </span>
          <span className="t-[#fff] flex h-[30px] w-[75px] items-center justify-center rounded-sm bg-slate-400 text-sm sm:w-[120px] sm:text-center sm:text-xs">
            Ethereum
          </span>
          <span className="flex h-[30px] w-[75px] items-center justify-center rounded-sm bg-red-900 text-xs text-[#fff] sm:w-[120px] sm:text-sm">
            Litecoin
          </span>
          <span className="flex h-[30px] w-[75px] items-center justify-center rounded-sm bg-blue-800 text-xs text-[#fff] sm:w-[120px] sm:text-sm">
            PayPal
          </span>
          <span className="flex h-[30px] w-[75px] items-center justify-center rounded-sm bg-cyan-700 text-xs text-[#fff] sm:w-[120px] sm:text-sm">
            Amazon
          </span>
          <span className="flex h-[30px] w-[75px] items-center justify-center rounded-sm bg-pink-800 text-xs text-[#fff] sm:w-[120px] sm:text-sm">
            Steam
          </span>
          <span className="flex h-[30px] w-[75px] items-center justify-center rounded-sm bg-green-400 text-xs text-[#fff] sm:w-[120px] sm:text-sm">
            Apple
          </span>
          <span className="flex h-[30px] w-[75px] items-center justify-center rounded-sm bg-[#63636e] text-xs text-[#fff] sm:w-[120px] sm:text-sm">
            Google Play
          </span>
        </div>
      </div>
      {!isTokenExists && (
        <div className="mx-auto mt-10 flex w-[92%] flex-col gap-2 rounded-md border border-gray-600 bg-[#33334c] p-8 px-2 py-3 sm:w-[50%]">
          <div className="mb-4 text-center sm:rounded-md sm:bg-[#18193fb4] sm:py-3">
            <h1 className="mb-2 text-2xl font-bold tracking-wider text-white">{t("Sign Up For Free")}</h1>
            <p className="text-sm text-[#a6ada0]">{t("and win up to $250 in the free time")}</p>
          </div>
          <div className="sing-up-free mb-4 h-12 rounded-md bg-blue-900"></div>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleSignInWithGoogle}
              className="flex w-full items-center justify-between rounded-md bg-[#25253b] px-4 py-2 text-[.8rem] text-[#f7d0d0] sm:text-xs"
            >
              {t("Sign In With Google")} <FcGoogle />
            </button>
            <button className="flex w-full items-center justify-between rounded-md bg-[#25253b] px-4 py-2 text-[.8rem] text-[#f7d0d0] sm:text-xs">
              {t("Sign In With GitHub")}
              <VscGithub />
            </button>
          </div>
          <div className="mx-auto my-1 flex w-[90%] items-center gap-2">
            <div className="h-[1px] w-[45%] bg-gradient-to-l from-blue-300 to-[#2b2350]"></div>
            <span>{t("OR")}</span>
            <div className="h-[1px] w-[45%] bg-gradient-to-r from-blue-300 to-[#342872]"></div>
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
            <div className="mt-8 text-center sm:mt-4">
              <button
                type="submit"
                onClick={handlaSignIn}
                className="w-[45%] rounded-md border-[0.2px] border-white bg-[#05BA6B] py-2 font-[600] text-black"
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
