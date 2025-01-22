import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { setCurrentUser, showPopup } from "../../context/StateManeger";
import { BiErrorAlt } from "react-icons/bi";
import { makeRequest } from "../../utils";
import Spinner from "../Others/Spinner";
import { Link } from "react-router-dom";
import { formateDate, handleApiError } from "../../utils/common";
import Empty from "../Others/Empty";
import { IVisitor } from "../../types/userTypes";

const WhoVisitProfile = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [usersVisitsMyProfile, setUsersVisitsMyProfile] = useState<IVisitor[]>([]);
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
        }),
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
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mx-auto mt-3 flex w-[70%] flex-col items-center justify-center gap-2 pb-3 sm:w-full">
      <div className="flex w-full flex-wrap items-center justify-around gap-y-3 py-2">
        <span className="font-bold tracking-wider text-[#8da4f0ee]">Who visit my profile ?</span>
        <button onClick={handleShowWhoVisit} className="rounded-md bg-[#5aa55e] px-5 py-1">
          Show for 5 points
        </button>
      </div>
      <div
        className={`flex w-full flex-col items-center gap-y-1 transition-all ${
          expanded ? "h-auto" : "h-0 overflow-hidden"
        }`}
      >
        {isLoading && <Spinner className="h-8 w-8 border-2" />}
        {error && (
          <div className="flex items-center justify-center gap-2 py-2 text-gray-500">
            <BiErrorAlt /> {error}
          </div>
        )}
        {!error &&
          usersVisitsMyProfile.length > 0 &&
          usersVisitsMyProfile
            .map((item, i) => (
              <div
                key={item._id + i}
                className="xs:w-full flex w-[70%] items-center justify-between self-center"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="h-8 w-8 rounded-full">
                    <img src={item.visitor.profilePicture} alt="" className="rounded-full object-contain" />
                  </div>
                  <Link to={`/user/${item._id}`} className="text-sm text-[#8a84eb] underline">
                    {item.visitor.name}
                  </Link>
                </div>
                <span className="text-[#b38b8b] sm:text-sm">{formateDate(item.createdAt)}</span>
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
