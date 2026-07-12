import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { IoIosStarOutline, IoMdStar } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { BsArrowDownCircle } from "react-icons/bs";
import { openToast, selectCurrentUser } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { cn, handleApiError } from "../../utilities";
import { handleCreateOfferReview } from "../../services";
import OfferDetailsSkeleton from "./OfferDetailsSkeleton";
import Empty from "../../components/Shared/Common/Empty";
import { useFetchOfferDetails } from "../../tanstackQuery/queryFetch";
import { IOffer } from "../../types";

interface IProps {
  offerId: string;
}

const OfferDetail = ({ offerId }: IProps) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [expandUsers, setExpandUsers] = useState(false);
  const [openReviews, setOpenReviews] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const { t } = useTranslation("earn");
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { data: offerDetails, status, error } = useFetchOfferDetails({ offerId });

  const mutation = useMutation({
    mutationFn: handleCreateOfferReview,
    onMutate: () => {
      setLoading(true);
    },
    onError: (error) => {
      setLoading(false);
      dispatch(openToast({ message: handleApiError(error), type: "ERROR_GENERAL" }));
    },
    onSuccess: (newReview) => {
      queryClient.setQueryData(["offers", offerId], (prev: IOffer): IOffer => {
        return { ...prev, reviews: [...prev.reviews, newReview] };
      });
      setComment("");
      setLoading(false);
    },
  });

  const addReviewHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (comment.trim() === "") {
      dispatch(openToast({ message: handleApiError(error), type: "ERROR_GENERAL" }));
      return;
    }
    mutation.mutate({ offerId, comment });
  };

  if (status === "pending") return <OfferDetailsSkeleton />;

  if (error) return <p className="py-16 text-center text-red-500">{error.response?.data.error}</p>;

  return (
    <>
      <h1 className="mb-3 text-2xl font-bold text-[#78bd4f]">{t("Offer Details")}</h1>
      <img
        alt=""
        src={`${import.meta.env.VITE_SERVER_BASE_URL}/${offerDetails.image}`}
        className="mb-3 h-[300px] w-full object-cover"
      />

      <div className="flex w-full flex-col items-center justify-center gap-1 md:gap-3">
        <span className="w-full text-sm text-[#537692]">
          <span className="mr-2 text-base text-[#aebeb5]">{t("Name")} :</span> {offerDetails?.title}
        </span>
        <span className="w-full text-sm text-[#537692]">
          <span className="mr-2 text-base text-[#aebeb5]">{t("Description")} :</span>
          {offerDetails?.description}
        </span>
        <span className="w-full text-sm text-[#537692]">
          <span className="mr-2 text-base text-[#aebeb5]">{t("available on")} :</span>
          {offerDetails?.devices === "ALL" ? "ALL DEVICES" : offerDetails.devices}
        </span>
        <div
          onClick={() => setExpandUsers((prev) => !prev)}
          className="item-center my-2 flex w-full justify-between rounded-md bg-[#333030] p-2"
        >
          <span className="text-[#73f1a8]">{t("People who completed this app")}</span>
          <FaRegArrowAltCircleDown className="text-xl opacity-50" />
        </div>
        <div
          className={cn(
            "flex w-full flex-col gap-1 transition-all",
            expandUsers ? "p-1" : "h-0 overflow-hidden p-0",
          )}
        >
          {offerDetails.completedBy.length === 0 && <Empty text={t("no one complete this app before")} />}

          {offerDetails.completedBy.length > 0 &&
            offerDetails.completedBy.map((item) => (
              <Link key={item._id} to={`/user/${item._id}`} className="block text-sm text-gray-400 underline">
                {item.name}
              </Link>
            ))}
        </div>
        <span className="flex w-full items-center gap-3 text-[#aebeb5]">
          {t("Rating")} :
          <span className="flex items-center justify-center gap-1">
            {[...Array(offerDetails.rating).keys()].map((item) => (
              <IoMdStar key={item} />
            ))}
            {[...Array(5 - offerDetails.rating).keys()].map((item) => (
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
        <div className={cn("flex h-0 w-full flex-col items-center overflow-hidden", openReviews && "h-auto")}>
          {offerDetails.reviews.map((review) => {
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
          {offerDetails.reviews.length === 0 && <Empty text={t("Empty Reviews")} />}
          <form onSubmit={addReviewHandler} className="w-full">
            <input
              placeholder="Write your opinion"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-md border-gray-700 bg-[#171227fd] p-3 text-sm outline-none placeholder:text-gray-500"
            />
            <button
              disabled={loading}
              type="submit"
              className="mt-2 w-full rounded-md bg-[#3e4152] py-2 text-center"
            >
              {loading ? "loading..." : "submit"}
            </button>
          </form>
        </div>
        <span className="mb-2 flex w-full items-center gap-3 text-[#aebeb5]">
          {t("Reward")} :
          <span className="text-sm text-[#6676ff]">
            {offerDetails.prize} {t("Points")}
          </span>
        </span>
        {currentUser?.completedOffers.includes(offerDetails?._id) && (
          <button
            className={`w-full rounded-md border border-gray-700 bg-[#171430d5] py-2 text-sm text-white`}
          >
            Completed
          </button>
        )}
        {!currentUser?.completedOffers.includes(offerDetails?._id) &&
          offerDetails.isAvailable === "AVAILABLE" && (
            <Link
              to={`/playing/${offerDetails._id}`}
              className={`w-full rounded-md bg-[#a4ec52cc] py-2 text-center text-sm font-bold`}
            >
              {t("START NOW")}
            </Link>
          )}
        {offerDetails.isAvailable === "UNAVAILABLE" && (
          <button className={`w-full rounded-md bg-[#528feccc] py-2 text-center text-sm font-bold`}>
            {t("Not Available")}
          </button>
        )}
      </div>
    </>
  );
};

export default OfferDetail;
