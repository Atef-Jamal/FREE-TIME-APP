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
import ProfileSkeleton from "./ProfileAccount/ProfileSkeleton";
import ProfileActions from "../Navebare/ProfileAccount/ProfileActions";
import RegisterButtons from "../Navebare/Registration/RegisterButtons";
import RegisterationForm from "./Registration/RegisterationForm";
import Search from "../Search/Search";
import SearchBar from "../Search/SearchBar";
import { BiSearch } from "react-icons/bi";

const Navbare = () => {
  const {
    currentUser,
    currentUserIsLoading,
    currentAccountRequestFullfiled,
    openRegisterForm,
  } = useAppSelector((state) => state.stateManeger);
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");

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

  useEffect(() => {
    getCurrentUser();
  }, [token]);

  return (
    <div className="relative w-full h-[80%] flex items-center justify-between">
      <Link
        to={""}
        className="sm:hidden tracking-wider font-bold italic text-white flex items-center"
      >
        <span className="text-[1.6rem] text-[#01D676]">FREE</span>
        <span className="text-[1.6rem] text-gray-300">TIME</span>
      </Link>

      <div
        onClick={() =>
          dispatch(openModel({ status: true, children: <Search /> }))
        }
        className="xs:hidden w-[600px] xl:w-[30%] sm:w-[35%] xs:w-[10%] h-full ml-auto mx-auto rounded-md overflow-hidden cursor-pointer"
      >
        <SearchBar
          placeholder="search EveryThing..."
          onChange={() => {}}
          readOnly
        />
      </div>
      <button
        onClick={() =>
          dispatch(openModel({ status: true, children: <Search /> }))
        }
        className="hidden xs:flex items-center justify-center min-w-[40px] h-full bg-[#383847] ml-auto mr-2 rounded-md overflow-hidden"
      >
        <BiSearch className=" text-xl opacity-70" />
      </button>
      {!currentUserIsLoading &&
        !currentUser &&
        currentAccountRequestFullfiled && <RegisterButtons />}
      {openRegisterForm && !currentUser && <RegisterationForm />}
      {currentUserIsLoading && (
        <div className="h-full">
          <ProfileSkeleton />
        </div>
      )}
      {currentUser && <ProfileActions />}
    </div>
  );
};

export default Navbare;
