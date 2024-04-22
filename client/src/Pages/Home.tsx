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
  return (
    <div className="bg-[#222339] flex flex-col items-center pt-8">
      <div className="w-[85%] sm:w-full lg:w-[88%] ">
        <HeroSection />
        <div className="flex flex-col items-center gap-1"></div>
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

// const searchData = [
//   {
//     searchText: "how can i get coupon code",
//     path: "/rewards?element=coupon-code",
//     type: "local",
//   },
//   {
//     searchText: "where is my refferal link",
//     path: "/myprofile?element=refferal-link",
//     type: "local",
//   },
//   {
//     searchText:
//       "playing games and complete tasks songs to earn a lot of points",
//     path: "/earn",
//     type: "local",
//   },
//   {
//     searchText: "buy songs musics and songs enjoy with trending songs",
//     path: "/MUSICS?element=music",
//     type: "local",
//   },
// ];

// import { ChangeEvent, useEffect, useState } from "react";

// type TypeArray = {
//   searchText: string;
//   path: string;
//   type: string;
// };

// const Home = () => {
//   const [searchQuery, setSearchQuery] = useState<string | undefined>();
//   const [results, setResults] = useState<TypeArray[]>([]);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   const sortByWordFrequency = (arr: TypeArray[], word: any) => {
//     return arr.sort((a: TypeArray, b: TypeArray) => {
//       const countA = (a.searchText.match(new RegExp(word, "gi")) || []).length;
//       const countB = (b.searchText.match(new RegExp(word, "gi")) || []).length;

//       return countB - countA;
//     });
//   };

//   useEffect(() => {
//     if (searchQuery === "") {
//       setResults([]);
//     } else {
//       const sortedArray = sortByWordFrequency(searchData, searchQuery);
//       setResults(sortedArray);
//     }
//   }, [searchQuery]);

//   useEffect(() => {
//     if (searchQuery !== "") {
//     searchData
//     }
//   }, [searchQuery]);

//   return (
//     <div className="bg-[#222339] flex flex-col items-center gap-3 p-8">
//       <input
//         type="text"
//         onChange={handleChange}
//         value={searchQuery}
//         className="bg-[#351f1f] text-gray-300 outline-none rounded-md border border-gray-500"
//       />
//       <div className="w-[700px] h-[150px] border flex flex-col items-center gap-1">
//         <p className="w-full flex flex-wrap">
//           {results.map((element) => {
//             return element.searchText.split(" ").map((word, index) => {
//               return (
//                 <span
//                   key={index}
//                   className={`${
//                     searchQuery
//                       ?.toLocaleLowerCase()
//                       .includes(word.toLocaleLowerCase())
//                       ? "bg-[#0d1a1d] text-[#3ea729] mr-1"
//                       : "mr-1"
//                   }`}
//                 >
//                   {word}
//                 </span>
//               );
//             });
//           })}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Home;
