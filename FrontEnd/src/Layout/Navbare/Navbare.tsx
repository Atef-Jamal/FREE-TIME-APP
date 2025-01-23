import { memo } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { useTranslation } from "react-i18next";
import { showModal } from "../../context/StateManeger";
import SearchBar from "../../components/Shared/Modals/SearchModal/SearchBar";
import Search from "../../components/Shared/Modals/SearchModal/Search";
import RegisterButtons from "../../components/Ui/RegisterButtons";
import ProfileSkeleton from "../../components/Shared/Common/ProfileSkeleton";
import ProfileActions from "../../components/Ui/ProfileActions";

const Navbare = memo(() => {
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
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
          onClick={() => dispatch(showModal({ children: <Search /> }))}
          className="hidden h-10 max-w-[600px] flex-1 lg:block lg:h-11"
        >
          <SearchBar placeholder={t("search Everything")} onChange={() => {}} readOnly />
        </div>

        {currentUserStatus === "unauthenticated" && <RegisterButtons />}

        {token && currentUserStatus === "pending" && <ProfileSkeleton />}

        {currentUserStatus === "authenticated" && <ProfileActions />}
      </div>
    </div>
  );
});

export default Navbare;
