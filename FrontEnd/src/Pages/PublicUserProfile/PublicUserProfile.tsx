import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { MdAutoAwesomeMosaic } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { BiTask } from "react-icons/bi";
import { BsFillClockFill } from "react-icons/bs";
import { fetchUserById, getUserActivities, userVisited } from "../../utils";
import { formateDate } from "../../utils/common";
import { useAppSelector } from "../../context/Hooks";
import { verifiedImage } from "../../assets";
import { PublicUserProfileSkeleton } from "./PublicUserProfileSkeleton";
import ActivitiesList from "./ActivitiesList";
import UserImage from "../../components/Shared/Common/UserImage";

const PublicUserProfile = () => {
  const currentUserId = useAppSelector((state) => state.stateManeger.currentUser?._id);
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  const { id } = useParams();

  const {
    data: user,
    status,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: id ? () => fetchUserById(id) : skipToken,
    staleTime: 10 * 60 * 1000,
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["user-activities", id],
    queryFn: id ? () => getUserActivities(id) : skipToken,
    staleTime: 10 * 60 * 1000,
  });

  const { mutate } = useMutation({
    mutationFn: userVisited,
  });

  const fitleredActivities = activities?.filter(
    (item) =>
      item.type === "BUY-FRAME" ||
      item.type === "MUSIC" ||
      item.type === "EMAIL-VERIFIED" ||
      item.type === "GUESS-CARD" ||
      item.type === "QUIZ-APP" ||
      item.type === "REFERRER",
  );

  const numberOfCompletedTasks = activities?.filter(
    (item) => item.type === "GUESS-CARD" || item.type === "QUIZ-APP" || "EMAIL-VERIFIED",
  ).length;

  const numberOfReferredUser = activities?.filter((item) => item.type === "REFERRER").length;

  useEffect(() => {
    if (currentUserStatus === "authenticated" && id && id !== currentUserId) {
      mutate(id);
    }
  }, [id, currentUserStatus, currentUserId, mutate]);

  if (status === "pending") {
    return <PublicUserProfileSkeleton />;
  }

  if (error) {
    return <div className="flex h-full w-full items-center justify-center text-red-400">an error occuur</div>;
  }

  if (id === currentUserId) {
    return <Navigate to={"/myprofile"} />;
  }

  if (!user) {
    return (
      <div className="flex h-full w-full items-center justify-center border text-gray-300">
        User Not Found
      </div>
    );
  }

  return (
    <div className="bg-transparent py-5 lg:pt-8">
      <div className="mx-auto w-[95%] space-y-5 lg:space-y-10">
        <h1 className="text-2xl font-bold text-[#86f38c]">Profile</h1>
        <div className="flex flex-col gap-x-[2%] gap-y-4 md:flex-row">
          <div className="flex items-center justify-evenly rounded-lg bg-[#191929] py-5 md:w-[49%]">
            <div className="h-[80px] w-[90px] md:h-[80px] md:w-[100px] lg:h-[90px] lg:w-[110px]">
              <UserImage user={user} />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-[#3cc543]">{user.name}</p>
              <div className="flex items-center gap-2 text-[#e7bbbb]">
                <span className="text-[#50fd39ee]">{user.points}</span> Points
              </div>
              {user?.emailVerified && (
                <div className="flex items-center gap-4">
                  <img src={verifiedImage} alt="" className="h-8 w-8 object-cover" />
                  <span className="text-gray-400">Verified</span>
                </div>
              )}
              <p className="text-sm text-[#b19e9eee]">Joined About {formateDate(user.createdAt)}</p>
            </div>
          </div>
          <div className="rounded-lg bg-[#191929] px-1 py-2 sm:px-3 md:w-[49%]">
            <h1 className="mb-3 text-xl font-bold text-[#32e47c]">Statistics</h1>
            <div className="grid grid-cols-2 gap-y-3 max-[359px]:grid-cols-1">
              <div className="flex items-center gap-x-1 sm:gap-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#be914cb7]">
                  <BiTask className="h-[70%] w-[70%]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-300">{numberOfCompletedTasks}</span>
                  <span className="text-xs text-[#b1b07f]">completed offers</span>
                </div>
              </div>
              <div className="flex items-center gap-x-1 sm:gap-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#be914cb7]">
                  <BsFillClockFill className="h-[70%] w-[70%]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-300">{user.points}</span>
                  <span className="text-xs text-[#b1b07f]">Earnings last 30 days</span>
                </div>
              </div>
              <div className="flex items-center gap-x-1 sm:gap-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#be914cb7]">
                  <MdAutoAwesomeMosaic className="h-[70%] w-[70%]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-300">{user.points}</span>
                  <span className="text-xs text-[#b1b07f]">Total Earnings</span>
                </div>
              </div>
              <div className="flex items-center gap-x-1 sm:gap-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#be914cb7]">
                  <FaUsers className="h-[70%] w-[70%]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-300">{numberOfReferredUser}</span>
                  <span className="text-xs text-[#b1b07f]">Users Referred</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {user && (
          <Link
            to={`/privatechat?chat-with=${user._id}`}
            className="block w-fit rounded-md bg-[#bbb55c] px-5 py-1 font-bold text-[#3a1f1f]"
          >
            Chat with {user.name}
          </Link>
        )}
        <h1 className="flex items-center gap-2 px-1 font-bold tracking-wide text-[#4de43a] md:text-lg">
          <GiProgression className="text-lg" /> Activities
        </h1>
        <div className="w-full">
          <div className="mb-2 flex h-[40px] items-center justify-between border-b p-1 text-sm lg:text-base">
            <span className="flex-1 font-bold text-gray-300">Offer</span>
            <span className="px-2 text-center font-bold text-gray-300 md:w-[10%]">Time</span>
            <span className="px-2 text-center font-bold text-gray-300 md:w-[10%]">Points</span>
          </div>
          <ActivitiesList activities={fitleredActivities} user={user} />
        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;
