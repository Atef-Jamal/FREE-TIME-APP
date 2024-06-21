import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { setCurrentUser, showPopup } from "../../context/StateManeger";
import { BiErrorAlt } from "react-icons/bi";
import { makeRequest } from "../../utils";
import Spinner from "../Others/Spinner";
import { Link } from "react-router-dom";
import { formateDate, handleApiError } from "../../utils/common";
import Empty from "../Others/Empty";
import { User } from "../../types/userTypes";

interface TypeVisiter {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  visiter: User;
  visited: string;
}

const WhoVisitProfile = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [usersVisitsMyProfile, setUsersVisitsMyProfile] = useState<
    TypeVisiter[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  const handleShowWhoVisit = async () => {
    if (!currentUser) return;
    setExpanded(true);

    if (currentUser.points < 5) {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: "sorry, your points is not Enough",
        })
      );
      setError("sorry, your points is not Enough");
      return;
    }
    setIsLoading(true);
    try {
      const response = await makeRequest.get("/api/users/who-visit-me/me");
      const data = response.data;
      dispatch(setCurrentUser({ ...currentUser, points: data.points }));
      setUsersVisitsMyProfile(data.users);
    } catch (error) {
      setError(handleApiError(error));
      dispatch(
        showPopup({
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
      <div className="flex items-center gap-y-3 justify-around flex-wrap w-full py-2">
        <span className="font-bold tracking-wider text-[#8da4f0ee]">
          Who visit my profile ?
        </span>
        <button
          onClick={handleShowWhoVisit}
          className="px-5 py-1 rounded-md bg-[#5aa55e]"
        >
          Show for 5 points
        </button>
      </div>
      <div
        className={`transition-all flex flex-col items-center gap-y-1 w-full ${
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
          usersVisitsMyProfile
            .map((item, i) => (
              <div
                key={item._id + i}
                className="w-[70%] xs:w-full flex items-center self-center justify-between"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full">
                    <img
                      src={`${import.meta.env.VITE_SERVER_BASE_URL}/${
                        item.visiter.profilePicture
                      }`}
                      alt=""
                      className="object-contain rounded-full"
                    />
                  </div>
                  <Link
                    to={`/user/${item._id}`}
                    className="text-sm text-[#8a84eb] underline"
                  >
                    {item.visiter.name}
                  </Link>
                </div>
                <span className="text-[#b38b8b] sm:text-sm">
                  {formateDate(item.createdAt)}
                </span>
              </div>
            ))
            .reverse()}
        {!isLoading && !error && usersVisitsMyProfile.length === 0 && (
          <Empty emptyText="No One View your profile until Now" />
        )}
      </div>
    </div>
  );
};

export default WhoVisitProfile;
