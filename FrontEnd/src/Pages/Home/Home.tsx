import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MdOutlineStarOutline, MdOutlineStarPurple500 } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { VscGithub } from "react-icons/vsc";
import { MdOutlineAssignmentReturned } from "react-icons/md";
import { MdOutlineWatchLater } from "react-icons/md";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { ezgifLogo, stashLogo, chooseTask, moneyHome } from "../../assets";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { openToast, selectCurrentUser } from "../../context/appStateSlice";
import { login, handleSignInWithOauth, handleSendTestimonial } from "../../services";
import { cn, formateDate, handleApiError, validateCredentials } from "../../utilities";
import type { IFormData } from "../../types";
import signuporfree from "../../assets/images/signuporfree.png";
import { check, moneyBag, paypal, dollarInHand, support, timers } from "../../assets";
import { SwiperSlide, Swiper } from "swiper/react";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Input from "../../components/Shared/Common/Input";
import { useFetchTestimonials } from "../../tanstackQuery/queryFetch";
import { addTestimonialCashe } from "../../tanstackQuery/queryCache";

const Home = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [stars, setStars] = useState<number>(1);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { t } = useTranslation("home");

  const token = !!localStorage.getItem("token");

  const { data: testimonials, status, error } = useFetchTestimonials();

  const handlaSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const result = validateCredentials({ email, password } as IFormData, true, true);

    if (!result.isValid) {
      dispatch(
        openToast({
          message: Object.values(result.errors).join(", "),
          type: "ERROR_GENERAL",
        }),
      );
      return;
    }
    try {
      await login({ formData: { email, password }, dispatch });
    } catch (error) {
      dispatch(
        openToast({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    }
  };

  function handleExpand(e: React.MouseEvent<HTMLDivElement>, height: string) {
    e.currentTarget.children[1].classList.toggle(height);
    e.currentTarget.children[1].classList.toggle("py-4");
  }

  const mutation = useMutation({
    mutationFn: handleSendTestimonial,
    onError: (error) => {
      dispatch(
        openToast({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    },
    onSuccess: (newTestimonial) => {
      setComment("");
      addTestimonialCashe({ queryClient, newTestimonial });
    },
  });

  const addTestimonialHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser) {
      dispatch(
        openToast({
          type: "ERROR_LOCK",
          message: "Log In First",
        }),
      );
      return;
    }
    if (comment.trim() === "") {
      dispatch(
        openToast({
          type: "ERROR_GENERAL",
          message: "Enter Your Opinion",
        }),
      );
      return;
    }
    mutation.mutate({ comment, stars });
  };

  const numberOfCards = () => {
    if (window.innerWidth <= 500) return 1.3;
    if (window.innerWidth <= 700) return 2.3;
    if (window.innerWidth <= 800) return 3.3;
    if (window.innerWidth <= 1000) return 4.3;
    return 5.3;
  };

  return (
    <div className="bg-[#222339] py-6 lg:py-12">
      <div className="mx-auto w-[90%] max-w-7xl space-y-16">
        <div className={!token ? "flex flex-col justify-between gap-y-6 md:flex-row" : ""}>
          <div className={cn("h-full w-full", !token && "md:w-[48%]")}>
            <h1 className="mb-4 w-full text-center text-4xl font-bold text-[#af5a5a] md:text-6xl">
              {t("Get Paid For")}
            </h1>

            <p className="mt-2 text-balance text-center text-sm md:text-base lg:text-lg">
              Opening Bank Account, Refer Your Friend Through your Referal Link, complete Tasks and apps,
              offers and much more. Opening Bank Account, Refer Your Friend Through your Referal Link,
              complete Tasks and apps, offers and much more. Opening Bank Account, Refer Your Friend Through
              your Referal Link, complete Tasks and apps, offers and much more. Opening Bank Account, Refer
              Your Friend Through your Referal Link, complete Tasks and apps, offers and much more.
            </p>
            <p className="mt-2 w-full text-center text-sm text-[#95afff] md:text-base lg:text-lg">
              {t("Earn up to $2.05 per offer 20 Offers available See our 33,225 reviews on Trustpilot")}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 rounded-sm text-center">
              <FaStar className="h-6 w-6 bg-green-700" />
              <FaStar className="h-6 w-6 bg-green-700" />
              <FaStar className="h-6 w-6 bg-green-700" />
              <FaStar className="h-6 w-6 bg-green-700" />
              <FaStar className="h-6 w-6 bg-green-700" />
            </div>
          </div>

          {!token && (
            <div className="flex w-full flex-col gap-y-2 rounded-md border border-gray-600 bg-[#33334c] p-2 md:w-[48%] md:p-4">
              <div className="rounded-md bg-[#18193fb4] py-3 text-center">
                <h1 className="text-2xl font-bold tracking-wider text-white">{t("Sign Up For Free")}</h1>
                <p className="text-sm text-[#a6ada0]">{t("and win up to $250 in the free time")}</p>
              </div>
              <div className="h-16 overflow-hidden rounded-md">
                <img src={signuporfree} alt="" className="h-full w-full object-fill object-center" />
              </div>
              <div className="flex flex-col items-center gap-y-2">
                <button
                  onClick={() => handleSignInWithOauth("google", dispatch)}
                  className="flex w-full items-center justify-between rounded-md bg-[#25253b] px-4 py-2 text-[.8rem] text-[#f7d0d0] sm:text-xs"
                >
                  {t("Sign In With Google")} <FcGoogle />
                </button>
                <button
                  onClick={() => handleSignInWithOauth("github", dispatch)}
                  className="flex w-full items-center justify-between rounded-md bg-[#25253b] px-4 py-2 text-[.8rem] text-[#f7d0d0] sm:text-xs"
                >
                  {t("Sign In With GitHub")}
                  <VscGithub />
                </button>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="h-[2px] flex-1 bg-gradient-to-l from-blue-300 to-[#322f44]"></div>
                <span>{t("OR")}</span>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-300 to-[#322f44]"></div>
              </div>
              <form className="flex flex-col gap-y-2">
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
                <div className="mt-4 text-center md:mt-6">
                  <button
                    type="submit"
                    onClick={handlaSignIn}
                    className="w-full rounded-md border-[0.2px] border-white bg-[#05BA6B] py-2 font-[600] text-black"
                  >
                    {t("Sign In")}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="mx-auto grid grid-cols-4 gap-1 overflow-auto scrollbar-none sm:gap-2">
          <span className="rounded-sm bg-[#f89723] py-1 text-center text-xs font-bold text-black sm:text-sm md:rounded-md">
            Bitcoin
          </span>
          <span className="rounded-sm bg-[#35a596] py-1 text-center text-xs font-bold text-black sm:text-sm md:rounded-md">
            Ethereum
          </span>
          <span className="rounded-sm bg-[#11fd30] py-1 text-center text-xs font-bold text-black sm:text-sm md:rounded-md">
            Zalando
          </span>
          <span className="rounded-sm bg-[#2187c7] py-1 text-center text-xs font-bold text-black sm:text-sm md:rounded-md">
            PayPal
          </span>
          <span className="rounded-sm bg-[#11171e] py-1 text-center text-xs font-bold sm:text-sm md:rounded-md">
            Amazon
          </span>
          <span className="rounded-sm bg-[#bab4df] py-1 text-center text-xs font-bold text-black sm:text-sm md:rounded-md">
            Steam
          </span>
          <span className="rounded-sm bg-[#b753c7] py-1 text-center text-xs font-bold text-black sm:text-sm md:rounded-md">
            Apple
          </span>
          <span className="rounded-sm bg-[#ffffff] py-1 text-center text-xs font-bold text-black sm:text-sm md:rounded-md">
            Google Play
          </span>
        </div>

        <div className="grid grid-cols-1 gap-y-2 md:grid-cols-3">
          <div className="flex flex-col items-center justify-center rounded-t-lg bg-[#101127] py-3 md:rounded-l-lg md:rounded-t-none md:border-r">
            <div className="flex items-center gap-4">
              <MdOutlineWatchLater />
              <span className="font-bold text-green-400"> 0h 17m 16s</span>
            </div>
            <p className="mt-2 w-[200px] text-center text-sm text-[#ddc2c2]">
              {t("Average time until user makes first cashout")}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center bg-[#101127] py-3 md:border-r">
            <div className="flex items-center gap-4">
              <FaMoneyBillWave />
              <span className="font-bold text-green-400"> $ 10.32</span>
            </div>
            <p className="mt-2 w-[200px] text-center text-sm text-[#ddc2c2]">
              {t("Average money earned by users yesterday")}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-b-lg bg-[#101127] py-3 md:rounded-b-none md:rounded-r-lg">
            <div className="flex items-center gap-4">
              <MdOutlineAccountBalanceWallet />
              <span className="font-bold text-green-400"> $ 32,539,299.52</span>
            </div>
            <p className="mt-2 w-[200px] text-center text-sm text-[#ddc2c2]">
              {t("Total USD earned on Freetime")}
            </p>
          </div>
        </div>

        <h1 className="text-center text-xl font-bold tracking-wider text-gray-300 md:text-3xl">
          {t("How to get started")}
        </h1>

        <p className="text-center font-bold text-[#156999]">
          {t("Earning money on Freetime has been made as simple as possible")}
        </p>

        <div className="flex flex-col items-center justify-around gap-7 md:flex-row">
          <div className="relative h-[180px] w-[80%] rounded-md bg-[#4346745e] md:w-[45%]">
            <span className="absolute left-[6%] top-[-12%] text-5xl font-bold text-yellow-300">01</span>
            <p className="ml-8 mt-8 text-sm font-bold text-white blur-sm">This text have some Blure</p>
            <p className="ml-8 mt-2 text-xs text-white blur-sm">This text have some Blure again</p>
            <p className="ml-8 mt-10 text-xs text-white blur-sm">another</p>
            <div className="absolute left-[5%] top-[6%] flex h-[90%] w-[90%] flex-col items-center overflow-hidden rounded-md bg-[#241c38d3] opacity-[0.6]">
              <h1 className="text-center font-bold tracking-wider text-yellow-300">{t("Choose a Task")}</h1>
              <div className="mt-1 flex h-9 w-[90%] justify-between rounded-lg bg-[#5c46aa80] p-2">
                <img alt={""} src={stashLogo} className="rounded-md" />
                <p className="text-sm text-gray-50">{t("sign up for")}..</p>
                <button className="rounded-md border-t bg-[#120d3863] px-2 text-sm text-white">$69.00</button>
              </div>
              <div className="mt-4 flex h-10 w-[95%] scale-110 justify-between rounded-md bg-[#0e086633] px-3 py-1 shadow-lg shadow-amber-300">
                <img alt={""} src={chooseTask} className="rounded-md" />
                <p className="text-sm text-gray-50">{t("Play and Reach Level")}...</p>
                <button className="rounded-md border-t bg-[#120d3863] px-2 text-sm text-yellow-200">
                  $100.00
                </button>
              </div>
              <div className="absolute bottom-[-10%] left-9 flex h-8 w-[80%] items-center justify-between rounded-md bg-[#322e36ec] px-2">
                <img alt={""} src={ezgifLogo} className="rounded-md" />
                <p className="text-sm text-gray-50">{t("Deposit")}</p>
                <button className="rounded-md">$80.00</button>
              </div>
            </div>
          </div>
          <div className="relative h-[180px] w-[80%] rounded-md bg-[#4346745e] md:w-[45%]">
            <span className="absolute left-[6%] top-[-12%] text-5xl font-bold text-yellow-300">02</span>
            <p className="ml-8 mt-10 text-xs text-white blur-sm">someThing</p>
            <div className="absolute left-[5%] top-[6%] m-auto flex h-[90%] w-[90%] flex-col items-center overflow-hidden rounded-md bg-[#171125cc] opacity-[0.6] sm:w-[90%]">
              <h1 className="mb-4 mt-4 text-center font-bold tracking-wider text-yellow-300">
                {t("Complete a Task")}
              </h1>
              <p className="text-center text-xs font-[200] text-white">
                {t("Read the description before you start")}
              </p>
              <span className="mt-5 w-[80%] rounded-md border-t border-[#e0dfdf] bg-black py-2 text-center text-white">
                {t("start")}
              </span>
            </div>
          </div>
        </div>

        <div className="relative mx-auto h-[180px] w-[80%] rounded-md bg-[#4346745e] md:w-[45%]">
          <span className="absolute left-[6%] top-[-12%] text-5xl font-bold text-yellow-300">03</span>
          <div className="absolute left-[5%] top-[6%] m-auto flex h-[90%] w-[90%] flex-col items-center overflow-hidden rounded-md bg-[#130f1fbb] pl-8 opacity-[0.6] sm:pl-0">
            <h1 className="mb-2 mt-4 text-center font-bold tracking-wider text-yellow-200">
              {t("Recieve a Points")}
            </h1>
            <img alt={""} src={moneyHome} className="absolute left-[-20px] top-5 h-36 w-36" />
            <p className="mb-2 text-white">{t("And Cash Them Out")}</p>
            <button className="ml-8 w-[80%] rounded-md border-t-[0.6px] border-gray-300 bg-black py-2 text-center text-sm text-white sm:ml-0 sm:text-base">
              {t("About $1,000 Bitcoins")}
            </button>
          </div>
        </div>

        <div className="mb-4 flex justify-center">
          <span className="rounded-md bg-red-400 px-6 py-2 font-bold text-black">{t("Start Earning")}</span>
        </div>

        <h1 className="mx-4 text-center text-xl font-bold tracking-wide text-gray-300 sm:text-3xl sm:tracking-widest">
          {t("Why is Freetime the #1 site to make money")}
        </h1>

        <p className="mx-auto mb-6 w-[80%] text-center text-sm opacity-[.4] sm:text-[#b39beb]">
          {t("A list with all the advantages and features that made us become the #1")}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex flex-col items-center gap-6 rounded-md bg-[#282942] py-4 sm:col-span-1">
            <img alt={""} src={moneyBag} />
            <span className="text-sm">{t("Cashouts starting at $0.50")}</span>
          </div>
          <div className="col-span-2 flex flex-col items-center rounded-md bg-[#282942] py-6 text-center sm:col-span-1">
            <img alt={""} src={timers} />
            <span className="text-sm">
              {t("Earn $1.00 every 5-10 minutes by completing offers on Freetime")}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-md bg-[#282942] py-9">
            <img alt={""} src={paypal} />
            <span className="text-sm">{t("Instant cashouts")}</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-[#282942]">
            <img alt={""} src={dollarInHand} />
            <span className="text-sm">{t("Highest payouts")}</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-md bg-[#282942] py-9">
            <img alt={""} src={check} />
            <span className="text-sm">{t("Verified task")}</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-[#282942]">
            <img alt={""} src={support} />
            <span>{t("24 / 7 Support")}</span>
          </div>
        </div>

        <h1 className="text-center text-3xl font-bold tracking-wider text-white">FAQ</h1>

        <div className="mx-auto flex flex-col gap-4">
          <div
            onClick={(event) => handleExpand(event, "h-[330px]")}
            className="flex flex-col gap-3 overflow-hidden rounded-md border border-gray-400 bg-[#3d1846] pt-4"
          >
            <div className="flex cursor-pointer items-center gap-2 pl-5">
              <MdOutlineAssignmentReturned className="text-2xl" />
              <p className="text-[14px] text-white sm:text-base">{t("How to make money on Freetime")}</p>
            </div>
            <div className={"h-0 bg-[rgb(44,16,51)] px-4 transition-all"}>
              <p className="pb-4 text-sm tracking-wide">
                {t(
                  "Freetime.com works together with companies that want to advertise their apps, surveys and products. A task could be: Download an app and reach level 5 within 2 days to earn 4000 coins. To get started choose an offer or survey. We can recommend the featured offers at the top of the Earn page. These tasks are very simple and many people have already successfully completed them in the past . After you have completed a task you will get coins. 1000 coins equal $1.00. You can cashout the coins for PayPal, VISA cards, Bitcoin, CS:GO Skins Amazon gift cards and multiple other types of gift cards",
                )}
              </p>
            </div>
          </div>
          <div
            onClick={(event) => handleExpand(event, "h-[180px]")}
            className="flex flex-col gap-3 overflow-hidden rounded-md border border-gray-400 bg-[#3d1846] pt-4"
          >
            <div className="flex cursor-pointer items-center gap-2 pl-5">
              <MdOutlineAssignmentReturned className="text-2xl" />
              <p className="text-[14px] text-white">{t("How is Freetime able to pay users")}</p>
            </div>

            <div className={"h-0 bg-[#2c1033] px-4 transition-all"}>
              <p className="pb-4 text-sm tracking-wide">
                {t(
                  "Users complete tasks from advertisers Advertisers provide various tasks for users, including downloading an app, signing up for a website, watching videos, reaching a certain in-game level and much more. Advertisers pay Freetime for promotion For every completed task, advertisers pay Freetime a commission. Freetime sends user payouts After completing all task requirements, Freetime will send the user a payout",
                )}
              </p>
            </div>
          </div>
          <div
            onClick={(event) => handleExpand(event, "h-[138px]")}
            className="flex flex-col gap-3 overflow-hidden rounded-md border border-gray-400 bg-[#3d1846] pt-4"
          >
            <div className="flex cursor-pointer items-center gap-2 pl-5">
              <MdOutlineAssignmentReturned className="text-2xl" />
              <p className="text-[14px] text-white">{t("How much money can you really earn on Freetime")}</p>
            </div>

            <div className={"h-0 bg-[#2c1033] px-4 transition-all"}>
              <p className="pb-4 text-sm tracking-wide">
                {t(
                  "It is easily possible to earn more than $100 per month on Freetime, some users even reach     $1000+ each month. You can check out the Leaderboard to see how much the most active Freetime users earn",
                )}
              </p>
            </div>
          </div>
          <div
            onClick={(event) => handleExpand(event, "h-[138px]")}
            className="flex flex-col gap-3 overflow-hidden rounded-md border border-gray-400 bg-[#3d1846] pt-4"
          >
            <div className="flex cursor-pointer items-center gap-2 pl-5">
              <MdOutlineAssignmentReturned className="text-2xl" />
              <p className="text-sm text-white">{t("How long does it take to cash out your money")}</p>
            </div>

            <div className={"h-0 bg-[#2c1033] px-4 transition-all"}>
              <p className="pb-4 text-sm tracking-wide">
                {t(
                  "Freetime.com has a live support that is always online. Our team is working 24/7 and you can contact us any time at the top of the chat. If you request a withdrawal, it will most likely get approved in less than 2 minutes",
                )}
              </p>
            </div>
          </div>
        </div>

        <h1 className="text-center text-xl font-bold tracking-wider text-[#b0d870] lg:text-2xl">
          {t("What do our users say")}
        </h1>

        <div className="mx-auto w-full">
          {error && <p className="text-center text-[#f73737]">{error.response?.data.error}</p>}
          {status !== "pending" && !error && (
            <Swiper
              className="h-[350px]"
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={window.innerWidth < 500 ? 4 : window.innerWidth < 800 ? 6 : 10}
              slidesPerView={numberOfCards()}
              navigation
              pagination={{ clickable: true }}
            >
              {testimonials?.map((item) => {
                const numOtherStar = 5 - item.stars;
                return (
                  <SwiperSlide key={item._id} className="max-h-[315px] rounded-lg border bg-[#272336ee]">
                    <div className="flex h-full flex-col justify-between px-3 pb-3">
                      <span className="text-5xl font-[900]">،،</span>
                      <div className="h-[50%] overflow-auto text-[#b5cea4] scrollbar-none">
                        {item.content}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-[#5fec52ee]">{item.user?.name}</span>
                          {item.createdAt && (
                            <span className="text-xs text-[#9ba89aee]">{formateDate(item.createdAt)}</span>
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
                        <div className="h-9 w-9 rounded-full border border-yellow-500 lg:h-16 lg:w-16">
                          <img
                            src={item.user?.profilePicture}
                            alt=""
                            className="h-full w-full rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>

        <form onSubmit={addTestimonialHandler} className="">
          <div className="mx-auto flex w-[94%] flex-col items-center justify-center gap-3 md:w-[60%]">
            <div className="flex w-full flex-col">
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("Add Your Testimonial")}
                className="min-h-[90px] w-full resize-none rounded-md bg-[#1b1b24f1] p-4 text-[#92ccee] outline-none placeholder:text-gray-500 sm:p-2"
              />
            </div>
            <div className="flex w-full flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {stars >= 1 ? (
                  <button type="button" onClick={() => setStars(1)}>
                    <MdOutlineStarPurple500 className="text-xl" />
                  </button>
                ) : (
                  <button type="button" onClick={() => setStars(1)}>
                    <MdOutlineStarOutline className="text-xl" />
                  </button>
                )}
                {stars >= 2 ? (
                  <button type="button" onClick={() => setStars(2)}>
                    <MdOutlineStarPurple500 className="text-xl" />
                  </button>
                ) : (
                  <button type="button" onClick={() => setStars(2)}>
                    <MdOutlineStarOutline className="text-xl" />
                  </button>
                )}
                {stars >= 3 ? (
                  <button type="button" onClick={() => setStars(3)}>
                    <MdOutlineStarPurple500 className="text-xl" />
                  </button>
                ) : (
                  <button type="button" onClick={() => setStars(3)}>
                    <MdOutlineStarOutline className="text-xl" />
                  </button>
                )}
                {stars >= 4 ? (
                  <button type="button" onClick={() => setStars(4)}>
                    <MdOutlineStarPurple500 className="text-xl" />
                  </button>
                ) : (
                  <button type="button" onClick={() => setStars(4)}>
                    <MdOutlineStarOutline className="text-xl" />
                  </button>
                )}
                {stars >= 5 ? (
                  <button type="button" onClick={() => setStars(5)}>
                    <MdOutlineStarPurple500 className="text-xl" />
                  </button>
                ) : (
                  <button type="button" onClick={() => setStars(5)}>
                    <MdOutlineStarOutline className="text-xl" />
                  </button>
                )}
              </div>
              <button className="rounded-md bg-[#9dec6f] px-6 py-1 font-bold text-black" type="submit">
                {t("Submit")}
              </button>
            </div>
          </div>
        </form>

        <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
          <div className="relative flex h-[250px] w-[90%] flex-col items-center rounded-lg border-yellow-200 bg-gradient-to-br from-slate-900 to-[#43800a3a] pt-16 md:w-[45%]">
            <p className="mb-2 text-center text-xl font-bold">{t("Yesterday Users Cashed Out")}</p>
            <span className="text-2xl font-extrabold text-yellow-400 sm:text-4xl">$37,392</span>
            <img
              alt={""}
              src={moneyHome}
              className="absolute -bottom-10 h-[150px] w-[150px] md:h-[120px] md:w-[30%]"
            />
          </div>
          <div className="flex h-[250px] w-[90%] flex-col items-center justify-center gap-5 rounded-md bg-[#1d1e31] md:w-[45%]">
            <h1 className="w-[80%] text-center text-xl font-bold text-white sm:text-lg">
              {t("Sign up now and Start earnig money")}
            </h1>
            <div className="rounded-md bg-[#01d676] px-3 py-1 text-sm font-bold text-black sm:text-lg">
              {t("Start Earning Money")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
