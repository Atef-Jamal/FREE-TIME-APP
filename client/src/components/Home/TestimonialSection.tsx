import { FormEvent, useEffect, useState } from "react";
import { showPopup } from "../../context/StateManeger";
import { makeRequest } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { timeAgoFromMongoDBDate } from "../../context/functions";
import { MdOutlineStarOutline, MdOutlineStarPurple500 } from "react-icons/md";
import { avatar, moneyHome } from "../../assets";
import { SwiperSlide, Swiper } from "swiper/react";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { User } from "../../types";

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
  const dispatch = useAppDispatch();

  const handleSendTestimonial = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      dispatch(showPopup({ message: "Sign In First", status: true }));
      return;
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
        const response = await makeRequest.get("api/testimonials");
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
  );
};

export default TestimonialSection;
