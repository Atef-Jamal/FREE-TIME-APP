import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toggleRegisterForm } from "../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import Faq from "../components/Home/Faq";
import HeroSection from "../components/Home/HeroSection";
import HowToStart from "../components/Home/HowToStart";
import WhyIsFreeTime from "../components/Home/WhyIsFreeTime";
import TestimonialSection from "../components/Home/TestimonialSection";

const Home = () => {
  const { currentUser, onlineUsers } = useAppSelector(
    (state) => state.stateManeger
  );
  const [searchParams] = useSearchParams();

  const dispatch = useAppDispatch();
  const searchValue = searchParams.get("ref");

  useEffect(() => {
    if (searchValue && !currentUser) {
      dispatch(toggleRegisterForm(true));
    }
  }, [dispatch, searchValue, currentUser]);

  return (
    <div className="bg-[#222339] flex flex-col items-center pt-8">
      <div className="w-[85%] sm:w-full lg:w-[88%] ">
        <HeroSection />
        <div className="flex flex-col items-center gap-1">
          {onlineUsers.map((item, i) => {
            return <div key={i}>{item}</div>;
          })}
        </div>
        <HowToStart />
        <div className="flex justify-center">
          <span className="bg-red-400 text-black px-6 py-4 mt-8 rounded-md font-[450]">
            Start Earning
          </span>
        </div>
        <WhyIsFreeTime />
      </div>
      <Faq />
      <TestimonialSection />
    </div>
  );
};

export default Home;
