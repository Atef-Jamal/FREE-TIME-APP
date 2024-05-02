import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { setCurrentUser, showPopup } from "../../context/StateManeger";
import { BiErrorAlt } from "react-icons/bi";
import { handleApiError, makeRequest } from "../../utils";
import Spinner from "../Others/Spinner";
import { avatar, empty } from "../../assets";
import { Link } from "react-router-dom";
import { timeAgoFromMongoDBDate } from "../../context/functions";

const WhoVisitProfile = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [usersVisitsMyProfile, setUsersVisitsMyProfile] = useState<
    { _id: string; createdAt: Date; profilPicture: string; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  const handleShowWhoVisit = async () => {
    if (!currentUser) return;
    setError("");
    setExpanded(true);
    setIsLoading(true);
    try {
      if (currentUser.points < 5) {
        dispatch(
          showPopup({
            status: true,
            type: "ERROR_GENERAL",
            message: handleApiError(error),
          })
        );
        setError("your poits is Not Enough");
        return;
      }
      const response = await makeRequest.get("/api/users/who-visit-me/me");
      const data = response.data;
      dispatch(setCurrentUser({ ...currentUser, points: data.points }));
      setUsersVisitsMyProfile(data.users);
    } catch (error) {
      setError(handleApiError(error));
      dispatch(
        showPopup({
          status: true,
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[70%] sm:w-full mx-auto mt-3 flex flex-col items-center justify-center gap-2 pb-3">
      <div className="flex items-center justify-around xs:justify-center xs:flex-col xs:gap-2 w-full border-b border-gray-600 py-2">
        <span className="font-bold tracking-wider text-[#8da4f0ee]">
          Who visit my profile ?
        </span>
        <button
          onClick={handleShowWhoVisit}
          className="px-5 py-1 rounded-md bg-[#63bd68]"
        >
          Show for 5 points
        </button>
      </div>
      <div
        className={`transition-all flex flex-col items-center gap-1 w-full ${
          expanded ? "h-auto" : "overflow-hidden h-0"
        }`}
      >
        {isLoading && <Spinner className="w-8 h-8 border-2" />}
        {error && (
          <div className="flex items-center justify-center py-2 gap-2 text-gray-500">
            <BiErrorAlt /> {error}
          </div>
        )}
        {!error &&
          usersVisitsMyProfile.length > 0 &&
          usersVisitsMyProfile.map((item, i) => (
            <div
              key={item._id + i}
              className="flex items-center justify-around  w-full "
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full">
                  <img
                    src={item.profilPicture || avatar}
                    alt=""
                    className="object-contain rounded-full"
                  />
                </div>
                <Link
                  to={`/user/${item._id}`}
                  className="text-sm text-[#8a84eb] underline"
                >
                  {item.name}
                </Link>
              </div>
              <span className="text-[#918080d5] text-sm">
                {timeAgoFromMongoDBDate(item.createdAt.toString())}
              </span>
            </div>
          ))}
        {!isLoading && !error && usersVisitsMyProfile.length === 0 && (
          <div className="w-full flex flex-col items-center gap-2 justify-center py-2">
            <img src={empty} alt="" className="w-14 h-14 object-contain" />
            <p className="text-sm text-[#685d5dd3]">
              No One View your Profile Until Now
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhoVisitProfile;
