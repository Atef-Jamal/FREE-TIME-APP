import { Navigate, useParams } from "react-router-dom";
import { empty } from "../assets";
import { MdAutoAwesomeMosaic } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { BiTask } from "react-icons/bi";
import { AiFillGift } from "react-icons/ai";
import { FcMusic } from "react-icons/fc";
import { BsExclamationCircle, BsFillClockFill } from "react-icons/bs";
import { User, TypeNotifications } from "../types";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import { Skeleton, UserImage } from "../components";
import { useEffect, useState } from "react";
import EachActivity from "../components/Others/EachActivity";
import verifiedIcon from "../assets/verified-icon.png";
import { FcFrame } from "react-icons/fc";
import { FcBusinessman } from "react-icons/fc";
import { showPopup } from "../context/StateManeger";
import { makeRequest } from "../utils";

const OtherUserProfile = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [userActivities, setUserActivities] = useState<TypeNotifications[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      if (!loading) setLoading(true);
      try {
        const response = await makeRequest.get(`api/users/${id}`);
        const activities = await makeRequest.get(`api/notifications/${id}`);
        setUser(response.data);
        setUserActivities(activities.data);
      } catch (error) {
        console.log(error);
        dispatch(
          showPopup({
            status: true,
            message: "somthing went wrong",
            icon: <BsExclamationCircle />,
          })
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

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

  return id === currentUser?._id ? (
    <Navigate to={"/myprofile"} />
  ) : (
    <>
      {loading ? (
        <div className="mx-8 sm:mx-3 flex flex-col items-center gap-9 p-2">
          <Skeleton className="w-44 h-8 mr-auto mt-8" />
          <hr className="w-full" />
          <div className="flex items-center gap-4 w-full">
            <div className=" py-6 px-16 w-full flex items-center justify-between bg-[#1f182bb4] rounded-lg">
              <Skeleton className="w-[100px] h-[100px] rounded-full " />
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="w-60 h-4" />
                <Skeleton className="w-60 h-4" />
                <Skeleton className="w-60 h-4" />
              </div>
            </div>
            <div className=" py-4 px-16 w-full flex flex-col items-center gap-3 bg-[#1f182bb4] rounded-lg">
              <Skeleton className="w-44 h-6 " />
              <div className="flex w-full items-center justify-between px-9">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="w-[200px] h-8 " />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="w-[200px] h-8 " />
                </div>
              </div>
              <div className="flex w-full items-center justify-between px-9">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="w-[200px] h-8 " />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="w-[200px] h-8 " />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-8 w-full">
            <Skeleton className="w-44 h-5" />
            <div className="flex flex-col items-center gap-5 w-full">
              <Skeleton className="w-full h-9" />
              <Skeleton className="w-full h-9" />
              <Skeleton className="w-full h-9" />
              <Skeleton className="w-full h-9" />
              <Skeleton className="w-full h-9" />
              <Skeleton className="w-full h-9" />
              <Skeleton className="w-full h-9" />
              <Skeleton className="w-full h-9" />
            </div>
          </div>
        </div>
      ) : (
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
                    <span className="text-[#50fd39ee]">{user?.points}</span>{" "}
                    Points
                  </div>
                  <p className="text-sm text-[#b19e9eee]">
                    Joined About 2 Month
                  </p>
                </div>
              </div>
              <div className="w-full bg-[#1d1d2e] rounded-lg h-[200px] sm:h-auto flex flex-col p-5 sm:px-2 sm:py-5 lg:p-3 gap-3">
                <h1 className="font-bold text-xl text-[#32e47c] ">
                  Statistics
                </h1>
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
            <h1 className="flex items-center justify-center gap-3 font-bold text-lg tracking-wide text-[#4de43a] px-1  mt-6">
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
              <div className="flex flex-col gap-2">
                {fitleredActivities.map((item, index) => {
                  if (item.type === "REFERRER")
                    return (
                      <EachActivity
                        key={item._id}
                        index={index}
                        icon={<FcBusinessman className="text-xl" />}
                        time={item.createdAt}
                        message={`${user?.name} successfully Referred his friend ${item.referredUser.name}`}
                        prize={item.prize}
                      />
                    );
                  if (item.type === "QUIZ-APP")
                    return (
                      <EachActivity
                        key={item._id}
                        index={index}
                        icon={<AiFillGift className="text-xl" />}
                        time={item.createdAt}
                        message="Quiz app completed"
                        prize={item.prize}
                      />
                    );
                  if (item.type === "BUY-FRAME")
                    return (
                      <EachActivity
                        key={item._id}
                        index={index}
                        icon={<FcFrame className="text-xl" />}
                        time={item.createdAt}
                        message={`Buyed ${item.frame.title}`}
                        price={item.frame.price}
                      />
                    );
                  if (item.type === "GUESS-CARD")
                    return (
                      <EachActivity
                        key={item._id}
                        index={index}
                        icon={<AiFillGift className="text-xl" />}
                        time={item.createdAt}
                        message={"Guess Card Game Completed "}
                        prize={item.prize}
                      />
                    );
                  if (item.type === "EMAIL-VERIFIED")
                    return (
                      <EachActivity
                        key={item._id}
                        index={index}
                        icon={
                          <img src={verifiedIcon} alt="" className="w-5 h-5" />
                        }
                        time={item.createdAt}
                        message="Verified His Email successfully"
                        prize={item.prize}
                      />
                    );
                  if (item.type === "MUSIC")
                    return (
                      <EachActivity
                        key={item._id}
                        index={index}
                        icon={<FcMusic className="text-xl" />}
                        time={item.createdAt}
                        message={`Music ${item.musicTitle} Buyed Now`}
                        prize={item.price}
                      />
                    );
                })}
                {fitleredActivities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 p-2">
                    <img alt={""} src={empty} />
                    <span className="text-gray-400 tracking-wider font-bold sm:text-sm ">
                      Empty
                    </span>
                    <span className="text-gray-400 tracking-wider sm:text-sm ">
                      {`${
                        user?.name || "this person"
                      } Has No Activity Right Now`}
                    </span>
                  </div>
                ) : undefined}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OtherUserProfile;
