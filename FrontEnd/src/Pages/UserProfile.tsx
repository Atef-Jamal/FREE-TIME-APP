import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MdAutoAwesomeMosaic } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { BiTask } from "react-icons/bi";
import { BsFillClockFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../context/hooks";
import { verifiedImage } from "../assets";
import UserProfileSkeleton from "../features/user-profile/components/UserProfileSkeleton";
import UserImage from "../components/Shared/UserImage";
import { selectUserAuth, updateActiveChatId } from "../context/appStateSlice";
import RelativeCountdown from "../components/Shared/TimeCountDown";
import ActivitiesList from "../features/user-profile/components/ActivitiesList";
import { useFetchUserActivities } from "../features/user-profile/hooks";
import { useFetchUser } from "../features/user/hooks";
import { userViewed } from "../features/user-profile/services";

const UserProfile = () => {
  const currentUserId = useAppSelector((state) => state.appState.currentUser?._id);
  const userAuth = useAppSelector(selectUserAuth);
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { data: user, status, error } = useFetchUser({ userId: id });

  const { data: activities = [] } = useFetchUserActivities({ userId: id });

  const fitleredActivities = activities?.filter(
    (item) =>
      item.type === "BUY-FRAME" ||
      item.type === "MUSIC" ||
      item.type === "EMAIL-VERIFIED" ||
      item.type === "GUESS-CARD" ||
      item.type === "QUIZ-APP" ||
      item.type === "REFERRER",
  );

  const numberOfcompletedOffers = activities?.filter(
    (item) => item.type === "GUESS-CARD" || item.type === "QUIZ-APP" || "EMAIL-VERIFIED",
  ).length;

  const numberOfReferredUser = activities?.filter((item) => item.type === "REFERRER").length;

  useEffect(() => {
    const profileView = async () => {
      if (userAuth === "authenticated" && id !== currentUserId && id) {
        await userViewed(id);
      }
    };
    profileView();
  }, [id, userAuth, currentUserId]);

  if (status === "pending") {
    return <UserProfileSkeleton />;
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
              <div className="flex items-center gap-2">
                <p className="text-sm text-[#b19e9eee]">Joined About </p>
                <RelativeCountdown targetIsoString={user.createdAt} />
              </div>
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
                  <span className="text-sm font-bold text-gray-300">{numberOfcompletedOffers}</span>
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
            to={"/privatechat"}
            onClick={() => {
              dispatch(updateActiveChatId(user._id));
            }}
            className="block w-fit rounded-md bg-[#bbb55c] px-5 py-1 text-sm font-bold text-[#3f2828]"
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

export default UserProfile;
