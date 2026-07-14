import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../context/hooks";
import { setCurrentUser, openToast, selectCurrentUser } from "../../../context/appStateSlice";
import { cn, handleApiError } from "../../../utils";
import Spinner from "../../../components/Shared/Spinner";
import Empty from "../../../components/Shared/Empty";
import RelativeCountdown from "../../../components/Shared/TimeCountDown";
import { getProfileViews } from "../services";
import { IProfileView } from "../../user/types";

const WhoViewProfile = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [usersVisitsMyProfile, setUsersVisitsMyProfile] = useState<IProfileView[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleShowWhoVisit = async () => {
    if (!currentUser) return;
    setExpanded(true);
    if (currentUser.points < 5) {
      dispatch(openToast({ type: "ERROR_GENERAL", message: "sorry, your points is not Enough" }));
      return;
    }
    setIsLoading(true);
    try {
      const data = await getProfileViews();
      dispatch(setCurrentUser({ ...currentUser, points: data.points }));
      setUsersVisitsMyProfile(data.viewers);
    } catch (error) {
      dispatch(openToast({ type: "ERROR_GENERAL", message: handleApiError(error) }));
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
        className={cn(
          "flex w-full flex-col items-center gap-y-1 transition-all",
          expanded ? "h-auto" : "h-0 overflow-hidden",
        )}
      >
        {isLoading && <Spinner className="h-8 w-8" />}
        {usersVisitsMyProfile.length > 0 &&
          usersVisitsMyProfile
            .map((item, i) => (
              <div
                key={item._id + i}
                className="flex w-full items-center justify-between self-center md:w-[70%]"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="h-8 w-8 rounded-full">
                    <img src={item.viewer.profilePicture} alt="" className="rounded-full object-contain" />
                  </div>
                  <Link to={`/user/${item.viewer._id}`} className="text-sm text-[#8a84eb] underline">
                    {item.viewer.name}
                  </Link>
                </div>
                <RelativeCountdown targetIsoString={item.createdAt} />
              </div>
            ))
            .reverse()}
        {!isLoading && usersVisitsMyProfile.length === 0 && (
          <Empty text="no one visit your profile until now" />
        )}
      </div>
    </div>
  );
};

export default WhoViewProfile;
