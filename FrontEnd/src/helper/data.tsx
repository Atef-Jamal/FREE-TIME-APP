import time from "../assets/images/timewall-logo.png";
import lootably from "../assets/images/lootably-logo.png";
import ayetLogo from "../assets/images/ayetLogo.webp";
import revu from "../assets/images/revu-logo-white.svg";
import AdGemGlow from "../assets/images/AdGemGlow.webp";
import offertoroLogo from "../assets/images/offertoroLogo.webp";
import AdGatemediaGlow from "../assets/images/AdGatemediaGlow.png";
import monlixLogo from "../assets/images/monlix-logo.svg";
import { RiMoneyPoundBoxFill } from "react-icons/ri";
import { GiWantedReward } from "react-icons/gi";
import { MdLeaderboard } from "react-icons/md";
import { BsCashStack } from "react-icons/bs";
import { TbAffiliateFilled } from "react-icons/tb";
import { MdStorefront } from "react-icons/md";
import { BiSolidMessageAltDetail } from "react-icons/bi";
import { IoChatbubblesSharp, IoHomeSharp } from "react-icons/io5";
import { FaMusic } from "react-icons/fa6";
import { DiAndroid } from "react-icons/di";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoDesktop } from "react-icons/io5";
import { SiApple, SiFirewalla } from "react-icons/si";
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
import type { IFilterByDevice, IFilterByPopularity } from "../types";
import { VscExpandAll } from "react-icons/vsc";
import { FaHeart, FaStar } from "react-icons/fa";

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
export const mobileNavBottomItems = [
  {
    path: "leaderboard",
    icon: <MdLeaderboard className="text-xl" />,
  },
  {
    path: "earn",
    icon: <RiMoneyPoundBoxFill className="text-2xl" />,
  },
  {
    path: "rewards",
    icon: <GiWantedReward className="text-2xl" />,
  },
  {
    path: "chat",
    icon: <IoChatbubblesSharp className="text-2xl" />,
  },
];

export const filterByDeviceMenuItems: { value: IFilterByDevice; icon: React.ReactNode }[] = [
  {
    value: "ALL",
    icon: <GiHamburgerMenu className="text-lg" />,
  },
  {
    value: "DESKTOP",
    icon: <IoDesktop className="text-lg" />,
  },
  {
    value: "ANDROID",
    icon: <DiAndroid className="text-lg" />,
  },
  {
    value: "MAC",
    icon: <SiApple className="text-lg" />,
  },
];

export const filterByPopularMenuItems: { value: IFilterByPopularity; icon: React.ReactNode }[] = [
  {
    value: "ALL",
    icon: <VscExpandAll className="text-lg" />,
  },
  {
    value: "REWARD",
    icon: <SiFirewalla className="text-lg" />,
  },
  {
    value: "POPULAR",
    icon: <FaHeart className="text-lg" />,
  },
  {
    value: "RAITING",
    icon: <FaStar className="text-lg" />,
  },
];

export const withdrawCash = [
  { bgColor: "#2187c7", image: paypalShopLogo },
  { bgColor: "#f89723", image: bitcoinShopLogo },
  { bgColor: "#11171e", image: amazonShopLogo },
  { bgColor: "#b753c7", image: appleShopLogo },
  { bgColor: "#ffffff", image: googleplayShopLogo },
  { bgColor: "#2187c7", image: fortniteShopLogo },
  { bgColor: "#0b1015", image: blizzardShopLogo },
  { bgColor: "#ffffff", image: netflixShopLogo },
];

export const withdrawGiftCards = [
  { bgColor: "#416d2d", image: lolShopLogo },
  { bgColor: "#ff000a", image: nintendoShopLogo },
  { bgColor: "#4042bb", image: playstationShopLogo },
  { bgColor: "#0b5555", image: faucet },
  { bgColor: "#2dab3d", image: xboxliveShopLogo },
  { bgColor: "#ff4655", image: valorantShopBg },
  { bgColor: "#11fd30", image: zalandoShopLogo },
  { bgColor: "#ffffff", image: visaShopLogo },
  { bgColor: "#691919", image: doorDashShopLogo },
  { bgColor: "#bab4df", image: steamShopLogo },
  { bgColor: "#640f59", image: robloxShopLogo },
  { bgColor: "#1601015d", image: ubereatsShopLogo },
  { bgColor: "#2ea57d", image: justEatShopLogo },
];

export const withdrawSkins = [
  { bgColor: "#35a596", image: ethereumShopLogo },
  { bgColor: "#5d9926", image: dogecoinShopLogo },
  { bgColor: "#4042bb", image: csgoShopLogo },
  { bgColor: "#662b04", image: achShopLogo },
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
