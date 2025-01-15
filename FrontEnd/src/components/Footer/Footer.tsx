import { IoIosArrowDown } from "react-icons/io";
import { FaTwitter } from "react-icons/fa6";
import { LuInstagram } from "react-icons/lu";
import { FaFacebook } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { MdDeck } from "react-icons/md";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isPrivateChatPage = location.pathname === "/privatechat";
  const isPublicChatPage = location.pathname === "/chat";
  if (isPrivateChatPage || isPublicChatPage) return;
  return (
    <div className="overflow-hidden bg-[#181929]">
      <div className="flex items-center justify-center">
        <div className="my-16 flex w-full flex-wrap justify-between px-5 lg:w-[80%]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center text-[1.65rem] font-bold tracking-widest text-white">
              <span className="text-[1.65rem] tracking-widest text-[#01D676]">FREE</span>
              TIME
            </div>
            <p className="text-xs text-gray-300 lg:text-base">Freetime.com | All Rights Reserved</p>
            <p className="text-xs text-gray-400 lg:text-base">@ Copyright 2020 - 2023</p>
            <p className="text-xs font-bold text-gray-500 lg:text-base">
              See Our 32,000 Reviews on Truspilot
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-bold text-gray-300">Language</h1>
            <p className="flex items-center gap-2 rounded-md bg-slate-700 px-2 py-1">
              <IoIosArrowDown />
              English
            </p>
          </div>
          <ul className="flex flex-col gap-3 font-bold sm:mt-6">
            <li className="text-sm text-gray-300 lg:text-base">About</li>
            <li className="text-sm text-gray-300 lg:text-base">Blog</li>
            <li className="text-sm text-gray-300 lg:text-base">Term ofService </li>
            <li className="text-sm text-gray-300 lg:text-base">Privacy policy</li>
            <li className="text-sm text-gray-300 lg:text-base">How does Freetime work ?</li>
          </ul>
          <ul className="flex flex-col gap-3 font-bold sm:mt-6 sm:px-6">
            <li className="text-sm text-gray-300 lg:text-base">Support</li>
            <li className="text-sm text-gray-300 lg:text-base">FAQ</li>
            <li className="text-sm text-gray-300 lg:text-base">Contact</li>
            <li className="text-sm text-gray-300 lg:text-base">Support</li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="ml-[6%] flex items-center lg:ml-[9%]">
        <ul className="my-6 flex items-center gap-4 lg:gap-6">
          <span className="rounded-full bg-gray-700 p-2">
            <FaTwitter fontSize={"small"} />
          </span>
          <span className="rounded-full bg-gray-700 p-2">
            <FaFacebook fontSize={"small"} />
          </span>
          <span className="rounded-full bg-gray-700 p-2">
            <LuInstagram fontSize={"small"} />
          </span>
          <span className="rounded-full bg-gray-700 p-2">
            <FaStar fontSize={"small"} />
          </span>
          <span className="rounded-full bg-gray-700 p-2">
            <MdDeck fontSize={"small"} />
          </span>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
