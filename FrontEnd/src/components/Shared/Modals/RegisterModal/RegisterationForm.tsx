import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { GrGithub } from "react-icons/gr";
import { GrClose } from "react-icons/gr";
import { IFormData } from "../../../../types/othersTypes";
import { resetModel, openToast, updateThisEntity } from "../../../../context/appStateSlice";
import { useAppSelector, useAppDispatch } from "../../../../context/hooks";
import { cn, handleApiError, validateCredentials } from "../../../../utilities";
import { handleSignInWithOauth, login, register } from "../../../../services";
import LeftSide from "./LeftSide";
import UploadImage from "../../Common/UploadImage";
import Input from "../../Common/Input";

const initialValue = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  profilePicture: null,
};

const RegisterationForm = () => {
  const currentUserStatus = useAppSelector((state) => state.appState.currentUserStatus);
  const socket = useAppSelector((state) => state.appState.socket);
  const isSignInMode = useAppSelector((state) => state.appState.isSignInMode);
  const [formData, setFormData] = useState<IFormData>(initialValue);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("register");

  const queryParam = searchParams.get("referrerUser");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((previous) => {
      return {
        ...previous,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmite = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentUserStatus === "authenticated") return;

    setSubmiting(true);

    const result = validateCredentials(formData, isSignInMode, agreePrivacy);

    if (!result.isValid) {
      dispatch(
        openToast({
          message: Object.values(result.errors).join(", "),
          type: "ERROR_GENERAL",
        }),
      );
      setSubmiting(false);
      return;
    }

    try {
      if (isSignInMode) {
        await login({ formData, dispatch });
      } else {
        await register({ formData, referrerUser: queryParam, dispatch });
        socket?.emit("new-user-registered");
      }
    } catch (error) {
      dispatch(
        openToast({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        }),
      );
    } finally {
      setSubmiting(false);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto border border-rose-800 bg-[#222337] px-2 py-3 scrollbar-thin md:px-4 lg:h-fit lg:min-h-[450px] lg:w-[80%] lg:max-w-[900px] lg:rounded-xl">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-2xl font-bold text-[#61d43e]">{t("Welcome")}</span>
        <div className="flex gap-5">
          <button
            onClick={() => dispatch(updateThisEntity({ entity: "isSignInMode", value: true }))}
            className={cn(
              "border-b-2 border-b-[#222337] py-1 font-bold tracking-wider transition-all lg:py-2",
              isSignInMode ? "border-b-[#fff] text-[#f8dcdc]" : "text-gray-600",
            )}
          >
            {t("Sign In")}
          </button>

          <button
            onClick={() => {
              dispatch(updateThisEntity({ entity: "isSignInMode", value: false }));
            }}
            className={cn(
              "border-b-2 border-b-[#222337] py-1 font-bold tracking-wider lg:py-2",
              !isSignInMode ? "pacity-25 border-b-[#fff] text-[#f8dcdc]" : "text-gray-600",
            )}
          >
            {t("Sign Up")}
          </button>
        </div>
        <button
          onClick={() => dispatch(resetModel())}
          className="flex h-6 w-8 items-center justify-center rounded-md bg-[#43a153] font-bold"
        >
          <GrClose />
        </button>
      </div>
      <div className="flex gap-x-3">
        <div className="hidden w-[40%] md:block">
          <LeftSide
            isSignInMode={isSignInMode}
            formData={formData}
            setFormData={setFormData}
            // setImageIsUploading={setImageIsUploading}
          />
        </div>
        <div className="flex-1">
          {!isSignInMode && (
            <div className="flex items-center justify-center md:hidden">
              <UploadImage formData={formData} setFormData={setFormData} />
            </div>
          )}
          <form autoComplete="off" className="mt-2 flex flex-col gap-2">
            {!isSignInMode && (
              <Input
                type="text"
                label={t("Name")}
                name="name"
                id="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder={t("Enter Your Name")}
              />
            )}
            <Input
              type="email"
              label={t("Email Address")}
              name="email"
              id="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder={t("Enter Your Email")}
            />
            <Input
              type={"password"}
              label={t("Password")}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleFormChange}
              placeholder={t("Enter Your Password")}
            />
            {!isSignInMode && (
              <Input
                type="password"
                label={t("Confirm Your Password")}
                name="confirmPassword"
                id="confirm-password"
                value={formData.confirmPassword}
                onChange={handleFormChange}
                placeholder={t("Confirm Your Password")}
              />
            )}
            {!isSignInMode && (
              <div className="my-3 flex h-7 items-center">
                <div className="h-6 w-6">
                  <button
                    type="button"
                    onClick={() => setAgreePrivacy((previous) => !previous)}
                    className={cn(
                      "transition-all",
                      agreePrivacy
                        ? "h-[25px] w-[12px] rotate-[32deg] border-b border-r border-yellow-500"
                        : "h-[22px] w-[22px] border border-gray-400",
                    )}
                  ></button>
                </div>
                <p className="ml-2 max-w-[85%] text-xs font-bold text-[#97b4a2] md:text-sm">
                  {t("By Signing Up You Are Agreeing of our privacy Policy and Terms of Service")}
                </p>
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-md border border-white bg-[#05BA6B] py-1 font-[600] text-black disabled:opacity-60 lg:py-2"
              onClick={handleSubmite}
              disabled={submiting}
            >
              {!isSignInMode
                ? `${submiting ? "Submiting" : t("Sign Up")} `
                : `${submiting ? "Submiting" : t("Sign In")} `}
            </button>
            <div className="flex w-full items-center gap-x-2">
              <div className="h-[1.5px] w-[45%] bg-gradient-to-l from-blue-300 to-[#201557]"></div>
              <span>OR</span>
              <div className="h-[1.5px] w-[45%] bg-gradient-to-r from-blue-300 to-[#201557]"></div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSignInWithOauth("google", dispatch)}
                className="flex w-[49%] items-center justify-between rounded-md bg-[#7474bb52] px-3 py-[6px] lg:py-3"
              >
                <FcGoogle className="text-2xl" />
                <p className="flex items-center gap-x-1">
                  <span className="hidden md:block">{t("Sign In With")}</span>
                  {t("Google")}
                </p>
              </button>
              <button
                onClick={() => handleSignInWithOauth("github", dispatch)}
                className="flex w-[49%] items-center justify-between rounded-md bg-[#7474bb52] px-3 py-[6px] lg:py-3"
              >
                <GrGithub className="text-2xl" />
                <p className="flex items-center gap-x-1">
                  <span className="hidden md:block"> {t("Sign In With")} </span> {t("GitHub")}
                </p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterationForm;
