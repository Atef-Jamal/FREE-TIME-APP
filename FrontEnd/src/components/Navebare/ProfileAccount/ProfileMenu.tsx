import { Link } from "react-router-dom";
import { toggleThisEntity } from "../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { MdOutlineDiversity3 } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { MdContactSupport } from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import { useRef } from "react";
import { useCloseMenuOnClickOutSide } from "../../../hooks";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";

interface ProfilTypeProp {
  setOpenProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileMenu = ({ setOpenProfileMenu }: ProfilTypeProp) => {
  const { hiddenLiveStats } = useAppSelector((state) => state.stateManeger);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const handleLogOut = async () => {
    localStorage.setItem("token", "");
    localStorage.setItem("active-converstaion", "");
    await signOut(auth);
    setOpenProfileMenu((previos) => !previos);
    window.location.href = `${window.location.origin}/?redirectedfrom=logout`;
  };

  const handleToggleLiveStats = () => {
    dispatch(toggleThisEntity({ entity: "hiddenLiveStats" }));
  };

  const handleClose = () => {
    setOpenProfileMenu(false);
  };
  useCloseMenuOnClickOutSide({ menuRef, handleClose });

  return (
    <div ref={menuRef} className="py-2">
      <Link
        to={"myprofile"}
        onClick={() => setOpenProfileMenu((previos) => !previos)}
        className="flex items-center hover:bg-[#3a6186ee] gap-5 sm:gap-[10px] w-full px-4 py-[6px]"
      >
        <IoPersonCircle style={{ fontSize: "18px" }} />
        <span className=" text-gray-400 font-bold">My profile</span>
      </Link>
      <Link
        to={"affiliates"}
        onClick={() => setOpenProfileMenu((previos) => !previos)}
        className="flex items-center hover:bg-[#3a6186ee] gap-5 sm:gap-[10px] w-full py-[6px]  px-4"
      >
        <MdOutlineDiversity3 style={{ fontSize: "18px" }} />
        <span className=" text-gray-400 font-bold ">Affiliate</span>
      </Link>
      <Link
        to={""}
        onClick={() => setOpenProfileMenu((previos) => !previos)}
        className="flex items-center hover:bg-[#3a6186ee] gap-5 sm:gap-[10px] w-full py-[6px]  px-4"
      >
        <MdContactSupport style={{ fontSize: "18px" }} />
        <span className=" text-gray-400 font-bold ">Support</span>
      </Link>
      <Link
        to={""}
        onClick={handleLogOut}
        className="flex items-center hover:bg-[#3a6186ee] gap-5 sm:gap-[10px] w-full py-[6px] px-4 mb-2"
      >
        <LuLogOut style={{ fontSize: "18px" }} />
        <span className=" text-gray-400 font-bold ">Log out</span>
      </Link>
      <hr className="mb-2" />
      <span className="text-gray-400 font-bold mb-2  w-full flex items-center justify-between px-2">
        Live Stats
        <button
          onClick={handleToggleLiveStats}
          className={`${
            hiddenLiveStats ? "bg-[#201a1a]" : "bg-[#362c2cf6]"
          } w-12 h-5 p-[1px] rounded-full flex items-center `}
        >
          <span
            className={`${
              hiddenLiveStats ? " ml-auto bg-[#53eb53]" : " bg-[#a0b1a0]"
            } w-6 h-6 rounded-full`}
          ></span>
        </button>
      </span>
      <span className="text-gray-400 font-bold mb-2 w-full flex items-center justify-between px-2">
        Show USD
        <button className="w-12 h-5 p-[1px] rounded-full flex items-center bg-[#362c2cf6]">
          <span className="w-6 h-6 rounded-full bg-[#a0b1a0]"></span>
        </button>
      </span>
    </div>
  );
};

export default ProfileMenu;
