import time from "../assets/timewall-logo.png";
import lootably from "../assets/lootably-logo.png";
import ayetLogo from "../assets/ayetLogo.webp";
import revu from "../assets/revu-logo-white.svg";
import AdGemGlow from "../assets/AdGemGlow.webp";
import offertoroLogo from "../assets/offertoroLogo.webp";
import AdGatemediaGlow from "../assets/AdGatemediaGlow.png";
import monlixLogo from "../assets/monlix-logo.svg";
import game01 from "../assets/game01.jpeg";
import game02 from "../assets/game02.jpeg";
import game03 from "../assets/game03.jpg";
import game04 from "../assets/game04.jpeg";
import game05 from "../assets/game05.jpg";
import game06 from "../assets/game06.jpeg";
import game07 from "../assets/game07.jpeg";
import game08 from "../assets/game08.jpg";
import game09 from "../assets//game09.jpg";
import game10 from "../assets/game10.jpg";
import game11 from "../assets/game11.jpg";
import game12 from "../assets/game12.jpg";
import game13 from "../assets/game13.jpg";
import game14 from "../assets/game14.jpg";
import game15 from "../assets/game15.jpg";
import game16 from "../assets/game16.jpg";
import game17 from "../assets/game17.jpg";
import game18 from "../assets/game18.png";
import game19 from "../assets/game19.jpg";
import game20 from "../assets/game20.jpg";
// import game21 from "../assets/game21.jpg";
import { RiMoneyPoundBoxFill } from "react-icons/ri";
import { GiWantedReward } from "react-icons/gi";
import { MdLocalOffer, MdOutlineReadMore } from "react-icons/md";
import { MdLeaderboard } from "react-icons/md";
import { BsCashStack } from "react-icons/bs";
import { TbAffiliateFilled } from "react-icons/tb";
import { MdStorefront } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { IoGameController } from "react-icons/io5";
import { TbRelationManyToMany } from "react-icons/tb";
import { FaBook } from "react-icons/fa";
import { BiSolidMessageAltDetail } from "react-icons/bi";
import { IoHomeSharp } from "react-icons/io5";
import { FaMusic } from "react-icons/fa6";

import {
  paypalShopLogo,
  bitcoinShopLogo,
  amazonShopLogo,
  appleShopLogo,
  googleplayShopLogo,
  fortniteShopLogo,
  blizzardShopLogo,
  netflixShopLogo,
  lolShopLogo,
  nintendoShopLogo,
  playstationShopLogo,
  faucet,
  xboxliveShopLogo,
  valorantShopBg,
  zalandoShopLogo,
  visaShopLogo,
  doorDashShopLogo,
  steamShopLogo,
  robloxShopLogo,
  ubereatsShopLogo,
  justEatShopLogo,
  ethereumShopLogo,
  dogecoinShopLogo,
  csgoShopLogo,
  achShopLogo,
} from "../assets";

export const sidebareItems = [
  {
    title: "Home",
    path: "/",
    icon: <IoHomeSharp />,
  },
  {
    title: "Earn",
    path: "earn",
    icon: <RiMoneyPoundBoxFill />,
  },
  {
    title: "Rewards",
    path: "rewards",
    icon: <GiWantedReward />,
  },
  {
    title: "Private Chat",
    path: "privatechat",
    icon: <BiSolidMessageAltDetail />,
  },
  {
    title: "Market Place",
    path: "marketplace",
    icon: <MdStorefront />,
  },
  {
    title: "Musics",
    path: "musics",
    icon: <FaMusic />,
  },
  {
    title: "Leaderboard",
    path: "leaderboard",
    icon: <MdLeaderboard />,
  },
  {
    title: "Offers",
    path: "offers",
    childern: [
      {
        title: "All",
        path: "offers/",
        icon: <MdOutlineReadMore className="text-2xl" />,
      },
      {
        title: "Sign Up",
        path: "offers/offerssignup",
        icon: <FaUserCheck className="text-lg ml-[4px]" />,
      },
      {
        title: "Quizs",
        path: "offers/quiz",
        icon: <FaBook className="" />,
      },
      {
        title: "Games",
        path: "offers/games",
        icon: <IoGameController className="text-lg" />,
      },
      {
        title: "Others",
        path: "offers/other",
        icon: <TbRelationManyToMany className="text-lg" />,
      },
    ],
    icon: <MdLocalOffer />,
  },
  {
    title: "Affiliates",
    path: "affiliates",
    icon: <TbAffiliateFilled />,
  },
  {
    title: "Cashout",
    path: "cashout",
    icon: <BsCashStack />,
  },
];

