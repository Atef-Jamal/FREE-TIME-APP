import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { useEffect } from "react";
import {
  setCurrentUser,
  setCurrentAccountRequestFullfiled,
  setCurrentUserIsLoading,
  showPopup,
  openModel,
} from "../../context/StateManeger";
import { makeRequest } from "../../utils";
import { handleApiError } from "../../utils/common";

import MusicPlayer from "../Music/MusicPlayer";
import ProfileSkeleton from "./ProfileAccount/ProfileSkeleton";
import ProfileActions from "../Navebare/ProfileAccount/ProfileActions";
import RegisterButtons from "../Navebare/Registration/RegisterButtons";
import RegisterationForm from "./Registration/RegisterationForm";
import { BiSearch } from "react-icons/bi";
import Search from "../Search/Search";

const Navbare = () => {
  const {
    currentUser,
    currentUserIsLoading,
    currentAccountRequestFullfiled,
    openRegisterForm,
    openMusicModal,
  } = useAppSelector((state) => state.stateManeger);

  const dispatch = useAppDispatch();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        if (token) {
          dispatch(setCurrentUserIsLoading(true));
          const response = await makeRequest.get("api/auth/currentuser");
          dispatch(setCurrentUser(response.data));
        }
      } catch (error) {
        dispatch(
          showPopup({
            status: true,
            type: "ERROR_GENERAL",
            message: handleApiError(error),
          })
        );
      } finally {
        dispatch(setCurrentUserIsLoading(false));
        const timout = setTimeout(() => {
          dispatch(setCurrentAccountRequestFullfiled(true));
        }, 1500);
        return () => clearTimeout(timout);
      }
    };

    getCurrentUser();
  }, [token]);

  return (
    <div className="w-full h-[75px] sm:h-[55px] px-5 sm:px-1 sticky top-0 z-[4] bg-[#22162c] flex items-center justify-between">
      <Link
        to={""}
        className="sm:hidden font-bold text-[1.65rem] tracking-widest italic text-white flex items-center"
      >
        <span className="text-[1.65rem] tracking-widest text-[#01D676]">
          FREE
        </span>
        <span className="text-[1.65rem] text-gray-300">TIME</span>
      </Link>
      <div
        className={`absolute top-0 -left-0 z-[3] transition-all h-full mr-auto  ${
          openMusicModal ? "block" : "hidden"
        }`}
      >
        <MusicPlayer />
      </div>
      <div
        onClick={() =>
          dispatch(openModel({ status: true, children: <Search /> }))
        }
        className="border rounded-md w-[700px] xl:w-[25%] sm:w-[35%] xs:w-[10%] h-[47px] sm:h-[40px] mr-2 xs:mr-1 ml-auto flex items-center cursor-pointer border-gray-700 bg-[#333b3fcb] px-2 xs:px-0"
      >
        <BiSearch className="text-3xl sm:text-xl opacity-50 min-w-fit xs:mx-auto" />
        <span className="h-full border-l border-gray-700 mx-2 xs:hidden"></span>
        <span className="text-gray-400 text-lg truncate xs:hidden sm:text-sm">
          Search For Everything, Features, users, apps, frames, ect..
        </span>
      </div>

      {!currentUserIsLoading &&
        !currentUser &&
        currentAccountRequestFullfiled && <RegisterButtons />}
      {openRegisterForm && !currentUser && <RegisterationForm />}
      {currentUserIsLoading && <ProfileSkeleton />}
      {currentUser && <ProfileActions />}
    </div>
  );
};

export default Navbare;
