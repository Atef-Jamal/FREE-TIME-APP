import { lazy, memo, useEffect, Suspense } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { makeRequest } from "../../utils";
import { handleApiError } from "../../utils/common";
import SearchBar from "../Search/SearchBar";
import { BiSearch } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import {
  setCurrentUser,
  setCurrentAccountRequestFullfiled,
  setCurrentUserIsLoading,
  showPopup,
  openModel,
} from "../../context/StateManeger";

import ProfileSkeleton from "./ProfileAccount/ProfileSkeleton";
import ProfileActions from "./ProfileAccount/ProfileActions";
import RegisterButtons from "./Registration/RegisterButtons";
import Search from "../Search/Search";

const RegisterationForm = lazy(() => import("./Registration/RegisterationForm"));

const Navbare = memo(() => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const currentUserIsLoading = useAppSelector((state) => state.stateManeger.currentUserIsLoading);
  const isCurrentUserReqFinished = useAppSelector((state) => state.stateManeger.isCurrentUserReqFinished);
  const openRegisterForm = useAppSelector((state) => state.stateManeger.openRegisterForm);
  const { t } = useTranslation("navbar");

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
            type: "ERROR_GENERAL",
            message: handleApiError(error),
          }),
        );
      } finally {
        dispatch(setCurrentUserIsLoading(false));
        dispatch(setCurrentAccountRequestFullfiled(true));
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
    <div className="relative w-full h-[80%] flex items-center justify-between">
      <Link to={""} className="sm:hidden flex items-center pr-2">
        <span className="italic tracking-wider text-[2rem] font-extrabold text-[#01D676]">FREE</span>
        <span className="italic tracking-wider text-[2rem] font-extrabold text-gray-300">TIME</span>
      </Link>

      <div
        onClick={() => dispatch(openModel({ status: true, children: <Search /> }))}
        className="xs:hidden w-[600px] xl:w-[30%] sm:w-[35%] xs:w-[10%] h-full ml-auto mx-auto rounded-md overflow-hidden cursor-pointer"
      >
        <SearchBar placeholder={t("search Everything")} onChange={() => {}} readOnly />
      </div>
      <button
        onClick={handleOpenSearch}
        className="hidden xs:flex items-center justify-center min-w-[40px] h-full bg-[#383847] ml-auto mr-1 rounded-md overflow-hidden"
      >
        <BiSearch className=" text-xl opacity-70" />
      </button>
      {!currentUserIsLoading && !currentUser && isCurrentUserReqFinished && <RegisterButtons />}
      {openRegisterForm && !currentUser && (
        <Suspense>
          <RegisterationForm />
        </Suspense>
      )}
      {currentUserIsLoading && (
        <div className="h-full">
          <ProfileSkeleton />
        </div>
      )}
      {currentUser && <ProfileActions />}
    </div>
  );
});

export default Navbare;
