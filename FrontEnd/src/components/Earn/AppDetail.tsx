import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { TypeTaskApp } from "../../types/earnTypes";
import { IoIosStarOutline, IoMdStar } from "react-icons/io";
import { Link, useSearchParams } from "react-router-dom";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { empty } from "../../assets";
import { BsArrowDownCircle } from "react-icons/bs";
import { makeRequest } from "../../utils";
import Empty from "../Others/Empty";
import { showPopup } from "../../context/StateManeger";
import { handleApiError } from "../../utils/common";
import AppDetailsSkeleton from "./AppDetailsSkeleton";
import { User } from "../../types/userTypes";
import { useTranslation } from "react-i18next";

interface TypeReview {
  _id: string;
  appId: string;
  user: User;
  comment: string;
}

const AppDetail = ({ appId }: { appId: string }) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [appDetail, setAppDetail] = useState<TypeTaskApp | null>(null);
  const [expandUsers, setExpandUsers] = useState(false);
  const [openReviews, setOpenReviews] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<TypeReview[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("earn");
  const dispatch = useAppDispatch();

  let isCompleted;
  let notActiveStars;

  if (appDetail) {
    isCompleted = currentUser?.completedTasks.includes(appDetail?._id);
    notActiveStars = 5 - appDetail.rating;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() === "" || !appId) return;
    try {
      const response = await makeRequest.post(`/api/tasks/${appId}/review`, {
        comment,
      });

      setReviews((prev) => [...prev, response.data]);
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchAppDetails = async () => {
      if (!appId) return;
      try {
        setLoading(true);
        const response = await makeRequest.get(`api/tasks/public/${appId}`);
        setAppDetail(response.data);
        setReviews(response.data.reviews);
      } catch (error) {
        console.log(error);
        dispatch(
          showPopup({ message: handleApiError(error), type: "ERROR_GENERAL" })
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAppDetails();
  }, [appId, dispatch]);

  useEffect(() => {
    const searchQuery = searchParams.get("to");
    return () => {
      if (searchQuery) {
        setSearchParams((prev) => {
          prev.delete("to");
          return prev;
        });
      }
    };
  }, [searchParams, setSearchParams]);

  if (loading) return <AppDetailsSkeleton />;

  if (!appDetail) return <></>;

  if (appDetail)
    return (
      <>
        <h1 className="text-2xl font-bold text-[#78bd4f] mb-3">
          {t("Offer Details")}
        </h1>
        <img
          alt=""
          src={appDetail.image.replace(
            "http://localhost:3000",
            import.meta.env.VITE_SERVER_BASE_URL
          )}
          className="w-full h-[300px] object-cover mb-3"
        />

        <div className="w-full flex flex-col items-center justify-center gap-3 sm:gap-1">
          <span className="w-full text-[#537692] text-sm">
            <span className="mr-2 text-[#aebeb5] text-base">{t("Name")} :</span>{" "}
            {appDetail?.title}
          </span>
          <span className="w-full text-[#537692] text-sm">
            <span className="mr-2 text-[#aebeb5] text-base">
              {t("Description")} :
            </span>
            {appDetail?.description}
          </span>
          <span className="w-full text-[#537692] text-sm">
            <span className="mr-2 text-[#aebeb5] text-base">
              {t("available on")} :
            </span>
            {appDetail?.devices === "ALL" ? "ALL DEVICES" : appDetail.devices}
          </span>
          <div
            onClick={() => setExpandUsers((prev) => !prev)}
            className="w-full bg-[#333030] rounded-md flex item-center justify-between p-2 my-2"
          >
            <span className="text-[#73f1a8]">
              {t("People who completed this app")}
            </span>
            <FaRegArrowAltCircleDown className="opacity-50 text-xl" />
          </div>
          <div
            className={`w-full transition-all flex flex-col gap-1  ${
              expandUsers ? "p-1" : "overflow-hidden h-0 p-0"
            }`}
          >
            {appDetail.completedBy.length === 0 && (
              <span className="text-gray-400 text-sm w-full flex items-center justify-center gap-2">
                <img src={empty} alt="" className="w-5 h-5 object-cover" />
                {t("No one complete this app before")}
              </span>
            )}
            {appDetail.completedBy.length > 0 &&
              appDetail.completedBy.map((item) => (
                <Link
                  key={item._id}
                  to={`/user/${item._id}`}
                  className="text-gray-400 text-sm block underline "
                >
                  {item.name}
                </Link>
              ))}
          </div>
          <span className="flex items-center gap-3 w-full text-[#aebeb5]">
            {t("Rating")} :
            <span className="flex items-center justify-center gap-1">
              {[...Array(appDetail.rating).keys()].map((item) => (
                <IoMdStar key={item} />
              ))}
              {[...Array(notActiveStars).keys()].map((item) => (
                <IoIosStarOutline key={item} />
              ))}
            </span>
          </span>
          <span
            onClick={() => setOpenReviews((prev) => !prev)}
            className="w-full flex items-center justify-between bg-[#333030] p-2 rounded-md my-2"
          >
            <span className="text-[#cec8c8]">{t("Reviews")}</span>
            <BsArrowDownCircle className="text-xl opacity-50" />
          </span>
          <div
            className={`w-full h-0 overflow-hidden ${
              openReviews && "h-auto"
            } flex flex-col items-center"
          `}
          >
            {reviews?.map((review) => {
              return (
                <div
                  key={review._id}
                  className="w-full flex flex-col items-center gap-2 border-b border-gray-500 pb-1 mb-1"
                >
                  <div className="w-full flex items-center gap-2">
                    <img
                      src={review.user.profilePicture}
                      alt=""
                      className="w-8 h-8 sm:w-6 sm:h-6 rounded-full object-fill"
                    />
                    <span className="text-sm text-[#d1cfcf]">
                      {review.user.name}
                    </span>
                  </div>
                  <p className="w-full text-sm sm:text-xs text-[#9d79ff]">
                    {review.comment}
                  </p>
                </div>
              );
            })}
            {reviews?.length === 0 && (
              <Empty
                emptyText={t("There is not Reviews on this offer")}
                imgWidthHeight="w-8 h-8"
              />
            )}
            <form onSubmit={handleSubmit} className="w-full">
              <input
                placeholder="Write your opinion"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full outline-none placeholder:text-gray-500 border-gray-700 text-sm bg-[#171227fd] p-3 rounded-md"
              />
              <button className="w-full text-center rounded-md py-2 bg-[#6f9c5a] mt-2">
                Send
              </button>
            </form>
          </div>
          <span className="text-[#aebeb5] flex items-center gap-3 w-full mb-2">
            {t("Reward")} :
            <span className="text-[#6676ff] text-sm">
              {appDetail.prize} {t("Points")}
            </span>
          </span>
          {isCompleted && (
            <button
              className={`w-full py-2 sm:text-xs bg-[#171430d5] text-sm text-white rounded-md border border-gray-700`}
            >
              Completed
            </button>
          )}
          {!isCompleted && appDetail.isAvailable === "AVAILABLE" && (
            <Link
              to={`/playing/${appDetail._id}`}
              className={`bg-[#a4ec52cc] w-full py-2  sm:text-xs text-sm font-bold rounded-md text-center`}
            >
              {t("START NOW")}
            </Link>
          )}
          {appDetail.isAvailable === "UNAVAILABLE" && (
            <button
              className={`bg-[#528feccc] w-full py-2  sm:text-xs text-sm font-bold rounded-md text-center`}
            >
              {t("Not Available")}
            </button>
          )}
        </div>
      </>
    );
};

export default AppDetail;
