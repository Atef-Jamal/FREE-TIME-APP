import { useEffect, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { toggleRegisterForm } from "../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Faq = lazy(() => import("../components/Home/Faq"));
const HeroSection = lazy(() => import("../components/Home/HeroSection"));
const HowToStart = lazy(() => import("../components/Home/HowToStart"));
const WhyIsFreeTime = lazy(() => import("../components/Home/WhyIsFreeTime"));
const TestimonialSection = lazy(
  () => import("../components/Home/TestimonialSection")
);

const Home = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);

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
        <Suspense fallback={""}>
          <HeroSection />
        </Suspense>
        <Suspense fallback={""}>
          <HowToStart />
        </Suspense>
        <div className="flex justify-center">
          <span className="bg-red-400 text-black px-6 py-4 mt-8 rounded-md font-[450]">
            Start Earning
          </span>
        </div>
        <Suspense fallback={""}>
          <WhyIsFreeTime />
        </Suspense>
      </div>
      <Suspense fallback={""}>
        <Faq />
      </Suspense>
      <Suspense fallback={""}>
        <TestimonialSection />
      </Suspense>
    </div>
  );
};

export default Home;
