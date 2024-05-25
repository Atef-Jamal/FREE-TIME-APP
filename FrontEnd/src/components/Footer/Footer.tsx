import { IoIosArrowDown } from "react-icons/io";
import { FaTwitter } from "react-icons/fa6";
import { LuInstagram } from "react-icons/lu";
import { FaFacebook } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { MdDeck } from "react-icons/md";

const Footer = () => {
  return (
    <div className="bg-[#181929] sm:pb-14 overflow-hidden ">
      <div className="flex justify-center items-center">
        <div className="w-[80%] flex justify-between my-16 sm:w-full sm:flex-wrap sm:px-5">
          <div className="flex flex-col gap-4 ">
            <div className="font-bold text-[1.65rem] tracking-widest text-white flex items-center ">
              <span className="text-[1.65rem] tracking-widest text-[#01D676] ">
                FREE
              </span>
              TIME
            </div>
            <p className="text-gray-300 sm:text-xs">
              Freetime.com | All Rights Reserved
            </p>
            <p className=" text-gray-400 sm:text-xs">@ Copyright 2020 - 2023</p>
            <p className="font-bold text-gray-500 sm:text-xs">
              See Our 32,000 Reviews on Truspilot
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-bold  text-gray-300 ">Language</h1>
            <p className=" flex items-center gap-2 rounded-md px-2 py-1 bg-slate-700">
              <IoIosArrowDown />
              English
            </p>
          </div>
          <ul className="flex flex-col gap-3 font-bold sm:mt-6  ">
            <li className="text-gray-300 sm:text-sm">About</li>
            <li className="text-gray-300 sm:text-sm">Blog</li>
            <li className="text-gray-300 sm:text-sm">Term ofService </li>
            <li className="text-gray-300 sm:text-sm">Privacy policy</li>
            <li className="text-gray-300 sm:text-sm">
              How does Freetime work ?
            </li>
          </ul>
          <ul className="flex flex-col gap-3 font-bold sm:mt-6  sm:px-6  ">
            <li className="text-gray-300 sm:text-sm">Support</li>
            <li className="text-gray-300 sm:text-sm">FAQ</li>
            <li className="text-gray-300 sm:text-sm">Contact</li>
            <li className="text-gray-300 sm:text-sm">Support</li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="flex items-center ml-[9%] sm:ml-[6%]">
        <ul className="flex items-center gap-6 sm:gap-4 my-6">
          <span className="bg-gray-700 p-2 rounded-full">
            <FaTwitter fontSize={"small"} />
          </span>
          <span className="bg-gray-700 p-2 rounded-full">
            <FaFacebook fontSize={"small"} />
          </span>
          <span className="bg-gray-700 p-2 rounded-full">
            <LuInstagram fontSize={"small"} />
          </span>
          <span className="bg-gray-700 p-2 rounded-full">
            <FaStar fontSize={"small"} />
          </span>
          <span className="bg-gray-700 p-2 rounded-full">
            <MdDeck fontSize={"small"} />
          </span>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
