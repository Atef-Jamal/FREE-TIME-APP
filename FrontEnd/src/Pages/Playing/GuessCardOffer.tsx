import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { selectCurrentUser, setCurrentUser } from "../../context/appStateSlice";
import { BsCheck2Circle } from "react-icons/bs";
import { displaySound, handleApiError } from "../../utilities";
import { ImSpinner3 } from "react-icons/im";
import type { IGameOffer } from "../../types";
import { addNewNotificationCache, updateOfferCache } from "../../tanstackQuery/queryCache";
import notificationSoundSrc from "../../assets/images/notificationSound.wav";
import { useQueryClient } from "@tanstack/react-query";
import { axiosRequest } from "../../lib/axios";

interface IProps {
  offer: IGameOffer;
}

const GuessCardOffer = ({ offer }: IProps) => {
  const currentUser = useAppSelector(selectCurrentUser);

  const cardNames = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const [currentCardIndex, setCurrentCardIndex] = useState(4);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Will the next card be Higher or Lower?");
  const [status, setStatus] = useState("neutral");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();

  const makeGuess = (guess: "higher" | "lower") => {
    const nextCardIndex = Math.floor(Math.random() * cardNames.length);

    if (guess === "higher" && nextCardIndex > currentCardIndex) {
      setScore(score + 1);
      setMessage(`Correct! It was a ${cardNames[nextCardIndex]}.`);
      setStatus("correct");
    } else if (guess === "lower" && nextCardIndex < currentCardIndex) {
      setScore(score + 1);
      setMessage(`Correct! It was a ${cardNames[nextCardIndex]}.`);
      setStatus("correct");
    } else if (nextCardIndex === currentCardIndex) {
      setMessage(`It was a tie (${cardNames[nextCardIndex]})! Keep your score.`);
      setStatus("neutral");
    } else {
      setScore(0);
      setMessage(`Wrong! It was a ${cardNames[nextCardIndex]}. Score reset.`);
      setStatus("wrong");
    }

    setCurrentCardIndex(nextCardIndex);
  };

  const getMessageColorClass = () => {
    if (status === "correct") return "text-emerald-300";
    if (status === "wrong") return "text-red-300";
    return "text-gray-300";
  };

  useEffect(() => {
    const getReward = async () => {
      if (!currentUser || score < 5) return;
      setError("");
      setIsLoading(true);
      try {
        const response = await axiosRequest.post(`api/offers/complete-guesscard-app/${offer._id}`, {
          example: "example",
        });
        if (response.status === 200) {
          dispatch(
            setCurrentUser({
              ...currentUser,
              completedOffers: [...currentUser.completedOffers, offer._id],
            }),
          );
          updateOfferCache({
            queryClient,
            offerId: offer._id,
            user: { _id: currentUser._id, name: currentUser.name },
          });
          addNewNotificationCache({ queryClient, newNotification: response.data.notification });
          displaySound(notificationSoundSrc);
          setCompleted(true);
        }
      } catch (error) {
        setError(handleApiError(error));
        setCompleted(false);
      } finally {
        setIsLoading(false);
      }
    };
    if (score >= 5) {
      getReward();
    }
  }, [score, dispatch, offer._id, currentUser, queryClient]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center justify-center gap-x-2 md:gap-x-4">
          <ImSpinner3 className="animate-spin text-2xl md:text-4xl" />
          <span className="font-serif text-3xl font-bold text-[#abbe3eee] sm:text-xl">
            Waiting Results...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 text-center font-bold opacity-70">
        {error}
      </div>
    );
  }

  return (
    <div className="m-0 flex min-h-full items-center justify-center bg-[#262238] p-2 font-sans">
      {completed && (
        <div className="flex h-[150px] w-[90%] flex-col items-center justify-center gap-1 rounded-md bg-[#422c75c5] md:w-[400px]">
          <BsCheck2Circle className="mb-3 text-3xl" />
          <div className="flex items-center justify-center gap-3">
            <p className="font-500 text-gray-400">
              <span className="font-bold text-[#8ecf58]">Congratulation!</span>
              Successfully Completed
            </p>
          </div>
          <p className="text-sm font-bold text-gray-400">Go to your Notifications and claim Reward</p>
        </div>
      )}
      {!completed && (
        <div className="w-80 rounded-2xl border border-gray-100 bg-[#3d3d64] p-4 text-center shadow-xl md:p-10">
          <h1 className="mb-2 text-2xl font-black tracking-tight text-indigo-600">Card Guess</h1>

          <div className="mb-6 inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-700">
            Current Score: {score}
          </div>

          <div className="mb-6 flex justify-center">
            <div className="flex h-44 w-36 transform cursor-default select-none items-center justify-center rounded-2xl border-2 border-gray-200 bg-[#301a1a] text-3xl font-black text-white shadow-sm transition-transform hover:scale-105 md:h-52">
              {cardNames[currentCardIndex]}
            </div>
          </div>

          <p
            className={`mb-6 flex min-h-12 items-center justify-center px-2 text-base font-semibold leading-snug ${getMessageColorClass()}`}
          >
            {message}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => makeGuess("lower")}
              className="w-full cursor-pointer rounded-xl bg-red-500 py-2 font-bold text-white shadow-md shadow-red-500/10 transition-all hover:bg-red-600 active:scale-95"
            >
              Lower ↙
            </button>

            <button
              onClick={() => makeGuess("higher")}
              className="w-full cursor-pointer rounded-xl bg-emerald-500 py-2 font-bold text-white shadow-md shadow-emerald-500/10 transition-all hover:bg-emerald-600 active:scale-95"
            >
              Higher ↗
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuessCardOffer;
