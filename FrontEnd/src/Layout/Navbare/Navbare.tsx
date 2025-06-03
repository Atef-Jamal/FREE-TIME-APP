import { memo } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { useTranslation } from "react-i18next";
import { selectUserAuth, showModal } from "../../context/appStateSlice";
import SearchBar from "../../components/Shared/Modals/SearchModal/SearchBar";
// import Search from "../../components/Shared/Modals/SearchModal/Search";
import NavRegisterButtons from "../../components/Ui/NavRegisterButtons";
import NavProfileHeaderSkeleton from "../../components/Ui/NavProfileHeaderSkeleton";
import NavProfileHeader from "../../components/Ui/NavProfileHeader";

const Navbare = memo(() => {
  const userAuth = useAppSelector(selectUserAuth);
  const { t } = useTranslation("navbar");
  const dispatch = useAppDispatch();

  const token = localStorage.getItem("token");

  return (
    <div className="sticky top-0 z-[6] flex h-[55px] items-center justify-between border-b border-[#f8d3d32a] bg-[#22162c] px-1 sm:px-3">
      <Link to={""} className="hidden items-center text-3xl sm:flex">
        <span className="font-extrabold italic tracking-wider text-[#01D676]">FREE</span>
        <span className="font-extrabold italic tracking-wider text-gray-300">TIME</span>
      </Link>

      <div className="ml-4 flex h-10 flex-1 items-center justify-end gap-x-3 lg:h-11">
        <div
          onClick={() => dispatch(showModal("search-modal"))}
          className="hidden h-10 max-w-[600px] flex-1 lg:block lg:h-11"
        >
          <SearchBar placeholder={t("search Everything")} onChange={() => {}} readOnly />
        </div>

        {userAuth === "unauthenticated" && <NavRegisterButtons />}

        {token && userAuth === "pending" && <NavProfileHeaderSkeleton />}

        {userAuth === "authenticated" && <NavProfileHeader />}
      </div>
    </div>
  );
});

export default Navbare;