export const tasks = [
  {
    name: "name task",
    title: "Game",
    category: "Game",
    _id: "task1",
    prize: 60,
    image: game01,
    description:
      "start game and reach level 2 then get your reward immediately",
  },
  {
    name: "name task",
    title: "Game",
    category: "Game",
    _id: "task2",
    prize: 60,
    image: game02,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Signup",
    _id: "task3",
    prize: 60,
    image: game03,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Signup",
    _id: "task4",
    prize: 60,
    image: game04,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Game",
    _id: "task5",
    prize: 60,
    image: game05,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Game",
    _id: "task6",
    prize: 60,
    image: game06,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Signup",
    _id: "task7",
    prize: 60,
    image: game07,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Game",
    _id: "task8",
    prize: 60,
    image: game08,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Game",
    _id: "task9",
    prize: 60,
    image: game09,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Game",
    _id: "task10",
    prize: 60,
    image: game10,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Signup",
    _id: "task11",
    prize: 60,
    image: game11,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Game",
    _id: "task12",
    prize: 60,
    image: game12,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Game",
    _id: "task13",
    prize: 60,
    image: game13,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Signup",
    _id: "task14",
    prize: 60,
    image: game14,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Signup",
    _id: "task15",
    prize: 60,
    image: game15,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Game",
    _id: "task16",
    prize: 60,
    image: game16,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Game",
    _id: "task17",
    prize: 60,
    image: game17,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Game",
    _id: "task18",
    prize: 60,
    image: game18,
    description:
      "start game and reach level 2 then get your reward immediately",
  },
  {
    name: "name task",
    title: "Game",
    category: "category",
    _id: "task19",
    prize: 60,
    image: game19,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
  {
    name: "name task",
    title: "Game",
    category: "Game",
    _id: "task20",
    prize: 60,
    image: game20,
    description:
      "start game and reach level 2 then get your reward immediately ",
  },
];

export const withdrawCash = [
  { bgColor: "bg-[#2187c7]", image: paypalShopLogo },
  { bgColor: "bg-[#f89723]", image: bitcoinShopLogo },
  { bgColor: "bg-[#11171e]", image: amazonShopLogo },
  { bgColor: "bg-[#b753c7]", image: appleShopLogo },
  { bgColor: "bg-[#ffffff]", image: googleplayShopLogo },
  { bgColor: "bg-[#2187c7]", image: fortniteShopLogo },
  { bgColor: "bg-[#0b1015]", image: blizzardShopLogo },
  { bgColor: "bg-[#ffffff]", image: netflixShopLogo },
];

export const withdrawGiftCards = [
  { bgColor: "bg-[#416d2d]", image: lolShopLogo },
  { bgColor: "bg-[#ff000a]", image: nintendoShopLogo },
  { bgColor: "bg-[#4042bb]", image: playstationShopLogo },
  { bgColor: "bg-[#0b5555]", image: faucet },
  { bgColor: "bg-[#2dab3d]", image: xboxliveShopLogo },
  { bgColor: "bg-[#ff4655]", image: valorantShopBg },
  { bgColor: "bg-[#11fd30]", image: zalandoShopLogo },
  { bgColor: "bg-[#ffffff]", image: visaShopLogo },
  { bgColor: "bg-[#691919]", image: doorDashShopLogo },
  { bgColor: "bg-[#bab4df]", image: steamShopLogo },
  { bgColor: "bg-[#640f59]", image: robloxShopLogo },
  { bgColor: "bg-[#1601015d]", image: ubereatsShopLogo },
  { bgColor: "bg-[#2ea57d]", image: justEatShopLogo },
];

export const withdrawSkins = [
  { bgColor: "bg-[#35a596]", image: ethereumShopLogo },
  { bgColor: "bg-[#5d9926]", image: dogecoinShopLogo },
  { bgColor: "bg-[#4042bb]", image: csgoShopLogo },
  { bgColor: "bg-[#662b04]", image: achShopLogo },
];

export const arrayoffers = [
  { image: time, title: "BitLaps" },
  { image: lootably, title: "lootaby" },
  { image: ayetLogo, title: "AyetLogo" },
  { image: revu, title: "Revenue Univers" },
  { image: AdGemGlow, title: "AdGate" },
  { image: offertoroLogo, title: "offertoro" },
  { image: AdGatemediaGlow, title: "AdGatemed" },
  { image: monlixLogo, title: "Monlix" },
];
