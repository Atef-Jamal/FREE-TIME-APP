import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { GrGithub } from "react-icons/gr";
import { GrClose } from "react-icons/gr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetModel,
  openToast,
  updateStateField,
  selectUserAuth,
  selectIsSignInMode,
} from "../../../../context/appStateSlice";
import { useAppSelector, useAppDispatch } from "../../../../context/hooks";
import { cn, handleApiError } from "../../../../utilities";
import { handleSignInWithOauth, login, registerUser } from "../../../../services";
import LeftSide from "./LeftSide";
import { IoMdEye } from "react-icons/io";
import UploadIcon from "../../../../assets/images/upload-icon.png";
import { AuthFormValues, authSchema } from "../../../../lib/zod";

const RegisterationForm = () => {
  const userAuth = useAppSelector(selectUserAuth);
  const isSignInMode = useAppSelector(selectIsSignInMode);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [inputType, setInputType] = useState("password");
  const inputUploadRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation("register");
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const queryParam = searchParams.get("referrerUser") || undefined;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      mode: isSignInMode ? "login" : "register",
    },
  });

  const handleShowPassword = () => {
    setInputType((prev) => (prev === "text" ? "password" : "text"));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setValue("profilePicture", file);
      setPreviewUrl(url);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInvalidSubmit = (fieldErrors: any) => {
    let message = "";

    if (fieldErrors.name?.message) {
      message = fieldErrors.name.message;
    } else if (fieldErrors.email?.message) {
      message = fieldErrors.email.message;
    } else if (fieldErrors.password?.message) {
      message = fieldErrors.password.message;
    } else if (fieldErrors.confirmPassword?.message) {
      message = fieldErrors.confirmPassword.message;
    } else if (fieldErrors.profilePicture?.message) {
      message = fieldErrors.profilePicture.message.toString();
    } else if (!agreePrivacy) {
      message = "You must agree to the privacy policy to continue.";
    }
    if (message) {
      dispatch(openToast({ message, type: "ERROR_GENERAL" }));
      return;
    }
  };

  const onValidSubmit = async (data: AuthFormValues) => {
    if (userAuth === "authenticated") return;
    try {
      if (data.mode === "register") {
        if (!agreePrivacy) {
          dispatch(
            openToast({
              message: "You must agree to the privacy policy to continue.",
              type: "ERROR_GENERAL",
            }),
          );
          return;
        }
        dispatch(openToast({ message: "Registering....", type: "LOADING" }));
        await registerUser({ data, referrerUser: queryParam });
      } else {
        dispatch(openToast({ message: "Logging In....", type: "LOADING" }));
        await login({ data });
      }
    } catch (error) {
      dispatch(openToast({ message: handleApiError(error), type: "ERROR_GENERAL" }));
    }
  };

  useEffect(() => {
    setValue("mode", isSignInMode ? "login" : "register");
  }, [isSignInMode, setValue]);

  return (
    <div className="h-full w-full overflow-y-auto border border-rose-800 bg-[#222337] px-2 py-3 scrollbar-thin md:px-4 lg:h-fit lg:min-h-[450px] lg:w-[80%] lg:max-w-[900px] lg:rounded-xl">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-2xl font-bold text-[#61d43e]">{t("Welcome")}</span>
        <div className="flex gap-5">
          <button
            onClick={() => dispatch(updateStateField({ entity: "isSignInMode", value: true }))}
            className={cn(
              "border-b-2 border-b-[#222337] py-1 font-bold tracking-wider transition-all lg:py-2",
              isSignInMode ? "border-b-[#fff] text-[#f8dcdc]" : "text-gray-600",
            )}
          >
            {t("Sign In")}
          </button>

          <button
            onClick={() => {
              dispatch(updateStateField({ entity: "isSignInMode", value: false }));
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
      <form
        onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
        autoComplete="off"
        className="flex gap-x-3"
      >
        <div className="hidden w-[40%] md:block">
          <LeftSide
            inputUploadRef={inputUploadRef}
            handleFileChange={handleFileChange}
            isSignInMode={isSignInMode}
            register={register}
            previewUrl={previewUrl}
          />
        </div>
        <div className="flex-1">
          {!isSignInMode && (
            <div className="flex items-center justify-center md:hidden">
              <div
                onClick={() => inputUploadRef.current?.click()}
                className="relative h-[100px] w-[100px] lg:h-[110px] lg:w-[110px]"
              >
                <input
                  id="imageUploadInput"
                  type="file"
                  accept="image/*"
                  className="hidden h-full w-full"
                  {...(register("profilePicture"),
                  {
                    ref: (element) => {
                      register("profilePicture").ref(element);
                      inputUploadRef.current = element;
                    },
                  })}
                  onChange={handleFileChange}
                />
                <img
                  src={previewUrl || UploadIcon}
                  alt=""
                  className={cn("h-full w-full object-fill", previewUrl && "border")}
                />
              </div>
            </div>
          )}
          <div className="mt-2 flex flex-col gap-2">
            {!isSignInMode && (
              <div className="flex w-full flex-col gap-1">
                <label htmlFor={"name"} className="tracking-wider text-[#6be8f8ee]">
                  name
                </label>

                <div className="relative">
                  <input
                    type={"text"}
                    id={"name"}
                    placeholder={t("Enter Your Name")}
                    {...register("name")}
                    className={`w-full rounded-md bg-[#0d0d22b9] px-4 py-2 text-sm text-[#7295f7] outline-none placeholder:opacity-50`}
                  />
                </div>
              </div>
            )}
            <div className="flex w-full flex-col gap-1">
              <label htmlFor={"email"} className="tracking-wider text-[#6be8f8ee]">
                Email
              </label>
              <div className="relative">
                <input
                  type={"email"}
                  id={"email"}
                  placeholder={t("Enter Your Email")}
                  {...register("email")}
                  className={`w-full rounded-md bg-[#0d0d22b9] px-4 py-2 text-sm text-[#7295f7] outline-none placeholder:opacity-50`}
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-1">
              <label htmlFor={"password"} className="tracking-wider text-[#6be8f8ee]">
                Password
              </label>
              <div className="relative">
                <input
                  type={inputType}
                  id={"password"}
                  placeholder={t("Enter Your Password")}
                  {...register("password")}
                  className={`w-full rounded-md bg-[#0d0d22b9] px-4 py-2 text-sm text-[#7295f7] outline-none placeholder:opacity-50`}
                />
                <button type="button" onClick={handleShowPassword} className="absolute right-2 top-[6px]">
                  <IoMdEye className="text-xl" />
                </button>
              </div>
            </div>

            {!isSignInMode && (
              <div className="flex w-full flex-col gap-1">
                <label htmlFor={"confirmPassword"} className="tracking-wider text-[#6be8f8ee]">
                  Confirm Your Password
                </label>
                <div className="relative">
                  <input
                    type={"password"}
                    id={"confirmPassword"}
                    placeholder={t("Confirm Your Password")}
                    {...register("confirmPassword")}
                    className={`w-full rounded-md bg-[#0d0d22b9] px-4 py-2 text-sm text-[#7295f7] outline-none placeholder:opacity-50`}
                  />
                </div>
              </div>
            )}
            {!isSignInMode && (
              <div className="my-3 flex h-7 items-center">
                <div className="h-6 w-6">
                  <button
                    type="button"
                    onClick={() => setAgreePrivacy(!agreePrivacy)}
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
              disabled={isSubmitting}
            >
              {!isSignInMode
                ? `${isSubmitting ? "Submiting" : t("Sign Up")} `
                : `${isSubmitting ? "Submiting" : t("Sign In")} `}
            </button>
            <div className="flex w-full items-center gap-x-2">
              <div className="h-[1.5px] w-[45%] bg-gradient-to-l from-blue-300 to-[#201557]"></div>
              <span>OR</span>
              <div className="h-[1.5px] w-[45%] bg-gradient-to-r from-blue-300 to-[#201557]"></div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSignInWithOauth("google", dispatch);
                }}
                className="flex w-[49%] items-center justify-between rounded-md bg-[#7474bb52] px-3 py-[6px] lg:py-3"
              >
                <FcGoogle className="text-2xl" />
                <p className="flex items-center gap-x-1">
                  <span className="hidden md:block">{t("Sign In With")}</span>
                  {t("Google")}
                </p>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSignInWithOauth("github", dispatch);
                }}
                className="flex w-[49%] items-center justify-between rounded-md bg-[#7474bb52] px-3 py-[6px] lg:py-3"
              >
                <GrGithub className="text-2xl" />
                <p className="flex items-center gap-x-1">
                  <span className="hidden md:block"> {t("Sign In With")} </span> {t("GitHub")}
                </p>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterationForm;
