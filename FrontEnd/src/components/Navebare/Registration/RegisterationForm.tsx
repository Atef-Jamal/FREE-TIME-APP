import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { GrGithub } from "react-icons/gr";
import { GrClose } from "react-icons/gr";
import { showPopup, toggleThisEntity } from "../../../context/StateManeger";
import { useAppSelector, useAppDispatch } from "../../../context/Hooks";
import Input from "./Input";
import LeftSide from "./LeftSide";
import UploadImage from "./UploadImage";
import { handleApiError, validation } from "../../../utils/common";
import { login, register, signInWithGoogle } from "../../../utils/auth";
import { TypeFormData } from "../../../types/othersTypes";

const initialValue = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  profilePicture: null,
};

const RegisterationForm = () => {
  const { currentUser, isSignInMode, socket } = useAppSelector(
    (state) => state.stateManeger
  );
  const [formData, setFormData] = useState<TypeFormData>(initialValue);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("referrerUser");
  const dispatch = useAppDispatch();

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
    if (currentUser) return;
    setSubmiting(true);

    const { name, email, password, confirmPassword, profilePicture } = formData;

    let errorMessage;

    if (isSignInMode) {
      errorMessage = validation([email, password], true);
    } else {
      errorMessage = validation(
        [name, email, password, confirmPassword],
        false,
        agreePrivacy
      );
    }
    if (errorMessage) {
      dispatch(
        showPopup({
          message: errorMessage,
          type: "ERROR_GENERAL",
        })
      );
      setSubmiting(false);
      return;
    }

    try {
      if (isSignInMode) {
        const response = await login({ email, password }, dispatch);
        localStorage.setItem("token", response.data.token);
        window.location.href = `${window.location.origin}/?redirectedfrom=login`;
      } else {
        const userFormData = new FormData();
        userFormData.append("name", name);
        userFormData.append("email", email);
        userFormData.append("password", password);
        userFormData.append("confirmPassword", confirmPassword);
        userFormData.append("profilePicture", profilePicture as File);

        const response = await register(userFormData, dispatch, queryParam);
        localStorage.setItem("token", response.data.token);
        socket?.emit("new-user-joined", response.data._doc);
        window.location.href = `${window.location.origin}/?redirectedfrom=signup`;
      }
    } catch (error) {
      console.log(error);
      dispatch(
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        })
      );
    } finally {
      setSubmiting(false);
    }
  };

  const handleSignInWithGoogle = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      await signInWithGoogle(dispatch);
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
    <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-[5] ">
      <div
        onClick={() => {
          dispatch(
            toggleThisEntity({ entity: "openRegisterForm", value: false })
          );
        }}
        className="fixed top-0 left-0 w-full h-full bg-[#00000075] sm:hidden "
      ></div>
      <div className="absolute top-16 xl:top-9 sm:top-0 w-[60%] max-w-[1300px] min-w-[650px]  h-[75%] sm:min-w-full sm:max-w-full sm:h-[100dvh] bg-[#222337]  rounded-xl overflow-auto ">
        <div className="flex justify-between items-center mx-8 my-4 sm:mx-5 sm:my-0 ">
          <span className="text-white text-2xl font-bold sm:hidden">
            Welcome
          </span>
          <div className="flex gap-5">
            <button
              onClick={() =>
                dispatch(
                  toggleThisEntity({ entity: "isSignInMode", value: true })
                )
              }
              className={`${
                isSignInMode
                  ? " border-b-[#fff]  text-[#f8dcdc] "
                  : " text-gray-600"
              } transition-all sm:text-md font-bold tracking-wider border-b-2 border-b-[#222337] py-3 xs:py-2`}
            >
              Sign In
            </button>

            <button
              onClick={() => {
                dispatch(
                  toggleThisEntity({ entity: "isSignInMode", value: false })
                );
              }}
              className={`${
                !isSignInMode
                  ? "pacity-25 border-b-[#fff] text-[#f8dcdc] "
                  : "text-gray-600"
              }  sm:text-md  font-bold tracking-wider border-b-2 border-b-[#222337] py-3 xs:py-2`}
            >
              Sign Up
            </button>
          </div>
          <button
            onClick={() => {
              dispatch(
                toggleThisEntity({ entity: "openRegisterForm", value: false })
              );
            }}
            className="w-8 h-6 flex items-center justify-center font-bold bg-[#43a153] rounded-md"
          >
            <GrClose />
          </button>
        </div>
        <div className="flex justify-center">
          <div className="w-[39%] sm:hidden">
            <LeftSide
              isSignInMode={isSignInMode}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
          <div className="w-[60%] sm:w-full sm:px-4 mt-1">
            {!isSignInMode && (
              <div className="hidden sm:flex items-center justify-center">
                <UploadImage formData={formData} setFormData={setFormData} />
              </div>
            )}
            <form
              className="flex flex-col gap-4 sm:gap-3 sm:mt-2"
              autoComplete="off"
            >
              {!isSignInMode && (
                <Input
                  type="text"
                  label="Name"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter Your name"
                />
              )}
              <Input
                type="email"
                label="Email address"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Enter Your E-Email"
              />
              <Input
                type={"password"}
                label="Password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="Enter Your Password"
              />
              {!isSignInMode && (
                <Input
                  type="password"
                  label="Confirm Your Paaword"
                  name="confirmPassword"
                  id="confirm-password"
                  value={formData.confirmPassword}
                  onChange={handleFormChange}
                  placeholder="Confirm Your Paaword"
                />
              )}
              {!isSignInMode && (
                <div className="flex items-center  h-7">
                  <div className="w-6 h-6">
                    <button
                      type="button"
                      onClick={() => setAgreePrivacy((previous) => !previous)}
                      className={`transition-all ${
                        agreePrivacy
                          ? "border-b border-r rotate-[32deg] border-yellow-500 w-[12px] h-[25px]"
                          : "w-[22px] h-[22px] border-gray-400 border"
                      }`}
                    ></button>
                  </div>
                  <p className="text-sm font-[600] sm:text-[10px] text-[#97b4a2] max-w-[85%] ml-4">
                    By Signing Up You Are Agreeing of our privacy Policy and
                    Terms of Service
                  </p>
                </div>
              )}
              <button
                type="submit"
                className=" disabled:opacity-60 bg-[#05BA6B] text-black py-2 w-[35%] font-[600] rounded-md border-[0.2px] border-white mt-2 sm:w-[90%] sm:mx-auto"
                onClick={handleSubmite}
                disabled={submiting}
              >
                {!isSignInMode
                  ? `${submiting ? "Submiting" : "SIGN UP"} `
                  : `${submiting ? "Submiting" : "SIGN IN"} `}
              </button>
              <div className="flex w-full mx-auto gap-2 items-center ">
                <div className="w-[45%] h-[1.5px] bg-gradient-to-l from-blue-300 to-[#201557] "></div>
                <span>or</span>
                <div className="w-[45%] h-[1.5px] bg-gradient-to-r from-blue-300 to-[#201557] "></div>
              </div>
              <div className="flex gap-4 sm:gap-2 mb-4">
                <button
                  onClick={handleSignInWithGoogle}
                  className="flex justify-between items-center bg-[#7474bb52] py-3 sm:py-[6px] px-3 rounded-md w-[49%]"
                >
                  <FcGoogle className="text-2xl" />
                  <span className="text-sm font-[500] ">
                    <span className="sm:hidden"> Sign In With </span>Google
                  </span>
                </button>
                <button className="text-xs flex justify-between items-center bg-[#7474bb52] rounded-md w-[49%] py-3 sm:py-[6px] px-3">
                  <GrGithub className="text-2xl" />
                  <span className="text-sm font-[500] ">
                    <span className="sm:hidden"> Sign In With </span> GitHub
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
