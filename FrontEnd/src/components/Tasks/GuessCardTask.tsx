import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { setCurrentUser } from "../../context/appStateSlice";
import { BsCheck2Circle } from "react-icons/bs";
import { makeRequest } from "../../services";
import { handleApiError } from "../../utilities";
import { ImSpinner3 } from "react-icons/im";
import { IGameTask } from "../../types/earnTypes";

interface IProps {
  taskApp: IGameTask;
}

const GuessCardTask = ({ taskApp }: IProps) => {
  const currentUser = useAppSelector((state) => state.appState.currentUser);
  const cards = ["a", "b", "c", "b", "a", "c", "e", "g", "f", "e", "g", "f"];
  const [selected, setSelected] = useState<string>("");
  const [score, setScore] = useState(0);
  const [stopp, setStopp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const allElements = document.querySelectorAll(".card-item");

  const dispatch = useAppDispatch();

  const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stopp) {
      return;
    }
    const element = e.target as HTMLDivElement;
    if (selected.length === 1) {
      element.classList.add("active-guesscard");
      if (element.textContent === selected) {
        setScore((prev) => prev + 1);
        setSelected("");
        setStopp(true);
        setTimeout(() => {
          allElements.forEach((item) => {
            item.classList.remove("active-guesscard");
          });
          setStopp(false);
        }, 2000);
        return;
      } else {
        setScore((prev) => (prev === 0 ? 0 : prev - 1));
        setSelected("");
        setStopp(true);
        setTimeout(() => {
          allElements.forEach((item) => {
            item.classList.remove("active-guesscard");
          });
          setStopp(false);
        }, 2000);
        return;
      }
    }
    element.classList.add("active-guesscard");
    setSelected(element.textContent as string);
  };

  useEffect(() => {
    const getReward = async () => {
      if (!currentUser || score < 5) {
        return;
      }
      setError("");
      setIsLoading(true);
      try {
        await makeRequest.post(`api/tasks/complete-guesscard-app/${taskApp._id}`, {
          example: "example",
        });
        setCompleted(true);
        dispatch(
          setCurrentUser({
            ...currentUser,
            completedTasks: [...currentUser.completedTasks, taskApp._id],
          }),
        );
        setIsLoading(false);
      } catch (error) {
        setError(handleApiError(error));
        setCompleted(false);
        setIsLoading(false);
      }
    };
    if (score >= 5) {
      getReward();
    }
  }, [score, dispatch, taskApp._id, currentUser]);

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
    <div className="flex flex-col items-center justify-center gap-y-3 py-8">
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
        <>
          <div className="flex w-[90%] items-center justify-between sm:w-[400px] md:w-[500px]">
            <span className="ml-1 text-sm text-gray-300">Easy Level</span>
            <span className="rounded-md bg-[#b8ae56] px-5 py-1 font-bold text-black">
              SCORE :<span className="ml-2 font-bold text-[#2341ca]">{score}</span>
            </span>
          </div>
          <div className="grid h-[230px] w-[90%] grid-cols-4 gap-2 border p-2 sm:w-[400px] md:h-[300px] md:w-[500px]">
            {cards.map((item: string, i: number) => {
              return (
                <div
                  onClick={handleSelect}
                  key={i}
                  className="card-item flex rotate-180 items-center justify-center rounded-md border border-gray-400 bg-gray-400 text-2xl font-bold text-gray-400"
                >
                  {item}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default GuessCardTask;
