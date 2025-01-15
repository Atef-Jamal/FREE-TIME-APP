import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { IoIosStarOutline, IoMdStar } from "react-icons/io";
import { Link, useSearchParams } from "react-router-dom";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { empty } from "../../assets";
import { BsArrowDownCircle } from "react-icons/bs";
import { fetchAppDetails, handleAddReview } from "../../utils";
import Empty from "../Others/Empty";
import AppDetailsSkeleton from "./TaskDetailsSkeleton";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showPopup } from "../../context/StateManeger";
import { handleApiError } from "../../utils/common";

interface TypeProps {
  taskId: string;
}

const TaskDetail = ({ taskId }: TypeProps) => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const [expandUsers, setExpandUsers] = useState(false);
  const [openReviews, setOpenReviews] = useState(false);
  const [comment, setComment] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("earn");
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  let isCompleted;
  let notActiveStars;

  const {
    data: taskDetails,
    status,
    error,
  } = useQuery({
    queryKey: ["earn", taskId],
    queryFn: () => fetchAppDetails({ taskId }),
    staleTime: 60 * 60 * 1000,
  });

  if (taskDetails) {
    isCompleted = currentUser?.completedTasks.includes(taskDetails?._id);
    notActiveStars = 5 - taskDetails.rating;
  }

  const mutation = useMutation({
    mutationFn: handleAddReview,
    onError: (error) => {
      dispatch(showPopup({ message: handleApiError(error), type: "ERROR_GENERAL" }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["earn", taskId] });
      setComment("");
    },
  });

  const addReviewHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (comment.trim() === "") {
      dispatch(showPopup({ message: handleApiError(error), type: "ERROR_GENERAL" }));
      return;
    }
    mutation.mutate({ taskId, comment });
  };

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

  if (status === "pending") return <AppDetailsSkeleton />;

  if (error) return <p>{error.response?.data.error}</p>;

  return (
    <>
      <h1 className="mb-3 text-2xl font-bold text-[#78bd4f]">{t("Offer Details")}</h1>
      <img
        alt=""
        src={`${import.meta.env.VITE_SERVER_BASE_URL}/${taskDetails.image}`}
        className="mb-3 h-[300px] w-full object-cover"
      />

      <div className="flex w-full flex-col items-center justify-center gap-1 md:gap-3">
        <span className="w-full text-sm text-[#537692]">
          <span className="mr-2 text-base text-[#aebeb5]">{t("Name")} :</span> {taskDetails?.title}
        </span>
        <span className="w-full text-sm text-[#537692]">
          <span className="mr-2 text-base text-[#aebeb5]">{t("Description")} :</span>
          {taskDetails?.description}
        </span>
        <span className="w-full text-sm text-[#537692]">
          <span className="mr-2 text-base text-[#aebeb5]">{t("available on")} :</span>
          {taskDetails?.devices === "ALL" ? "ALL DEVICES" : taskDetails.devices}
        </span>
        <div
          onClick={() => setExpandUsers((prev) => !prev)}
          className="item-center my-2 flex w-full justify-between rounded-md bg-[#333030] p-2"
        >
          <span className="text-[#73f1a8]">{t("People who completed this app")}</span>
          <FaRegArrowAltCircleDown className="text-xl opacity-50" />
        </div>
        <div
          className={`flex w-full flex-col gap-1 transition-all ${
            expandUsers ? "p-1" : "h-0 overflow-hidden p-0"
          }`}
        >
          {taskDetails.completedBy.length === 0 && (
            <span className="flex w-full items-center justify-center gap-2 text-sm text-gray-400">
              <img src={empty} alt="" className="h-5 w-5 object-cover" />
              {t("No one complete this app before")}
            </span>
          )}
          {taskDetails.completedBy.length > 0 &&
            taskDetails.completedBy.map((item) => (
              <Link key={item._id} to={`/user/${item._id}`} className="block text-sm text-gray-400 underline">
                {item.name}
              </Link>
            ))}
        </div>
        <span className="flex w-full items-center gap-3 text-[#aebeb5]">
          {t("Rating")} :
          <span className="flex items-center justify-center gap-1">
            {[...Array(taskDetails.rating).keys()].map((item) => (
              <IoMdStar key={item} />
            ))}
            {[...Array(notActiveStars).keys()].map((item) => (
              <IoIosStarOutline key={item} />
            ))}
          </span>
        </span>
        <span
          onClick={() => setOpenReviews((prev) => !prev)}
          className="my-2 flex w-full items-center justify-between rounded-md bg-[#333030] p-2"
        >
          <span className="text-[#cec8c8]">{t("Reviews")}</span>
          <BsArrowDownCircle className="text-xl opacity-50" />
        </span>
        <div className={`h-0 w-full overflow-hidden ${openReviews && "h-auto"} flex flex-col items-center`}>
          {taskDetails.reviews.map((review) => {
            return (
              <div
                key={review._id}
                className="mb-1 flex w-full flex-col items-center gap-2 border-b border-gray-500 pb-1"
              >
                <div className="flex w-full items-center gap-2">
                  <img
                    src={review.user.profilePicture}
                    alt=""
                    className="h-6 w-6 rounded-full object-fill md:h-8 md:w-8"
                  />
                  <span className="text-sm text-[#d1cfcf]">{review.user.name}</span>
                </div>
                <p className="w-full text-xs text-[#9d79ff] md:text-sm">{review.comment}</p>
              </div>
            );
          })}
          {taskDetails.reviews.length === 0 && (
            <Empty emptyText={t("There is not Reviews on this offer")} imgWidthHeight="w-8 h-8" />
          )}
          <form onSubmit={addReviewHandler} className="w-full">
            <input
              placeholder="Write your opinion"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-md border-gray-700 bg-[#171227fd] p-3 text-sm outline-none placeholder:text-gray-500"
            />
            <button className="mt-2 w-full rounded-md bg-[#6f9c5a] py-2 text-center">Send</button>
          </form>
        </div>
        <span className="mb-2 flex w-full items-center gap-3 text-[#aebeb5]">
          {t("Reward")} :
          <span className="text-sm text-[#6676ff]">
            {taskDetails.prize} {t("Points")}
          </span>
        </span>
        {isCompleted && (
          <button
            className={`w-full rounded-md border border-gray-700 bg-[#171430d5] py-2 text-sm text-white`}
          >
            Completed
          </button>
        )}
        {!isCompleted && taskDetails.isAvailable === "AVAILABLE" && (
          <Link
            to={`/playing/${taskDetails._id}`}
            className={`w-full rounded-md bg-[#a4ec52cc] py-2 text-center text-sm font-bold`}
          >
            {t("START NOW")}
          </Link>
        )}
        {taskDetails.isAvailable === "UNAVAILABLE" && (
          <button className={`w-full rounded-md bg-[#528feccc] py-2 text-center text-sm font-bold`}>
            {t("Not Available")}
          </button>
        )}
      </div>
    </>
  );
};

export default TaskDetail;
