import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { GrGithub } from "react-icons/gr";
import { GrClose } from "react-icons/gr";
import { resetModel, showPopup, updateThisEntity } from "../../../context/StateManeger";
import { useAppSelector, useAppDispatch } from "../../../context/Hooks";
import Input from "./Input";
import LeftSide from "./LeftSide";
import UploadImage from "./UploadImage";
import { handleApiError, validation } from "../../../utils/common";
import { login, register, signInWithGoogle } from "../../../utils/auth";
import { IFormData } from "../../../types/othersTypes";
import { useTranslation } from "react-i18next";

const initialValue = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  profilePicture: "",
};

const RegisterationForm = () => {
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const isSignInMode = useAppSelector((state) => state.stateManeger.isSignInMode);
  const [formData, setFormData] = useState<IFormData>(initialValue);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [imageIsUploading, setImageIsUploading] = useState(false);
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
    if (imageIsUploading) return;
    setSubmiting(true);

    const { name, email, password, confirmPassword } = formData;

    let errorMessage;
    if (isSignInMode) {
      errorMessage = validation([email, password], true);
    } else {
      errorMessage = validation([name, email, password, confirmPassword], false, agreePrivacy);
    }
    if (errorMessage) {
      dispatch(
        showPopup({
          message: errorMessage,
          type: "ERROR_GENERAL",
        }),
      );
      setSubmiting(false);
      return;
    }

    try {
      if (isSignInMode) {
        const response = await login({
          formData: { email, password },
          dispatch,
        });
        localStorage.setItem("token", response.data.token);
        window.location.href = `${window.location.origin}/?redirectedfrom=login`;
      } else {
        const newUser = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          profilePicture: formData.profilePicture,
        };
        const response = await register({
          dispatch,
          formData: newUser,
          referrerUser: queryParam,
        });
        localStorage.setItem("token", response.data.token);
        socket?.emit("new-user-joined", response.data._doc);
        window.location.href = `${window.location.origin}/?redirectedfrom=signup`;
      }
    } catch (error) {
      dispatch(
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        }),
      );
    } finally {
      setSubmiting(false);
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
    <div className="fixed left-0 top-0 z-[5] flex h-screen w-full items-center justify-center">
      <div
        onClick={() => dispatch(resetModel())}
        className="fixed left-0 top-0 h-full w-full bg-[#000000b0] sm:hidden"
      ></div>
      <div className="absolute top-16 h-[75%] w-[60%] min-w-[650px] max-w-[1300px] overflow-auto rounded-xl bg-[#222337] sm:top-0 sm:h-[100dvh] sm:min-w-full sm:max-w-full xl:top-9">
        <div className="mx-8 my-4 flex items-center justify-between sm:mx-5 sm:my-0">
          <span className="text-2xl font-bold text-white sm:hidden">{t("Welcome")}</span>
          <div className="flex gap-5">
            <button
              onClick={() => dispatch(updateThisEntity({ entity: "isSignInMode", value: true }))}
              className={`${
                isSignInMode ? "border-b-[#fff] text-[#f8dcdc]" : "text-gray-600"
              } sm:text-md xs:py-2 border-b-2 border-b-[#222337] py-3 font-bold tracking-wider transition-all`}
            >
              {t("Sign In")}
            </button>

            <button
              onClick={() => {
                dispatch(updateThisEntity({ entity: "isSignInMode", value: false }));
              }}
              className={`${
                !isSignInMode ? "pacity-25 border-b-[#fff] text-[#f8dcdc]" : "text-gray-600"
              } sm:text-md xs:py-2 border-b-2 border-b-[#222337] py-3 font-bold tracking-wider`}
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
        <div className="flex justify-center">
          <div className="w-[39%] sm:hidden">
            <LeftSide
              isSignInMode={isSignInMode}
              setFormData={setFormData}
              setImageIsUploading={setImageIsUploading}
            />
          </div>
          <div className="mt-1 w-[60%] sm:w-full sm:px-4">
            {!isSignInMode && (
              <div className="hidden items-center justify-center sm:flex">
                <UploadImage setImageIsUploading={setImageIsUploading} setFormData={setFormData} />
              </div>
            )}
            <form className="flex flex-col gap-4 sm:mt-2 sm:gap-3" autoComplete="off">
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
                <div className="flex h-7 items-center">
                  <div className="h-6 w-6">
                    <button
                      type="button"
                      onClick={() => setAgreePrivacy((previous) => !previous)}
                      className={`transition-all ${
                        agreePrivacy
                          ? "h-[25px] w-[12px] rotate-[32deg] border-b border-r border-yellow-500"
                          : "h-[22px] w-[22px] border border-gray-400"
                      }`}
                    ></button>
                  </div>
                  <p className="ml-4 max-w-[85%] text-sm font-[600] text-[#97b4a2] sm:text-[10px]">
                    {t("By Signing Up You Are Agreeing of our privacy Policy and Terms of Service")}
                  </p>
                </div>
              )}
              <button
                type="submit"
                className="mt-2 w-[35%] rounded-md border-[0.2px] border-white bg-[#05BA6B] py-2 font-[600] text-black disabled:opacity-60 sm:mx-auto sm:w-[90%]"
                onClick={handleSubmite}
                disabled={submiting || imageIsUploading}
              >
                {!isSignInMode
                  ? `${submiting ? "Submiting" : t("Sign Up")} `
                  : `${submiting ? "Submiting" : t("Sign In")} `}
              </button>
              <div className="mx-auto flex w-full items-center gap-2">
                <div className="h-[1.5px] w-[45%] bg-gradient-to-l from-blue-300 to-[#201557]"></div>
                <span>OR</span>
                <div className="h-[1.5px] w-[45%] bg-gradient-to-r from-blue-300 to-[#201557]"></div>
              </div>
              <div className="mb-4 flex gap-4 sm:gap-2">
                <button
                  onClick={handleSignInWithGoogle}
                  className="flex w-[49%] items-center justify-between rounded-md bg-[#7474bb52] px-3 py-3 sm:py-[6px]"
                >
                  <FcGoogle className="text-2xl" />
                  <span className="text-sm font-[500]">
                    <span className="sm:hidden">{t("Sign In With")}</span>
                    {t("Google")}
                  </span>
                </button>
                <button className="flex w-[49%] items-center justify-between rounded-md bg-[#7474bb52] px-3 py-3 text-xs sm:py-[6px]">
                  <GrGithub className="text-2xl" />
                  <span className="text-sm font-[500]">
                    <span className="sm:hidden"> {t("Sign In With")} </span> {t("GitHub")}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterationForm;
