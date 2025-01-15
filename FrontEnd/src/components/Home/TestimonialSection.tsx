import { FormEvent, useState } from "react";
import { showPopup } from "../../context/StateManeger";
import { fetchTestimonials, handleSendTestimonial } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { formateDate, handleApiError } from "../../utils/common";
import { MdOutlineStarOutline, MdOutlineStarPurple500 } from "react-icons/md";
import { moneyHome } from "../../assets";
import { SwiperSlide, Swiper } from "swiper/react";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TypeTestimonial } from "../../types/othersTypes";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const TestimonialSection = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const smallScreen = useAppSelector((state) => state.stateManeger.smallScreen);
  const [comment, setComment] = useState<string>("");
  const [stars, setStars] = useState<number>(1);
  const { t } = useTranslation("home");
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const {
    data: testimonials,
    status,
    error,
  } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
    staleTime: 60 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: handleSendTestimonial,
    onError: (error) => {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    },
    onSuccess: (newTestimonial) => {
      setComment("");
      queryClient.setQueryData(["testimonials"], (old: TypeTestimonial[]) => {
        return [newTestimonial, ...old];
      });
    },
  });

  const addTestimonialHandler = (event: FormEvent) => {
    event.preventDefault();
    if (!currentUser) {
      dispatch(
        showPopup({
          type: "ERROR_LOCK",
          message: "Log In First",
        }),
      );
      return;
    }
    if (comment.trim() === "") {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: "Enter Your Opinion",
        }),
      );
      return;
    }
    mutation.mutate({ comment, stars });
  };

  const numberOfCards = () => {
    if (smallScreen) return 1.3;
    return 2.3;
  };

  return (
    <div className="w-full bg-[#1f3346] py-4">
      <h1 className="text-center text-xl font-bold tracking-wider text-[#b0d870] sm:text-2xl">
        {t("What do our users say")}
      </h1>
      <div className="mx-auto my-5 w-full p-2 md:w-[600px] lg:w-[900px] xl:w-[800px]">
        {error && <p className="text-center text-[#f73737]">{error.response?.data.error}</p>}
        {status !== "pending" && !error && (
          <Swiper
            className="h-[350px] w-full"
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            slidesPerView={numberOfCards()}
            navigation
            pagination={{ clickable: true }}
          >
            {testimonials?.map((item) => {
              const numOtherStar = 5 - item.stars;
              return (
                <SwiperSlide key={item._id} className="max-h-[315px] rounded-lg bg-[#272336ee]">
                  <div className="flex h-full flex-col justify-between px-3 pb-3">
                    <span className="text-5xl font-[900]">،،</span>
                    <div className="h-[50%] overflow-scroll text-[#b5cea4] scrollbar-none">
                      {item.content}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-[#5fec52ee]">{item.user.name}</span>
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
                      <div className="h-9 w-9 rounded-full border border-yellow-500 sm:h-16 sm:w-16">
                        <img src={item.user.profilePicture} alt="" className="h-full w-full rounded-full" />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
      <form onSubmit={addTestimonialHandler} className="w-full">
        <div className="mx-auto flex w-[94%] flex-col items-center justify-center gap-3 sm:w-[500px] md:w-[60%]">
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
      <div className="sm:ap-6 my-16 flex items-center justify-center gap-3">
        <div className="relative flex h-[250px] w-[45%] max-w-[300px] flex-col items-center rounded-lg border-yellow-200 bg-gradient-to-br from-slate-900 to-zinc-800 pt-20">
          <p className="mb-2 text-center text-xl font-bold">{t("Yesterday Users Cashed Out")}</p>
          <span className="text-2xl font-extrabold text-yellow-400 sm:text-4xl">$37,392</span>
          <img
            alt={""}
            src={moneyHome}
            className="absolute -bottom-10 h-[90px] w-[70%] sm:h-[120px] sm:w-[50%]"
          />
        </div>
        <div className="flex h-[250px] w-[45%] max-w-[300px] flex-col items-center justify-center gap-5 rounded-md bg-[#1d1e31]">
          <h1 className="w-[80%] text-center text-xl font-bold text-white sm:text-lg">
            {t("Sign up now and Start earnig money")}
          </h1>
          <div className="rounded-md bg-[#01d676] px-3 py-1 text-sm font-bold text-black sm:text-lg">
            {t("Start Earning Money")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
