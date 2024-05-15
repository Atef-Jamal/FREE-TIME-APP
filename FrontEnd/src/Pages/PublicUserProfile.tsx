import { Link, Navigate, useParams } from "react-router-dom";
import { MdAutoAwesomeMosaic } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { BiTask } from "react-icons/bi";
import { BsFillClockFill } from "react-icons/bs";
import { useAppSelector } from "../context/Hooks";
import { useEffect } from "react";
import { makeRequest } from "../utils";
import UserImage from "../components/Others/UserImage";
import ActivitiesList from "../components/PublicUserProfile/ActivitiesList";
import { PublicUserProfileSkeleton } from "../components/PublicUserProfile/PublicUserProfileSkeleton";

import { useFetchActivities, useFetchUser, useListenToEvent } from "../hooks";
import { User } from "../types/user";
import { verifiedImage } from "../assets";
import { formateDate } from "../utils/common";

const PublicUserProfile = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const { id } = useParams();

  const { user, setUser, loading, error } = useFetchUser({
    userId: id,
    initialLoading: true,
    dependencies: [id],
  });

  const { activities } = useFetchActivities({
    userId: id,
    initialLoading: true,
    dependencies: [id],
  });

  useListenToEvent<User>({
    eventToListen: "user-updated",
    onUpdate: (updatedUser) => {
      if (updatedUser._id === id) {
        setUser(updatedUser);
      }
    },
    dependencies: [id],
  });

  const fitleredActivities = activities.filter(
    (item) =>
      item.type === "BUY-FRAME" ||
      item.type === "MUSIC" ||
      item.type === "EMAIL-VERIFIED" ||
      item.type === "GUESS-CARD" ||
      item.type === "QUIZ-APP" ||
      item.type === "REFERRER"
  );

  const numberOfCompletedTasks = activities.filter(
    (item) =>
      item.type === "GUESS-CARD" || item.type === "QUIZ-APP" || "EMAIL-VERIFIED"
  ).length;

  const numberOfReferredUser = activities.filter(
    (item) => item.type === "REFERRER"
  ).length;

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

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (loading) {
    return <PublicUserProfileSkeleton />;
  }

  if (id === currentUser?._id) {
    return <Navigate to={"/myprofile"} />;
  }

  if (!user) {
    return (
      <div className="border w-full h-full text-center">an error occurred</div>
    );
  }

  return (
    <div className="bg-transparent flex items-center justify-center ">
      <div className="w-[80%] flex flex-col gap-4 pb-12 pt-6 lg:w-[95%]">
        <h1 className="text-2xl font-bold text-[#86f38c] ">Profile</h1>
        <div className="flex gap-4 items-center sm:flex-col">
          <div className=" flex items-center justify-evenly w-full bg-[#1d1d2e] rounded-lg h-[200px]">
            <div className="w-[110px] h-[90px] lg:w-[100px] lg:h-[80px] sm:w-[90px] sm:h-[80px]">
              <UserImage user={user} />
            </div>
            <div className="flex flex-col justify-center gap-1 mt-2">
              <span className="text-xl font-bold text-[#3cc543]">
                {user.name}
              </span>
              <div className="flex items-center gap-2 text-[#e7bbbb]">
                <span className="text-[#50fd39ee]">{user.points}</span> Points
              </div>
              {user?.emailVerified && (
                <div className="flex items-center gap-4">
                  <img
                    src={verifiedImage}
                    alt=""
                    className="w-8 h-8 object-cover"
                  />
                  <span className="text-gray-400">Verified</span>
                </div>
              )}
              <p className="text-sm text-[#b19e9eee]">
                Joined About {formateDate(user.createdAt.toString())}
              </p>
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
                  <span className="font-bold text-gray-300">
                    {" "}
                    {user.points}
                  </span>
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
                  <span className="font-bold text-gray-300">{user.points}</span>
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
              Chat with {user.name}
            </Link>
          </div>
        )}
        <h1 className="flex items-center gap-2 font-bold text-lg tracking-wide text-[#4de43a] px-1 mt-6">
          <GiProgression className="xs:text-sm text-lg" /> Activities
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

export default PublicUserProfile;
