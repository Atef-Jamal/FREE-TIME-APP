import { Link } from "react-router-dom";
import { toggleThisEntity } from "../../../context/StateManeger";
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
    dispatch(toggleThisEntity({ entity: "hiddenLiveStats" }));
  };

  // useCloseMenuOnClickOutSide({
  //   menuRef: profileMenuRef,
  //   onClose: () => setOpenProfileMenu(false),
  // });

  return (
    <div>
      <Link
        to={"myprofile"}
        // onClick={() => setOpenProfileMenu((previos) => !previos)}
        className="flex items-center hover:bg-[#3a6186ee] gap-5 sm:gap-[10px] w-full pt-2 px-4"
      >
        <IoPersonCircle style={{ fontSize: "18px" }} />
        <span className=" text-gray-400 font-bold">My profile</span>
      </Link>
      <Link
        to={"affiliates"}
        // onClick={() => setOpenProfileMenu((previos) => !previos)}
        className="flex items-center hover:bg-[#3a6186ee] gap-5 sm:gap-[10px] w-full pt-2 px-4"
      >
        <MdOutlineDiversity3 style={{ fontSize: "18px" }} />
        <span className=" text-gray-400 font-bold ">Affiliate</span>
      </Link>
      <Link
        to={""}
        className="flex items-center hover:bg-[#3a6186ee] gap-5 sm:gap-[10px] w-full pt-2 px-4"
      >
        <MdContactSupport style={{ fontSize: "18px" }} />
        <span className=" text-gray-400 font-bold ">Support</span>
      </Link>
      <Link
        to={""}
        onClick={handleLogOut}
        className="flex items-center hover:bg-[#3a6186ee] gap-5 sm:gap-[10px] w-full pt-2 px-4 pb-4 border-b mb-4"
      >
        <LuLogOut style={{ fontSize: "18px" }} />
        <span className=" text-gray-400 font-bold ">Log out</span>
      </Link>
      <span className="text-gray-400 font-bold mb-2  w-full flex items-center justify-between px-2">
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
      <span className="text-gray-400 font-bold mb-2 w-full flex items-center justify-between px-2">
        Show USD
        <button className="w-12 h-5 p-[1px] rounded-full flex items-center bg-[#2c2424]">
          <span className="w-5 h-full rounded-full bg-[#a0b1a0]"></span>
        </button>
      </span>
    </div>
  );
};

export default ProfileMenu;
