import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { GrGithub } from "react-icons/gr";
import { FaPauseCircle } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import { IoMdPlay } from "react-icons/io";
import {
  setCurrentUser,
  showPopup,
  toggleSigningMode,
  toggleRegisterForm,
} from "../../../context/StateManeger";
import { User } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../context/Hooks";
import { getUserData, validation } from "../../../context/functions";
import { auth, db, storage } from "../../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  UploadTask,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Input from "./Input";
import LeftSide from "./LeftSide";
import UploadImage from "./UploadImage";
import { makeRequest } from "../../../utils";
import Spinner from "../../Others/Spinner";
import { BiErrorAlt } from "react-icons/bi";

export interface TypeFormData {
  name: string;
  password: string;
  confirmPassword: string;
  email: string;
  profilePicture?: string;
}

const initialValue = {
  name: "",
  password: "",
  confirmPassword: "",
  email: "",
  profilePicture: "",
};

const RegisterationForm = () => {
  const [formData, setFormData] = useState<TypeFormData>(initialValue);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [uploadedTask, setUploadedTask] = useState<UploadTask | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [getFile, setGetFile] = useState<File | null>(null);
  const [filePercentage, setFilePercentage] = useState<number>(0);
  const [submiting, setSubmiting] = useState(false);
  const [searchParams] = useSearchParams();
  const { currentUser, isSignIn } = useAppSelector(
    (state) => state.stateManeger
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const searchValue = searchParams.get("ref");

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
    setSubmiting(true);
    if (currentUser) {
      return;
    }
    if (!isSignIn) {
      try {
        if (
          validation(
            [
              formData.name,
              formData.email,
              formData.password,
              formData.confirmPassword,
            ],
            isSignIn,
            agreePrivacy
          )
        ) {
          const errorMessage = validation(
            [
              formData.name,
              formData.email,
              formData.password,
              formData.confirmPassword,
            ],
            isSignIn,
            agreePrivacy
          );
          dispatch(
            showPopup({
              status: true,
              message: errorMessage,
              icon: <BiErrorAlt />,
            })
          );
          setSubmiting(false);
          return;
        }
        dispatch(
          showPopup({
            status: true,
            message: "signing Up....",
            icon: <Spinner className="w-5 h-5" />,
          })
        );
        const axiosResponse = await makeRequest.post(
          `api/auth/register?ref=${searchValue || ""}`,
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            profilePicture: formData.profilePicture,
            confirmPassword: formData.confirmPassword,
          }
        );
        if (axiosResponse.status === 201) {
          localStorage.setItem("token", axiosResponse.data.token);
        }
        window.location.href = `${
          import.meta.env.VITE_BASE_URL
        }/?redirectedfrom=signup`;
      } catch (err: any) {
        const errorMessage = err.response.data.error;
        if (typeof errorMessage === "string") {
          dispatch(
            showPopup({
              status: true,
              message: errorMessage,
              icon: <BiErrorAlt />,
            })
          );
        } else {
          dispatch(
            showPopup({
              status: true,
              message: "an Error occurred, Try Again",
              icon: <BiErrorAlt />,
            })
          );
        }
        setSubmiting(false);
      }
    } else {
      try {
        if (
          validation(
            [formData.email, formData.password],
            isSignIn,
            agreePrivacy
          )
        ) {
          const errorMessage = validation(
            [formData.email, formData.password],
            isSignIn,
            agreePrivacy
          );
          dispatch(
            showPopup({
              status: true,
              message: errorMessage,
              icon: <BiErrorAlt />,
            })
          );

          setSubmiting(false);

          return;
        }
        dispatch(
          showPopup({
            status: true,
            icon: <Spinner className="w-5 h-5" />,
            message: "Loging In...",
          })
        );

        const axiosResponse = await makeRequest.post(`api/auth/login`, {
          email: formData.email,
          password: formData.password,
        });
        if (axiosResponse.status === 200) {
          localStorage.setItem("token", axiosResponse.data.token);
        }
        window.location.href = `${
          import.meta.env.VITE_BASE_URL
        }/?redirectedfrom=login`;
      } catch (err: any) {
        const errorMessage = err.response.data.error;
        if (typeof errorMessage === "string") {
          dispatch(
            showPopup({
              status: true,
              message: errorMessage,
              icon: <BiErrorAlt />,
            })
          );
        } else {
          dispatch(
            showPopup({
              status: true,
              message: "Fail to Login, Try Again",
              icon: <BiErrorAlt />,
            })
          );
        }
        setSubmiting(false);
      }
    }
  };

  const handleSignInWithGoogle = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const response = await getUserData(result.user.providerData[0].uid);

      if (response.exists()) {
        dispatch(
          setCurrentUser({ ...response.data(), _id: response.id } as User)
        );
        navigate("/myprofile");
      } else {
        await setDoc(
          doc(
            db,
            import.meta.env.VITE_USERS_COLLECTION_NAME,
            result.user.providerData[0].uid
          ),
          {
            name: result.user.providerData[0].displayName,
            email: result.user.providerData[0].email,
            profilePicture: result.user.providerData[0].photoURL,
            emailVerified: result.user.emailVerified,
            points: 0,
            copouns: [],
            completedTasks: [],
            activeFrame: null,
            myFrames: [],
            mySongs: [],
            dailyReward: [],
          }
        );
        const response = await getUserData(result.user.providerData[0].uid);
        //
        dispatch(
          setCurrentUser({ ...response.data(), _id: response.id } as User)
        );
        dispatch(toggleRegisterForm(false));
        navigate("/myprofile");
      }
    } catch (error) {
      dispatch(
        showPopup({
          status: true,
          message: "somthing went wrong, check your Network connection",
          icon: <BiErrorAlt />,
        })
      );
    }
  };

  useEffect(() => {
    const uploadFile = () => {
      if (getFile) {
        if (getFile.size > 2 * 1024 * 1024) {
          dispatch(
            showPopup({
              status: true,
              message: `image size expected to be less than 2 MB`,
              icon: <BiErrorAlt />,
            })
          );
          setGetFile(null);
          return;
        }
        const name: string = new Date().getTime() + getFile.name;
        const storageRef = ref(storage, `users-profile-images/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, getFile);
        setUploadedTask(uploadTask);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFilePercentage(progress);
            setUploading(true);
            switch (snapshot.state) {
              case "paused":
                setPaused(true);
                // console.log("Upload is paused");
                break;
              case "running":
                setPaused(false);
                // console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (err) => {
            dispatch(
              showPopup({
                status: true,
                message:
                  err.code === "storage/canceled"
                    ? "You Canceled Uploading "
                    : err.code === "storage/unauthorized"
                    ? "Image size must be less than 2 MB"
                    : "an Error occured, try again",
                icon: <BiErrorAlt />,
              })
            );
            setUploading(false);
            console.log(err);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFormData((previous) => {
                return { ...previous, profilePicture: downloadURL };
              });
              setUploading(false);
            });
          }
        );
      }
    };

    uploadFile();
  }, [getFile]);

  const handleCancelUploading = () => {
    if (uploadedTask) {
      uploadedTask.cancel();
      setFilePercentage(0);
      setUploading(false);
      setGetFile(null);
    }
  };

  const handlePuase = () => {
    if (uploadedTask) {
      uploadedTask.pause();
    }
  };

  const handleResume = () => {
    if (uploadedTask) {
      uploadedTask.resume();
    }
  };

  useEffect(() => {
    if (isSignIn) {
      handleCancelUploading();
    }
    setFormData(initialValue);
  }, [isSignIn]);

  const showPassword = () => {
    setHidePassword((previous) => !previous);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[100dvh] flex items-center justify-center z-[5] ">
      <div
        onClick={() => {
          dispatch(toggleRegisterForm(false));
        }}
        className="fixed top-0 left-0 w-full h-full bg-[#00000075] sm:hidden "
      ></div>
      <div className="absolute top-16 sm:top-0 w-[55%] h-[79%] lg:w-[82%] sm:w-full sm:h-[100dvh] bg-[#222337]  rounded-xl overflow-scroll scrollbar-none">
        <div className="flex justify-between items-center mx-8 my-4 sm:mx-5 sm:my-0 ">
          <span className="text-white text-2xl font-bold sm:hidden">
            Welcome
          </span>
          <div className="flex gap-5">
            <button
              onClick={() => dispatch(toggleSigningMode(true))}
              className={`${
                isSignIn
                  ? " border-b-[#fff]  text-[#f8dcdc] "
                  : " text-gray-600"
              } transition-all sm:text-md font-bold tracking-wider border-b-2 border-b-[#222337] py-3 xs:py-2`}
            >
              Sign In
            </button>

            <button
              onClick={() => {
                dispatch(toggleSigningMode(false));
              }}
              className={`${
                !isSignIn
                  ? "pacity-25 border-b-[#fff] text-[#f8dcdc] "
                  : "text-gray-600"
              }  sm:text-md  font-bold tracking-wider border-b-2 border-b-[#222337] py-3 xs:py-2`}
            >
              Sign Up
            </button>
          </div>
          <button
            onClick={() => {
              dispatch(toggleRegisterForm(false));
            }}
            className="w-8 h-6 flex items-center justify-center font-bold bg-[#43a153] rounded-md"
          >
            <GrClose />
          </button>
        </div>
        <div className="flex justify-center px-4 ">
          <LeftSide
            isSignIn={isSignIn}
            uploading={uploading}
            handleCancelUploading={handleCancelUploading}
            paused={paused}
            handlePuase={handlePuase}
            handleResume={handleResume}
            setGetFile={setGetFile}
            filePercentage={filePercentage}
            profilePicture={formData.profilePicture}
          />
          <div className="w-[60%] sm:w-full">
            {!isSignIn && (
              <div className="hidden sm:flex ">
                <div className=" flex flex-col items-center justify-center gap-2">
                  <span className="tracking-wider font-bold text-[#c1c5be] px-3 py-2 bg-[#beff270e]">
                    Profile Picture
                  </span>
                  {uploading && (
                    <div className="w-full p-2 bg-[#61a3223b] rounded-md flex flex-col items-center gap-3 ">
                      <span className="flex items-center justify-evenly w-full">
                        Uploading...
                        {paused && (
                          <button onClick={handleResume}>
                            <IoMdPlay className="text-xl" />
                          </button>
                        )}
                        {!paused && (
                          <button onClick={handlePuase}>
                            <FaPauseCircle className="text-xl" />
                          </button>
                        )}
                      </span>
                      <button
                        onClick={handleCancelUploading}
                        className="w-full bg-[#71c04d] rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <UploadImage
                  paused={paused}
                  uploading={uploading}
                  setGetFile={setGetFile}
                  profilePicture={formData.profilePicture}
                  filePercentage={filePercentage}
                />
              </div>
            )}
            <form
              className="flex flex-col gap-4 sm:gap-3 sm:mt-2"
              autoComplete="off"
            >
              {!isSignIn && (
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
                type={hidePassword ? "password" : "text"}
                label="Password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="Enter Your Password"
                showPassword={showPassword}
              />
              {!isSignIn && (
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
              {!isSignIn && (
                <div className="flex items-center justify-between p-4 h-6 ">
                  <button
                    type="button"
                    onClick={() => setAgreePrivacy((previous) => !previous)}
                    className={`transition-all ${
                      agreePrivacy
                        ? "border-b border-r rotate-[32deg] border-yellow-500 w-[12px] h-[25px]"
                        : "w-[22px] h-[22px] border-gray-400 border"
                    }`}
                  ></button>
                  <p className="text-sm font-[600] sm:text-[10px] text-[#97b4a2] max-w-[85%]">
                    By Signing Up You Are Agreeing of our privacy Policy and
                    Terms of Service
                  </p>
                </div>
              )}
              <button
                type="submit"
                className=" disabled:opacity-60 bg-[#05BA6B] text-black py-2 w-[35%] font-[600] rounded-md border-[0.2px] border-white mt-2 sm:w-[90%] sm:mx-auto"
                onClick={handleSubmite}
                disabled={submiting || uploading}
              >
                {!isSignIn
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
