import { lazy, useEffect, useState } from "react";
import { BsArrowDown } from "react-icons/bs";
import {
  toggleNotifications,
  showPopup,
  openModel,
} from "../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { IoMdNotifications } from "react-icons/io";
import { TypeNotifications } from "../../../types";
const ApplyCoupon = lazy(() => import("../../Others/ApplyCoupon"));
const UserImage = lazy(() => import("../../Others/UserImage"));
const ProfileMenu = lazy(() => import("../../Navebare/ProfileAccount/ProfileMenu"));
const NotificationMenu = lazy(() => import("../../Navebare/Notifications/NotificationMenu"));
import { makeRequest } from "../../../utils";

const ProfileActions = () => {
  const { currentUser, openNotification, socet } = useAppSelector(
    (state) => state.stateManeger
  );
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<TypeNotifications[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const dispatch = useAppDispatch();

  // let notifySound = new Audio();
  // notifySound.src = notificationSound;

  const numUnReaded = notifications.filter(
    (element) => element.isRead === false
  ).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
      try {
        const response = await makeRequest.get("api/notifications");
        setNotifications(response.data);
      } catch (error) {
        dispatch(
          showPopup({ status: true, message: "Failed to Load Notifications" })
        );
      } finally {
        setLoadingNotifications(false);
      }
    };
    fetchNotifications();
  }, [currentUser]);

  const handleNewNotification = (notfication: TypeNotifications) => {
    console.log("trigger");
    setNotifications((prev) => [...prev, notfication]);
    // notifySound.play();
  };

  useEffect(() => {
    if (socet) {
      socet.on("new-notification", handleNewNotification);
      return () => {
        socet.off("new-notification", handleNewNotification);
      };
    }
  }, [socet]);

  return (
    <>
      {currentUser && (
        <div className="relative flex items-center gap-4 sm:gap-2 ">
          <div className=" flex items-center rounded-md  gap-2 xs:gap-1 ">
            <span
              onClick={() => {
                dispatch(
                  openModel({ status: true, children: <ApplyCoupon /> })
                );
              }}
              className="text-2xl sm:text-xl text-[#8fee37ee] font-bold flex items-center justify-center bg-[#0c0d16c5] sm:p-[8px] p-[10px] rounded-s-md"
            >
              +
            </span>
            <span className="bg-[#0c0d16c5] whitespace-nowrap sm:text-[10px] p-[14px] tracking-wider font-bold border-l text-[#beababde] rounded-e-md">
              <span className="text-[#3de21c] mr-[3px]">
                {currentUser.points}
              </span>
              points
            </span>
          </div>
          <div
            onClick={() => setOpenProfileMenu(!openProfileMenu)}
            className="bg-[#3a3e5877] flex gap-6 px-3 sm:px-[7px] sm:gap-[8px] items-center justify-center rounded-md sm:h-[40px] h-[50px] cursor-pointer z-[1]"
          >
            <div className="w-[40px] h-[35px] sm:w-[30px] sm:h-[25px]">
              <UserImage user={currentUser} />
            </div>
            <span className="text-[#c0c0ba] text-md sm:text-xs max-w-[120px] sm:max-w-[80px] sm:px-1 text-center whitespace-nowrap overflow-scroll scrollbar-none ">
              {currentUser.name}
            </span>
            <BsArrowDown className="sm:text-sm" />
          </div>
          <div
            onClick={() => {
              if (!openNotification) {
                dispatch(toggleNotifications(true));
              } else {
                dispatch(toggleNotifications(false));
              }
            }}
            className="flex items-center justify-center relative cursor-pointer sm:h-[38px] h-[45px] w-[45px] rounded-md bg-[#3a3e5877]"
          >
            {numUnReaded > 0 && (
              <span className="w-[18px] h-[18px] flex items-center justify-center absolute top-1 right-1 rounded-full bg-red-600 text-xs">
                {numUnReaded}
              </span>
            )}
            <IoMdNotifications className="cursor-pointer text-2xl" />
          </div>

          {openProfileMenu && (
            <ProfileMenu setOpenProfileMenu={setOpenProfileMenu} />
          )}
        </div>
      )}
      {openNotification && (
        <NotificationMenu
          loadingNotifications={loadingNotifications}
          notifications={notifications}
        />
      )}
    </>
  );
};

export default ProfileActions;
