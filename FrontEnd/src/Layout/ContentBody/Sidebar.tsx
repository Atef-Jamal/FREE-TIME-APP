import { BiMenu } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import {
  showModal,
  updateThisEntity,
  openToast,
  updateSidebarUnReadedMsgCount,
  selectUnReadMsgsCount,
  selectUserAuth,
  selectSidebarCollapsed,
  selectOpenMusicModal,
  selectSmallScreen,
} from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { sidebareItems } from "../../helper/data";
import { NavLink } from "react-router-dom";
import { memo, useEffect } from "react";
import { axiosRequest, cn, handleApiError } from "../../utilities";
import SearchBar from "../../components/Shared/Modals/SearchModal/SearchBar";
import MusicPlayer from "../../components/Ui/MusicPlayer";

const Sidebar = memo(() => {
  const unReadMsgsCount = useAppSelector(selectUnReadMsgsCount);
  const userAuth = useAppSelector(selectUserAuth);
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const openMusicModal = useAppSelector(selectOpenMusicModal);
  const smallScreen = useAppSelector(selectSmallScreen);
  const { t } = useTranslation("sidebar");
  const dispatch = useAppDispatch();

  const handleCollaps = () => {
    dispatch(updateThisEntity({ entity: "sidebarCollapsed", value: !sidebarCollapsed }));
  };

  useEffect(() => {
    const getAllUnReadedMsgs = async () => {
      try {
        const response = await axiosRequest.get("api/conversations/all/all-unreaded-count");
        dispatch(
          updateSidebarUnReadedMsgCount({
            type: "ADD-ALL",
            userId: response.data,
          }),
        );
      } catch (error) {
        dispatch(
          openToast({
            message: handleApiError(error),
            type: "ERROR_GENERAL",
          }),
        );
      }
    };

    if (userAuth === "authenticated") {
      getAllUnReadedMsgs();
    }
  }, [userAuth, dispatch]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex h-full w-[80%] max-w-[400px] flex-col gap-y-2 border-r border-r-gray-500 bg-[#29293a] px-2 pt-1 lg:w-full lg:pt-3"
    >
      <div className={`hidden lg:block`}>
        <BiMenu
          onClick={handleCollaps}
          className={cn("text-2xl", sidebarCollapsed ? "mx-auto" : "ml-auto")}
        />
      </div>

      <div onClick={() => dispatch(showModal("search-modal"))} className="h-10 lg:hidden">
        <SearchBar placeholder={t("search Everything")} onChange={() => {}} readOnly />
      </div>

      {openMusicModal && <MusicPlayer />}

      <ul className="flex w-full flex-col gap-1">
        {sidebareItems.map((item, index) => {
          if (smallScreen) {
            if (item.path === "leaderboard" || item.path === "earn" || item.path === "rewards") return;
          }
          return (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "relative flex items-center gap-x-3 rounded-md px-4 py-2 transition-all hover:bg-[#40496975]",
                    isActive && "bg-[#40496975]",
                  )
                }
              >
                <span className={`py-1 transition-all duration-300 hover:rotate-[360deg]`}>{item.icon}</span>
                <span className={`truncate text-sm font-bold tracking-wide text-gray-400`}>
                  {t(item.title)}
                </span>
                {userAuth === "authenticated" &&
                  unReadMsgsCount.length > 0 &&
                  item.path === "privatechat" && (
                    <span className="absolute right-1 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#e23e32] text-xs font-bold">
                      {unReadMsgsCount.length}
                    </span>
                  )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export default Sidebar;
