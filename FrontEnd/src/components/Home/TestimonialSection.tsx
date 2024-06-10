import { FormEvent, useEffect, useState } from "react";
import { showPopup } from "../../context/StateManeger";
import { makeRequest } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { formateDate, handleApiError } from "../../utils/common";
import { MdOutlineStarOutline, MdOutlineStarPurple500 } from "react-icons/md";
import { moneyHome } from "../../assets";
import { SwiperSlide, Swiper } from "swiper/react";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { User } from "../../types/userTypes";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useTranslation } from "react-i18next";

interface TypeTestimonial {
  _id: string;
  user: User;
  content: string;
  stars: number;
  createdAt: Date;
}

const TestimonialSection = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [comment, setComment] = useState<string>("");
  const [stars, setStars] = useState<number>(1);
  const [testimonials, setTestimonials] = useState<TypeTestimonial[]>([]);
  const { t } = useTranslation("home");
  const dispatch = useAppDispatch();

  const handleSendTestimonial = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      dispatch(
        showPopup({
          type: "ERROR_LOCK",
          message: "Log In First",
        })
      );
      return;
    }
    if (comment.trim() === "") {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: "Enter Your Opinion",
        })
      );
    }
    try {
      const response = await makeRequest.post("api/testimonials", {
        content: comment,
        stars,
      });
      setComment("");
      setTestimonials((prev) => [response.data, ...prev]);
      dispatch(
        showPopup({
          type: "SUCESS",
          message: "successfull published",
        })
      );
    } catch (error) {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    }
  };

  const dependOnScreen = () => {
    if (window.innerWidth <= 500) return 1.3;
    return 2.2;
  };

  useEffect(() => {
    const getAllTestimonials = async () => {
      try {
        const response = await makeRequest.get("api/testimonials");
        setTestimonials(response.data.reverse());
      } catch (error) {
        dispatch(
          showPopup({
            type: "ERROR_GENERAL",
            message: handleApiError(error),
          })
        );
      }
    };
    getAllTestimonials();
  }, []);

  return (
    <div className="w-full py-4 bg-[#1f3346]">
      <h1 className="text-2xl sm:text-xl tracking-wider font-bold text-center text-[#b0d870]">
        {t("whatDoOurUsersSay")}
      </h1>
      <div className="w-[900px] xl:w-[800px] lg:w-[600px] sm:w-full p-2 mb-10 mx-auto ">
        <Swiper
          className="w-full h-[350px] "
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={10}
          slidesPerView={dependOnScreen()}
          navigation
          pagination={{ clickable: true }}
        >
          {testimonials?.map((item) => {
            const numOtherStar = 5 - item.stars;
            return (
              <SwiperSlide
                key={item._id}
                className="bg-[#272336ee] rounded-lg max-h-[315px]"
              >
                <div className="flex flex-col justify-between h-full  px-3 pb-3">
                  <span className=" text-5xl font-[900]">،،</span>
                  <div className="text-[#b5cea4] h-[50%] overflow-scroll scrollbar-none">
                    {item.content}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-[#5fec52ee]">
                        {item.user.name}
                      </span>
                      {item.createdAt && (
                        <span className="text-xs text-[#9ba89aee]">
                          {formateDate(item.createdAt)}
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
                        src={`${import.meta.env.VITE_SERVER_BASE_URL}/${
                          item.user.profilePicture
                        }`}
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
              placeholder={t("addYourTestimonial")}
              className="placeholder:text-gray-500 outline-none p-4 sm:p-2 w-full min-h-[90px] bg-[#1b1b24f1] rounded-md text-[#92ccee] resize-none"
            />
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2 w-full">
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
            <button
              className="bg-[#9dec6f] px-6 py-1 rounded-md text-black font-bold"
              type="submit"
            >
              {t("submitButton")}
            </button>
          </div>
        </div>
      </form>
      <div className="flex items-center justify-center gap-6 xs:gap-3 my-16">
        <div className="w-[45%] max-w-[300px] h-[250px] border-yellow-200 bg-gradient-to-br from-slate-900 to-zinc-800 rounded-lg flex flex-col items-center pt-20 relative">
          <p className="text-xl font-bold mb-2 text-center">{t("yesterday")}</p>
          <span className="font-extrabold text-yellow-400 text-4xl xs:text-2xl">
            $37,392
          </span>
          <img
            alt={""}
            src={moneyHome}
            className="absolute w-[50%] h-[120px] xs:w-[70%] xs:h-[90px] -bottom-10"
          />
        </div>
        <div className="w-[45%] max-w-[300px] h-[250px] rounded-md flex flex-col items-center justify-center bg-[#1d1e31] gap-5 ">
          <h1 className="text-white font-bold w-[80%] text-center sm:text-lg text-xl">
            {t("signUpNowAnd")}
          </h1>
          <div className="bg-[#01d676] text-lg rounded-md text-black font-bold px-3 py-1 xs:text-sm">
            {t("StartEarningMoney")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
