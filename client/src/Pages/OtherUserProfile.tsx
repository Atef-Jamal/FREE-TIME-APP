import { Link, Navigate, useParams } from "react-router-dom";
import { MdAutoAwesomeMosaic } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { BiErrorAlt, BiTask } from "react-icons/bi";
import { BsFillClockFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import { useEffect, useState } from "react";
import { showPopup } from "../context/StateManeger";
import { handleApiError, makeRequest } from "../utils";
import UserImage from "../components/Others/UserImage";
import ActivitiesList from "../components/OtherUserProfile/ActivitiesList";
import { OtherUserProfileSkeleton } from "../components/OtherUserProfile/OtherUserProfileSkeleton";
import { TypeNotifications } from "../types/notification";
import { User } from "../types/user";

const OtherUserProfile = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [userActivities, setUserActivities] = useState<TypeNotifications[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const fitleredActivities = userActivities.filter(
    (item) =>
      item.type === "BUY-FRAME" ||
      item.type === "MUSIC" ||
      item.type === "EMAIL-VERIFIED" ||
      item.type === "GUESS-CARD" ||
      item.type === "QUIZ-APP" ||
      item.type === "REFERRER"
  );

  const numberOfCompletedTasks = userActivities.filter(
    (item) =>
      item.type === "GUESS-CARD" || item.type === "QUIZ-APP" || "EMAIL-VERIFIED"
  ).length;

  const numberOfReferredUser = userActivities.filter(
    (item) => item.type === "REFERRER"
  ).length;

  useEffect(() => {
    const fetchUser = async () => {
      if (!loading) setLoading(true);
      try {
        const response = await makeRequest.get(`api/users/${id}`);
        const activities = await makeRequest.get(`api/notifications/${id}`);
        setUser(response.data);
        setUserActivities(activities.data);
      } catch (error) {
        dispatch(
          showPopup({
            status: true,
            message: handleApiError(error),
            icon: <BiErrorAlt />,
          })
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const handleVisit = async () => {
      if (!currentUser || !id || loading) {
        return;
      }
      await makeRequest.patch(`/api/users/${id}/visited`, {
        NOT_IMPORTANT: "NOT_IMPORTANT",
      });
    };
    if (currentUser && id && !loading) {
      handleVisit();
    }
  }, [id, currentUser, loading]);

  if (loading) {
    return <OtherUserProfileSkeleton />;
  }
  if (id === currentUser?._id) {
    return <Navigate to={"/myprofile"} />;
  }

  return (
    <div className="bg-transparent flex items-center justify-center ">
      <div className="w-[80%] flex flex-col gap-4 pb-12 pt-6 lg:w-[95%]">
        <h1 className="text-2xl font-bold text-[#86f38c] ">Profile</h1>
        <div className="flex gap-8 items-center sm:flex-col">
          <div className=" flex items-center justify-between p-8 w-full bg-[#1d1d2e] rounded-lg h-[200px] ">
            <div className="w-[110px] h-[90px] sm:w-[90px] sm:h-[90px]">
              <UserImage user={user} />
            </div>
            <div className="flex flex-col justify-center gap-1 mt-2">
              <span className="text-xl font-bold text-[#3cc543]">
                {user?.name}
              </span>
              <div className="flex items-center gap-2 text-[#e7bbbb]">
                <span className="text-[#50fd39ee]">{user?.points}</span> Points
              </div>
              <p className="text-sm text-[#b19e9eee]">Joined About 2 Month</p>
            </div>
          </div>
          <div className="w-full bg-[#1d1d2e] rounded-lg h-[200px] sm:h-auto flex flex-col p-5 sm:px-2 sm:py-5 lg:p-3 gap-3">
            <h1 className="font-bold text-xl text-[#32e47c] ">Statistics</h1>
            <div className="flex flex-wrap justify-between mx-6 sm:mx-0 lg:mx-1 ">
              <div className="flex items-center gap-2 w-[49%] sm:w-[49%]">
                <div className="w-10 h-10 lg:w-9 lg:h-9 sm:w-8 sm:h-8  rounded-lg bg-[#be914cb7] flex items-center justify-center">
                  <BiTask className="w-8 h-8 lg:w-6 lg:h-6 sm:w-[20px] sm:h-[20px] " />
                </div>
                <div className="flex flex-col ">
                  <span className="font-bold text-gray-300">
                    {numberOfCompletedTasks}
                  </span>
                  <span className="text-sm sm:text-[11px] lg:text-xs text-[#b1b07f]">
                    completed offers
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-[49%] sm:w-[49%]">
                <div className="w-10 h-10 lg:w-9 lg:h-9 sm:w-8 sm:h-8 rounded-lg bg-[#be914cb7] flex items-center justify-center">
                  <BsFillClockFill className="w-8 h-8 lg:w-6 lg:h-6 sm:w-[20px] sm:h-[20px] " />
                </div>
                <div className="flex flex-col ">
                  <span className="font-bold text-gray-300">0</span>
                  <span className="text-sm sm:text-[11px] lg:text-xs text-[#b1b07f]">
                    Earnings last 30 days
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2  w-[49%] sm:w-[49%]  mt-4">
                <div className="w-10 h-10 lg:w-9 lg:h-9 sm:w-8 sm:h-8 rounded-lg bg-[#be914cb7] flex items-center justify-center">
                  <MdAutoAwesomeMosaic className="w-8 h-8 lg:w-6 lg:h-6 sm:w-[20px] sm:h-[20px] " />
                </div>
                <div className="flex flex-col  ">
                  <span className="font-bold text-gray-300">
                    {user?.points}
                  </span>
                  <span className="text-sm sm:text-[11px] lg:text-xs text-[#b1b07f]">
                    Total Earnings
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-[49%] sm:w-[49%] mt-4 ">
                <div className="w-10 h-10 lg:w-9 lg:h-9 sm:w-8 sm:h-8 rounded-lg bg-[#be914cb7] flex items-center justify-center">
                  <FaUsers className="w-8 h-8 lg:w-6 lg:h-6 sm:w-[20px] sm:h-[20px] " />
                </div>
                <div className="flex flex-col ">
                  <span className="font-bold text-gray-300">
                    {numberOfReferredUser}
                  </span>
                  <span className="text-sm sm:text-[11px] lg:text-xs text-[#b1b07f]">
                    Users Referred
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {user && (
          <div className="-4 py-1">
            <Link
              to={`/privatechat/${user._id}`}
              className="py-[6px] px-8 bg-[#bbb55c] text-[#3a1f1f] rounded-md font-bold"
            >
              Chat with {user?.name}
            </Link>
          </div>
        )}
        <h1 className="flex items-center gap-3 font-bold text-lg tracking-wide text-[#4de43a] px-1  mt-6">
          <GiProgression className="xs:text-sm text-lg" /> Activity
        </h1>
        <div className="w-full mb-2 ">
          <div className="flex items-center justify-between p-[6px] h-[40px] border-b mb-2">
            <span className=" text-gray-300  font-bold flex-1">Offer</span>
            <span className=" text-gray-300 text-center font-bold px-8 xs:px-2 xs:text-sm">
              Time
            </span>
            <span className=" text-gray-300 text-center font-bold px-8 xs:px-2 xs:text-sm">
              Points
            </span>
          </div>
          <ActivitiesList activities={fitleredActivities} user={user} />
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
