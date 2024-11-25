import Faq from "../components/home/Faq";
import HeroSection from "../components/home/HeroSection";
import HowToStart from "../components/home/HowToStart";
import WhyIsFreeTime from "../components/home/WhyIsFreeTime";
import TestimonialSection from "../components/home/TestimonialSection";

const Home = () => {
  return (
    <div className="bg-[#222339] py-8">
      HELLO
      <div className="mb-8">
        <HeroSection />
      </div>
      <div className="mb-8">
        <HowToStart />
      </div>
      <div className="mb-8">
        <WhyIsFreeTime />
      </div>
      <div className="mb-8">
        <Faq />
      </div>
      <div className="mb-8">
        <TestimonialSection />
      </div>
    </div>
  );
};

export default Home;
