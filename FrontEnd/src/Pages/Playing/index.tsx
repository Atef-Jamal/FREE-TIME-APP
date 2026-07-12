import { useParams } from "react-router-dom";
import GuessCardOffer from "./GuessCardOffer";
import QuizOffer from "./QuizOffer";
import { BiErrorAlt } from "react-icons/bi";
import Spinner from "../../components/Shared/Common/Spinner";
import { useFetchOfferDetails } from "../../tanstackQuery/queryFetch";

const Playing = () => {
  const { offerId } = useParams();

  const { data: offer, status, error } = useFetchOfferDetails({ offerId });

  if (status === "pending") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="h-16 w-16" />
      </div>
    );
  }

  if (!offerId) {
    return <div className="flex h-full w-full items-center justify-center">an error occurred</div>;
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-3 px-8 text-center font-bold opacity-70">
        <BiErrorAlt className="text-2xl" />
        {error?.response?.data.error}
      </div>
    );
  }
  if (offer.isAvailable === "UNAVAILABLE") {
    return (
      <div className="flex h-full w-full items-center justify-center gap-3 px-8 text-center font-bold opacity-70">
        <BiErrorAlt className="text-2xl" />
        this offer is not available
      </div>
    );
  }

  if (offer?.type === "QUIZ_APP") {
    return <QuizOffer offer={offer} />;
  }

  if (offer?.type === "GAME_APP") {
    return <GuessCardOffer offer={offer} />;
  }

  return null;
};

export default Playing;
