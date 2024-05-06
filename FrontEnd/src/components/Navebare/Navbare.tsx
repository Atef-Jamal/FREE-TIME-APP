import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { useEffect } from "react";
import {
  setCurrentUser,
  setCurrentAccountRequestFullfiled,
  setCurrentUserIsLoading,
  showPopup,
} from "../../context/StateManeger";
import { makeRequest } from "../../utils";
import { handleApiError } from "../../utils/common";

import MusicPlayer from "../Music/MusicPlayer";
import ProfileSkeleton from "./ProfileAccount/ProfileSkeleton";
import ProfileActions from "../Navebare/ProfileAccount/ProfileActions";
import RegisterButtons from "../Navebare/Registration/RegisterButtons";
import RegisterationForm from "./Registration/RegisterationForm";
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
        console.log(error);
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
    <div className="w-full h-[75px] sm:h-[55px] px-5 sm:px-2 sticky top-0 z-[4] bg-[#22162c] flex items-center justify-between">
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
