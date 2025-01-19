import { lazy, memo, Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { makeRequest } from "../../utils";
import { handleApiError } from "../../utils/common";
// import SearchBar from "../Search/SearchBar";
import { BiSearch } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { openModel, setCurrentUser, showPopup, updateCurrentUserStatus } from "../../context/StateManeger";
import ProfileSkeleton from "./ProfileAccount/ProfileSkeleton";
import ProfileActions from "./ProfileAccount/ProfileActions";
import RegisterButtons from "./Registration/RegisterButtons";
import Search from "../Search/Search";
import SearchBar from "../Search/SearchBar";

const MusicPlayer = lazy(() => import("../../components/Music/MusicPlayer"));

const Navbare = memo(() => {
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  const openMusicModal = useAppSelector((state) => state.stateManeger.openMusicModal);
  const smallScreen = useAppSelector((state) => state.stateManeger.smallScreen);

  const { t } = useTranslation("navbar");

  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        if (token) {
          const response = await makeRequest.get("api/auth/currentuser");
          dispatch(setCurrentUser(response.data));
          dispatch(updateCurrentUserStatus("authenticated"));
        } else {
          dispatch(updateCurrentUserStatus("unauthenticated"));
        }
      } catch (error) {
        dispatch(updateCurrentUserStatus("unauthenticated"));
        dispatch(
          showPopup({
            type: "ERROR_GENERAL",
            message: handleApiError(error),
          }),
        );
      }
    };
    getCurrentUser();
  }, [token, dispatch]);

  const handleOpenSearch = () =>
    dispatch(
      openModel({
        status: true,
        children: <Search />,
      }),
    );

  return (
    <div className="sticky top-0 z-[6] flex h-[55px] items-center justify-end border-b border-[#f8d3d32a] bg-[#22162c] px-1 sm:px-3">
      <Link to={""} className="mr-auto hidden items-center text-3xl sm:flex">
        <span className="font-extrabold italic tracking-wider text-[#01D676]">FREE</span>
        <span className="font-extrabold italic tracking-wider text-gray-300">TIME</span>
      </Link>

      {/* <div className="hidden h-11 w-[300px] border lg:block"></div> */}
      {openMusicModal && !smallScreen && <Suspense children={<MusicPlayer />} />}

      <div
        onClick={() => dispatch(openModel({ status: true, children: <Search /> }))}
        className="mx-4 hidden h-10 max-w-[500px] flex-1 sm:block lg:h-11"
      >
        <SearchBar placeholder={t("search Everything")} onChange={() => {}} readOnly />
      </div>

      <button onClick={handleOpenSearch} className="mr-1 h-10 rounded-md bg-[#383847] px-2 sm:hidden lg:h-11">
        <BiSearch className="text-xl opacity-90" />
      </button>

      {currentUserStatus === "unauthenticated" && <RegisterButtons />}

      {token && currentUserStatus === "pending" && <ProfileSkeleton />}

      {currentUserStatus === "authenticated" && <ProfileActions />}
    </div>
  );
});

export default Navbare;
