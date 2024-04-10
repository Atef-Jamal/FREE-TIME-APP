import React, { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BsCheckCircleFill, BsExclamationOctagonFill } from "react-icons/bs";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { MdOutlineStarOutline } from "react-icons/md";
import {
  ezgifLogo,
  stashLogo,
  chooseTask,
  check,
  moneyBag,
  paypal,
  dollarInHand,
  support,
  timers,
  moneyHome,
  avatar,
} from "../assets";
import { FaStar } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { VscGithub } from "react-icons/vsc";
import { MdOutlineWatchLater } from "react-icons/md";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import {
  setCurrentUser,
  showPopup,
  toggleRegisterForm,
} from "../context/StateManeger";

import { useAppDispatch, useAppSelector } from "../context/Hooks";
import Input from "../components/Registration/Input";
import Faq from "../components/Home/Faq";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { getUserData, timeAgoFromMongoDBDate } from "../context/functions";
import { User } from "../types";
import { useTranslation } from "react-i18next";
import axios from "axios";

interface TypeTestimonial {
  _id: string;
  user: User;
  content: string;
  stars: number;
  createdAt: Date;
}

const Home = () => {
  const { currentUser, token } = useAppSelector((state) => state.stateManeger);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [stars, setStars] = useState<number>(1);
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const [testimonials, setTestimonials] = useState<TypeTestimonial[]>([]);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const searchValue = searchParams.get("ref");

  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  };

  const showPassword = () => {
    setHidePassword((previous) => !previous);
  };

  useEffect(() => {
    if (searchValue && !currentUser) {
      dispatch(toggleRegisterForm(true));
    }
  }, [dispatch, searchValue, currentUser]);

  const handlaSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const response = await getUserData(user.uid);
      if (response.exists()) {
        dispatch(
          setCurrentUser({ ...response.data(), _id: response.id } as User)
        );
        setEmail("");
        setPassword("");
        dispatch(
          showPopup({
            status: true,
            message: "Successfully Sign In ",
            icon: <BsCheckCircleFill />,
          })
        );
      }
    } catch (err: any) {
      let msg = "";
      if (err.message.includes("user-not-found")) {
        msg = "User Does Not Exist";
      } else if (err.message.includes("wrong-password")) {
        msg = "Wrong Password";
      } else if (err.message.includes("invalid-email")) {
        msg = "Invalid Email";
      } else {
        msg = "Something Went Wrong, Try Again";
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

  const handleSendTestimonial = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      dispatch(showPopup({ message: "Sign In First", status: true }));
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/testimonials",
        {
          content: comment,
          stars,
        },
        { headers }
      );
      setComment("");
      setTestimonials((prev) => [response.data, ...prev]);
      dispatch(
        showPopup({
          status: true,
          message: "your testimonial successfully published",
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        showPopup({
          status: true,
          message: "can not create your Testimonial",
        })
      );
    }
  };

  const dependOnScreen = () => {
    if (window.innerWidth <= 500) return 1.3;
    if (window.innerWidth > 500 && window.innerWidth <= 900) return 2.3;
    if (window.innerWidth > 800) return 3.3;
  };

  useEffect(() => {
    const getAllTestimonials = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/testimonials"
        );
        setTestimonials(response.data.reverse());
      } catch (error) {
        console.log(error);
        dispatch(
          showPopup({
            status: true,
            message: "Failed to get All Testimonials",
          })
        );
      }
    };
    getAllTestimonials();
  }, []);

  return (
    <div className="bg-[#222339] flex flex-col items-center pt-8">
      <div className="w-[85%] sm:w-full lg:w-[88%] ">
        <div
          className={`flex ${
            !currentUser ? "justify-between " : "justify-center "
          } sm:px-0 sm:flex-col lg:flex-col lg:items-center sm:w-full sm:gap-4 sm:py-8`}
        >
          <div
            className={`flex flex-col items-start sm:items-center gap-4 pt-10 sm:pt-0 `}
          >
            <h1 className="font-bold text-5xl text-[#c99d81] mb-4 tracking-wider sm:text-center sm:text-2xl sm:mx-auto">
              {/* Get paid for */}
              {t("getpaidfor")}
            </h1>
            <p className="text-3xl text-white font-[300] tracking-wider pb-4 sm:text-xl ">
              opening up bank accounts
            </p>
            <p className="text-white text-sm mb-4 ">
              Earn up to <span className="text-red-400">$2.05</span> per offer
              20 Offers available
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
          {!currentUser && (
            <div className="flex flex-col gap-2 w-[44%] bg-[#33334c] p-8 sm:px-2 sm:py-3 rounded-md sm:w-[92%] lg:w-[87%] lg:mt-10 border border-gray-600 sm:mx-auto ">
              <div className="text-center mb-4 sm:bg-[#18193fb4] sm:py-3 sm:rounded-md ">
                <h1 className="font-bold text-2xl tracking-wider text-white mb-2">
                  Sign Up For Free
                </h1>
                <p className="text-sm text-[#a6ada0] ">
                  and win up to
                  <span className="text-sm text-[#83dd1c]"> $250</span> in the
                  free time
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
        <div className="flex sm:flex-col items-center justify-center mt-16 sm:mt-4 sm:gap-2 mx-3">
          <div className="bg-[#101127] sm:rounded-t-lg sm:w-full w-[320px] flex flex-col items-center justify-center h-[110px] border-r-gray-100 border-r-[0.2px] sm:border-none">
            <div className="flex items-center gap-4 mr-6 sm:mr-[60px]">
              <MdOutlineWatchLater />
              <span className="text-green-400 font-bold"> 0h 17m 16s</span>
            </div>
            <p className="text-sm w-[200px] mt-2 text-center text-[#ddc2c2]">
              Average time until user makes first cashout
            </p>
          </div>
          <div className="bg-[#101127] sm:w-full w-[320px] flex flex-col items-center justify-center h-[110px] border-r-gray-100 border-r-[0.2px] sm:border-none">
            <div className="flex items-center gap-4 mr-6 sm:mr-[90px]">
              <FaMoneyBillWave />
              <span className="text-green-400 font-bold"> $ 10.32</span>
            </div>
            <p className="text-sm w-[200px] mt-2 text-center text-[#ddc2c2]">
              Average money earned by users yesterday
            </p>
          </div>
          <div className="bg-[#101127] sm:rounded-b-lg sm:w-full w-[320px]  flex flex-col items-center justify-center h-[110px]">
            <div className="flex items-center gap-4 mr-6 sm:gap-2">
              <MdOutlineAccountBalanceWallet />
              <span className="text-green-400 font-bold"> $ 32,539,299.52</span>
            </div>
            <p className="text-sm w-[200px] mt-2 text-center text-[#ddc2c2]">
              Total USD earned on Freetime
            </p>
          </div>
        </div>
        <h1 className="text-3xl tracking-widest font-bold text-gray-300 text-center mt-12 sm:mt-4 sm:text-xl sm:tracking-wide">
          How to get started?
        </h1>
        <p className="font-bold text-center mt-4 mb-12 mx-6 text-[#156999]">
          Earning money on Freetime has been made as simple as possible
        </p>
        <div className="flex gap-20 justify-center sm:flex-col sm:items-center sm:w-[60%] xs:w-[85%] sm:mx-auto ">
          <div className="w-[320px] h-[160px] bg-[#4346745e] rounded-md relative ">
            <span className="text-5xl font-bold text-yellow-300 absolute top-[-12%] left-[6%]">
              01
            </span>
            <p className="text-sm font-bold ml-8 mt-8 text-white blur-sm">
              This text have some Blure
            </p>
            <p className="text-xs  ml-8 mt-2 text-white blur-sm">
              This text have some Blure again
            </p>
            <p className="text-xs  ml-8 mt-10 text-white blur-sm">another</p>
            <div className=" bg-[#241c38d3] w-[90%] h-[140px] absolute top-[6%] left-[5%] rounded-md flex flex-col items-center overflow-hidden opacity-[0.6]">
              <h1 className="font-bold tracking-wider text-center text-yellow-300 ">
                Choose a task
              </h1>
              <div className="w-[80%] h-8 mt-1 flex justify-between p-2 rounded-lg bg-[#5c46aa80]">
                <img alt={""} src={stashLogo} className="rounded-md" />
                <p className="text-sm text-gray-50">sign up for..</p>
                <button className=" rounded-md bg-[#120d3863] px-2 border-t text-white text-sm">
                  $69.00
                </button>
              </div>
              <div className="w-[90%] h-8 mt-3 flex justify-between scale-110 bg-[#0e086633] rounded-md py-1 px-3 shadow-amber-300 shadow-lg ">
                <img alt={""} src={chooseTask} className="rounded-md" />
                <p className="text-sm text-gray-50">Play and reach lev..</p>
                <button className="rounded-md bg-[#120d3863] px-2 border-t text-yellow-200 text-sm ">
                  $100.00
                </button>
              </div>
              <div className="w-[85%] rounded-md px-2 bg-[#2b1f36a6] h-8 flex absolute left-5 bottom-[-10%] items-center justify-between">
                <img alt={""} src={ezgifLogo} className="rounded-md" />
                <p className="text-sm text-gray-50">deposit</p>
                <button className=" rounded-md ">$80.00</button>
              </div>
            </div>
          </div>
          <div className="w-[320px] h-[160px] bg-[#4346745e] rounded-md relative ">
            <span className="text-5xl font-bold text-yellow-300 absolute top-[-12%] left-[6%] ">
              02
            </span>
            <p className="text-xs  ml-8 mt-10 text-white blur-sm">someThing</p>
            <div className=" m-auto bg-[#171125cc] w-[90%] h-[140px] absolute top-[6%] left-[5%] rounded-md flex flex-col items-center overflow-hidden opacity-[0.6] sm:w-[90%] ">
              <h1 className="font-bold tracking-wider text-center text-yellow-300 mb-4 mt-4">
                Complete a Task
              </h1>
              <p className="text-xs text-center text-white font-[200]">
                Read the description before you start
              </p>
              <span className="px-4 py-2 bg-black rounded-md mt-2 border-t-[0.3px] border-white text-white">
                START
              </span>
            </div>
          </div>
        </div>
        <div className="w-[320px] h-[160px] bg-[#4346745e] rounded-md relative mx-auto mt-20 ">
          <span className="text-5xl font-bold text-yellow-300 absolute top-[-12%] left-[6%]">
            03
          </span>
          <div className="m-auto bg-[#130f1fbb] w-[293px] h-[140px] absolute top-[6%] left-[5%] rounded-md flex flex-col items-center overflow-hidden opacity-[0.6]  sm:w-[90%] sm:pl-8">
            <h1 className="font-bold tracking-wider text-center text-yellow-200 mt-4 mb-2">
              Recieve a Coins
            </h1>
            <img
              alt={""}
              src={moneyHome}
              className="absolute w-36 h-36 left-[-20px] top-5 "
            />
            <p className="text-white mb-2">And Cash Them Out</p>
            <button className=" rounded-md bg-black text-white px-2 py-2 border-t-[0.6px] border-gray-300 sm:ml-8 sm:text-sm">
              Cash out $1,00 bitcoin
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <span className="bg-red-400 text-black px-6 py-4 mt-8 rounded-md font-[450]">
            Start Earning
          </span>
        </div>
        <div className="mt-12">
          <h1 className="font-bold tracking-widest text-3xl text-gray-300 text-center sm:text-xl sm:tracking-wide mx-4">
            Why is Freetime the #1 site to make money?
          </h1>
          <p className="text-center opacity-[.4] mt-4 sm:w-[80%] sm:mx-auto sm:text-sm sm:text-[#b39beb]">
            A list with all the advantages and features that made us become the
            #1
          </p>
        </div>
        <div className=" w-[60%] grid grid-cols-2 gap-8 mx-auto mt-12 mb-12 sm:w-[90%] lg:w-[75%] sm:gap-3 sm:mb-4">
          <div className=" sm:col-span-2 flex flex-col items-center py-4 gap-6 bg-[#282942] rounded-md">
            <img alt={""} src={moneyBag} />
            <span className="text-sm">Cashouts starting at $0.50</span>
          </div>
          <div className="sm:col-span-2 flex flex-col items-center text-center py-6 bg-[#282942] rounded-md">
            <img alt={""} src={timers} />
            <span className="text-sm">
              Earn $1.00 every 5-10 minutes by completing offers on Freetime
            </span>
          </div>
          <div className="flex flex-col items-center py-9 bg-[#282942] rounded-md gap-2">
            <img alt={""} src={paypal} />
            <span className="text-sm">Instant cashouts</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-[#282942] rounded-md gap-2">
            <img alt={""} src={dollarInHand} />
            <span className="text-sm">Highest payouts</span>
          </div>
          <div className="flex flex-col items-center py-9 bg-[#282942] rounded-md gap-2">
            <img alt={""} src={check} />
            <span className="text-sm">Verified task</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-[#282942] rounded-md gap-2">
            <img alt={""} src={support} />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
      <Faq />
      <div className="w-full py-8 bg-[#1f3346]">
        <h1 className="text-2xl sm:text-xl tracking-widest font-bold text-center text-[#b0d870] my-5">
          What do our users say?
        </h1>
        <div className="w-[60%] xl:w-[80%] sm:w-full p-2 mb-10 mx-auto">
          <Swiper
            className="w-full h-[250px]"
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            slidesPerView={dependOnScreen()}
            navigation
            pagination={{ clickable: true }}
            // scrollbar={{ draggable: true }}
            // onSwiper={(swiper) => console.log(swiper.animating)}
            // onSlideChange={() => console.log("slide change")}
          >
            {testimonials?.map((item) => {
              const numOtherStar = 5 - item.stars;
              return (
                <SwiperSlide
                  key={item._id}
                  className="bg-[#272336ee] rounded-lg max-h-[215px]"
                >
                  <div className="flex flex-col gap-3 px-3 pb-3">
                    <span className=" text-5xl font-[900]">،،</span>
                    <div className="text-xs text-[#b5cea4] h-[63px] overflow-hidden">
                      {item.content}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-[#5fec52ee]">
                          {item.user.name}
                        </span>
                        {item.createdAt && (
                          <span className="text-xs text-[#9ba89aee]">
                            {timeAgoFromMongoDBDate(item.createdAt.toString())}
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          {[...Array(item.stars).keys()].map((el) => (
                            <MdOutlineStarPurple500 key={el} />
                          ))}
                          {[...Array(numOtherStar).keys()].map((el) => (
                            <MdOutlineStarOutline key={el} />
                          ))}
                        </div>
                      </div>
                      <div className="w-16 h-16 xs:w-9 xs:h-9 rounded-full border border-yellow-500">
                        <img
                          src={item.user.profilePicture || avatar}
                          alt=""
                          className="w-full h-full rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <form onSubmit={handleSendTestimonial} className="w-full">
          <div className="w-[500px] sm:w-[60%] xs:w-[94%] flex flex-col gap-3 items-center justify-center mx-auto ">
            <div className="flex flex-col w-full">
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add Your Testimonial"
                className="placeholder:text-gray-500 outline-none p-2 w-full h-[90px] bg-[#1b1b24f1] rounded-md text-[#92ccee] "
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {stars >= 1 ? (
                  <span onClick={() => setStars(1)}>
                    <MdOutlineStarPurple500 className="text-xl" />
                  </span>
                ) : (
                  <span onClick={() => setStars(1)}>
                    <MdOutlineStarOutline className="text-xl" />
                  </span>
                )}
                {stars >= 2 ? (
                  <span onClick={() => setStars(2)}>
                    <MdOutlineStarPurple500 className="text-xl" />
                  </span>
                ) : (
                  <span onClick={() => setStars(2)}>
                    <MdOutlineStarOutline className="text-xl" />
                  </span>
                )}
                {stars >= 3 ? (
                  <span onClick={() => setStars(3)}>
                    <MdOutlineStarPurple500 className="text-xl" />
                  </span>
                ) : (
                  <span onClick={() => setStars(3)}>
                    <MdOutlineStarOutline className="text-xl" />
                  </span>
                )}
                {stars >= 4 ? (
                  <span onClick={() => setStars(4)}>
                    <MdOutlineStarPurple500 className="text-xl" />
                  </span>
                ) : (
                  <span onClick={() => setStars(4)}>
                    <MdOutlineStarOutline className="text-xl" />
                  </span>
                )}
                {stars >= 5 ? (
                  <span onClick={() => setStars(5)}>
                    <MdOutlineStarPurple500 className="text-xl" />
                  </span>
                ) : (
                  <span onClick={() => setStars(5)}>
                    <MdOutlineStarOutline className="text-xl" />
                  </span>
                )}
              </div>
              <button
                className="text-sm bg-[#9dec6f] px-5 py-1 rounded-md text-black font-bold"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
        <div className="flex items-center justify-center gap-6 xs:gap-3 my-16">
          <div className="w-[300px] h-[300px] border-yellow-200 bg-gradient-to-br from-slate-900 to-zinc-800 rounded-lg flex flex-col items-center pt-20 relative">
            <p className="text-xl font-bold mb-2 text-center">
              Yesterday Users Cashed Out
            </p>
            <span className="font-extrabold text-yellow-400 text-4xl xs:text-2xl">
              $37,392
            </span>
            <img
              alt={""}
              src={moneyHome}
              className="absolute w-[200px] h-[150px] xs:w-[150px] xs:h-[100px] -bottom-10"
            />
          </div>
          <div className="w-[300px] h-[300px] rounded-md flex flex-col items-center justify-center bg-[#1d1e31] gap-5 ">
            <h1 className="text-white font-bold w-[80%] text-center sm:text-lg text-xl">
              Sign up now and Start earnig money !
            </h1>
            <div className="bg-[#01d676] text-lg rounded-md text-black font-bold px-3 py-1 xs:text-sm">
              Start Earning Money
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
