import { useEffect, useState } from "react";
import { BsExclamationOctagonFill } from "react-icons/bs";
import { BsArrowDown, BsFillPersonFill } from "react-icons/bs";
import { TfiKey } from "react-icons/tfi";
import {
  toggleSigningMode,
  toggleRegisterForm,
  toggleNotifications,
  setCurrentUser,
  showPopup,
  setCurrentUserIsLoading,
  openModel,
} from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import ProfileSkeleton from "../Others/ProfileSkeleton";
import { UserImage, ProfileMenu, NotificationMenu } from "../../components";
import { IoMdNotifications } from "react-icons/io";
import { TypeNotifications } from "../../types";
import axios from "axios";
import ApplyCoupon from "../Others/ApplyCoupon";
import notificationSound from "../../assets/notificationSound.wav";

const UserAccountActions = () => {
  const { currentUser, currentUserIsLoading, openNotification, token, socet } =
    useAppSelector((state) => state.stateManeger);
  const [initial, setInitial] = useState(true);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<TypeNotifications[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const dispatch = useAppDispatch();

  let notifySound = new Audio();
  notifySound.src = notificationSound;

  const numUnReaded = notifications.filter(
    (element) => element.isRead === false
  ).length;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        if (token) {
          dispatch(setCurrentUserIsLoading(true));
          const response = await axios.get(
            `http://localhost:3000/api/auth/currentuser`,
            { headers }
          );
          dispatch(setCurrentUser(response.data));
          dispatch(setCurrentUserIsLoading(false));
        }
      } catch (error) {
        dispatch(setCurrentUserIsLoading(false));
        dispatch(
          showPopup({
            status: true,
            message: `something went wrong! Check your Network and try again`,
            icon: <BsExclamationOctagonFill />,
          })
        );
        console.log(error);
      } finally {
        setTimeout(() => {
          setInitial(false);
        }, 1500);
      }
    };
    getCurrentUser();
  }, [token]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (currentUser) {
          const response = await axios.get(
            "http://localhost:3000/api/notifications",
            { headers }
          );
          setNotifications(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          setLoadingNotifications(false);
        }, 3000);
      }
    };
    fetchNotifications();
  }, [currentUser]);

  const handleNewNotification = (notfication: TypeNotifications) => {
    setNotifications((prev) => [...prev, notfication]);
    notifySound.play();
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
      {!currentUserIsLoading && !currentUser && !initial && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              dispatch(toggleRegisterForm(false));
              dispatch(toggleSigningMode(true));
            }}
            className=" flex items-center gap-3 sm:gap-2 px-5 h-[50px] lg:h-[40px] rounded-md text-white bg-[#3b3b7eef] sm:tracking-wide sm:font-bold sm:py-1 sm:px-2 sm:h-[35px] sm:text-[10px] border border-gray-500"
          >
            <BsFillPersonFill className="text-sm" />
            Sign In
          </button>
          <button
            onClick={() => {
              dispatch(toggleRegisterForm(false));
              dispatch(toggleSigningMode(false));
            }}
            className="flex items-center gap-3 px-5 h-[50px] rounded-md text-white border border-gray-500 bg-[#e7ac5e] sm:h-[35px] sm:rounded-md sm:gap-2 lg:h-[40px] sm:font-bold sm:py-1 sm:px-2 sm:text-[10px]"
          >
            <TfiKey className="text-sm" />
            Sign Up
          </button>
        </div>
      )}
      {currentUserIsLoading && <ProfileSkeleton />}
      {currentUser && (
        //bg-[#0c0d16c5]
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
            <ProfileMenu
              openProfileMenu={openProfileMenu}
              setOpenProfileMenu={setOpenProfileMenu}
            />
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

export default UserAccountActions;
