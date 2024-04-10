import { Link } from "react-router-dom";
import UserAccountActions from "../Registration/UserAccountActions";
import {  RegisterationForm } from "..";
import { useAppSelector } from "../../context/Hooks";
import { MusicPlayer } from "../../components";

const Navbare = () => {
  const { currentUser, openRegisterForm, openMusicModal } =
    useAppSelector((state) => state.stateManeger);

  return (
    <div className="w-full h-[75px] sm:h-[55px] px-5 sm:px-2 sticky top-0 z-[4] bg-[#22162c] flex items-center justify-between overflow-hidden ">
      <Link
        to={""}
        className="font-bold text-[1.65rem] tracking-widest italic text-white flex items-center"
      >
        <span className="text-[1.65rem] tracking-widest text-[#01D676] sm:hidden">
          FREE
        </span>
        <span className="text-[1.65rem] text-gray-300 sm:hidden">TIME</span>
      </Link>
      <div
        className={`z-[3] transition-all h-full ${
          openMusicModal ? "block" : "hidden"
        }`}
      >
        <MusicPlayer />
      </div>

      <UserAccountActions />
      {openRegisterForm && !currentUser && <RegisterationForm />}
    </div>
  );
};

export default Navbare;
