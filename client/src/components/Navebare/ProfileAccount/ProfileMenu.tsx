import { Link } from "react-router-dom";
import { toggleLiveStats } from "../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";

import { MdOutlineDiversity3 } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { MdContactSupport } from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";

interface ProfilTypeProp {
  setOpenProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileMenu = ({ setOpenProfileMenu }: ProfilTypeProp) => {
  const { hiddenLiveStats } = useAppSelector((state) => state.stateManeger);
  const dispatch = useAppDispatch();

  const handleLogOut = async () => {
    localStorage.setItem("token", "");
    setOpenProfileMenu((previos) => !previos);
    window.location.href = `${window.location.origin}/?redirectedfrom=logout`;
  };

  const handleToggleLiveStats = () => {
    dispatch(toggleLiveStats());
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#00000018] ">
      <div
        onClick={() => setOpenProfileMenu((previos) => !previos)}
        className="w-full h-full"
      ></div>
      <div className=" absolute top-[70px] sm:top-[55px] right-5 w-[300px] xs:w-[200px] sm:w-[250px] rounded-lg flex flex-col items-center bg-[#32324c] p-2 ">
        <Link
          to={"myprofile"}
          onClick={() => setOpenProfileMenu((previos) => !previos)}
          className="flex items-center hover:bg-[#3a6186ee] gap-4 sm:gap-[10px] w-full p-2 rounded-md  "
        >
          <IoPersonCircle style={{ fontSize: "18px" }} />
          <span className="font-[500] text-gray-400 ">My profile</span>
        </Link>
        <Link
          to={"affiliates"}
          onClick={() => setOpenProfileMenu((previos) => !previos)}
          className="flex items-center hover:bg-[#3a6186ee]  gap-4 sm:gap-[10px] w-full p-2 rounded-md  font-[500] text-gray-400 hover:text-gray-200 "
        >
          <MdOutlineDiversity3 style={{ fontSize: "18px" }} />
          <span className="font-[500] text-gray-400 ">Affiliate</span>
        </Link>
        <Link
          to={""}
          onClick={() => setOpenProfileMenu((previos) => !previos)}
          className="flex items-center hover:bg-[#3a6186ee] gap-4 sm:gap-[10px] w-full p-2 rounded-md  "
        >
          <MdContactSupport style={{ fontSize: "18px" }} />
          <span className="font-[500] text-gray-400 ">Support</span>
        </Link>
        <Link
          to={""}
          onClick={handleLogOut}
          className="flex items-center hover:bg-[#3a6186ee] gap-4 sm:gap-[10px] w-full p-2 pb-4 border-b mb-4 font-[500] "
        >
          <LuLogOut style={{ fontSize: "18px" }} />
          <span className="font-[500] text-gray-400 ">Log out</span>
        </Link>
        <span className="text-gray-400 font-bold mb-2  w-full flex items-center justify-between">
          Live Stats
          <button
            onClick={handleToggleLiveStats}
            className={`${
              hiddenLiveStats ? "bg-[#2c2424]" : "bg-[#362c2cf6]"
            } w-12 h-5 p-[1px] rounded-full flex items-center `}
          >
            <span
              className={`${
                hiddenLiveStats ? " ml-auto bg-[#53eb53]" : " bg-[#a0b1a0]"
              } w-5 h-full rounded-full`}
            ></span>
          </button>
        </span>
        <span className="text-gray-400 font-bold mb-2 w-full flex items-center justify-between">
          Show USD
          <button className="w-12 h-5 p-[1px] rounded-full flex items-center bg-[#2c2424]">
            <span className="w-5 h-full rounded-full bg-[#a0b1a0]"></span>
          </button>
        </span>
      </div>
    </div>
  );
};

export default ProfileMenu;
