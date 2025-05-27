import { Link } from "react-router-dom";
import { updateThisEntity } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { MdOutlineDiversity3 } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { MdContactSupport } from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import { useRef } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { cn } from "../../utilities";

interface IProps {
  setOpenProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileMenu = ({ setOpenProfileMenu }: IProps) => {
  const hiddenLiveStats = useAppSelector((state) => state.appState.hiddenLiveStats);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useClickOutside(menuRef, () => setOpenProfileMenu(false));

  const handleLogOut = async () => {
    localStorage.clear();
    setOpenProfileMenu((previos) => !previos);
    window.location.href = `${window.location.origin}/?redirectedfrom=logout`;
  };

  const handleToggleLiveStats = () => {
    dispatch(updateThisEntity({ entity: "hiddenLiveStats", value: !hiddenLiveStats }));
  };

  return (
    <div ref={menuRef} className="py-2">
      <Link
        to={"myprofile"}
        onClick={() => setOpenProfileMenu((previos) => !previos)}
        className="flex w-full items-center gap-5 px-4 py-[6px] hover:bg-[#3a6186ee] sm:gap-[10px]"
      >
        <IoPersonCircle style={{ fontSize: "18px" }} />
        <span className="font-bold text-gray-400">My profile</span>
      </Link>
      <Link
        to={"affiliates"}
        onClick={() => setOpenProfileMenu((previos) => !previos)}
        className="flex w-full items-center gap-5 px-4 py-[6px] hover:bg-[#3a6186ee] sm:gap-[10px]"
      >
        <MdOutlineDiversity3 style={{ fontSize: "18px" }} />
        <span className="font-bold text-gray-400">Affiliate</span>
      </Link>
      <Link
        to={""}
        onClick={() => setOpenProfileMenu((previos) => !previos)}
        className="flex w-full items-center gap-5 px-4 py-[6px] hover:bg-[#3a6186ee] sm:gap-[10px]"
      >
        <MdContactSupport style={{ fontSize: "18px" }} />
        <span className="font-bold text-gray-400">Support</span>
      </Link>
      <Link
        to={""}
        onClick={handleLogOut}
        className="mb-2 flex w-full items-center gap-5 px-4 py-[6px] hover:bg-[#3a6186ee] sm:gap-[10px]"
      >
        <LuLogOut style={{ fontSize: "18px" }} />
        <span className="font-bold text-gray-400">Log out</span>
      </Link>
      <hr className="mb-2" />
      <span className="mb-2 flex w-full items-center justify-between px-2 font-bold text-gray-400">
        Live Stats
        <button
          onClick={handleToggleLiveStats}
          className={cn(
            "flex h-5 w-12 items-center rounded-full p-[1px]",
            hiddenLiveStats ? "bg-[#201a1a]" : "bg-[#362c2cf6]",
          )}
        >
          <span
            className={cn("h-6 w-6 rounded-full", hiddenLiveStats ? "ml-auto bg-[#53eb53]" : "bg-[#a0b1a0]")}
          ></span>
        </button>
      </span>
      <span className="mb-2 flex w-full items-center justify-between px-2 font-bold text-gray-400">
        Show USD
        <button className="flex h-5 w-12 items-center rounded-full bg-[#362c2cf6] p-[1px]">
          <span className="h-6 w-6 rounded-full bg-[#a0b1a0]"></span>
        </button>
      </span>
    </div>
  );
};

export default ProfileMenu;
