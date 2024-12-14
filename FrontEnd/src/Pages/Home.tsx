import Faq from "../components/Home/Faq";
import HeroSection from "../components/Home/HeroSection";
import HowToStart from "../components/Home/HowToStart";
import WhyIsFreeTime from "../components/Home/WhyIsFreeTime";
import TestimonialSection from "../components/Home/TestimonialSection";

const Home = () => {
  return (
    <div className="bg-[#222339] py-8">
      <p id="kkkkkkkkkkkk"></p>
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
