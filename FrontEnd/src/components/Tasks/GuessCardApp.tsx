import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { setCurrentUser } from "../../context/StateManeger";
import { BsCheck2Circle } from "react-icons/bs";
import { makeRequest } from "../../utils";
import { handleApiError } from "../../utils/common";

import { ImSpinner3 } from "react-icons/im";
import { TypeGameApp } from "../../types/earnTypes";

const GuessCardApp = ({ taskApp }: { taskApp: TypeGameApp }) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
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
        await makeRequest.post(
          `api/tasks/complete-guesscard-app/${taskApp._id}`,
          {
            example: "example",
          }
        );
        setCompleted(true);
        dispatch(
          setCurrentUser({
            ...currentUser,
            completedTasks: [...currentUser.completedTasks, taskApp._id],
          })
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
      <div className="h-full flex items-center justify-center min-h-[70vh]">
        <div className="flex items-center gap-4 sm:gap-2">
          <ImSpinner3 className="text-4xl sm:text-2xl animate-spin" />
          <span className="text-[#abbe3eee] text-3xl sm:text-xl font-bold font-serif">
            Waiting Results...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full min-h-[70vh] flex flex-col items-center justify-center gap-3 opacity-70  font-bold px-8 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3 min-h-[70vh]">
      {completed && (
        <div className="w-[400px] xs:w-[90%] rounded-md h-[150px] bg-[#422c75c5] flex flex-col items-center justify-center gap-1">
          <BsCheck2Circle className="text-3xl mb-3" />
          <div className="flex items-center justify-center gap-3">
            <p className="text-gray-400 font-500">
              <span className="font-bold text-[#8ecf58]">Congratulation!</span>
              Successfully Completed
            </p>
          </div>
          <p className="text-gray-400 font-bold text-sm">
            Go to your Notifications and claim Reward
          </p>
        </div>
      )}
      {!completed && (
        <>
          <div className="w-[500px] sm:w-[400px] xs:w-[90%] flex items-center justify-between ">
            <span className="ml-1 text-gray-300 text-sm">Easy Level</span>
            <span className="font-bold text-black bg-[#b8ae56] py-1 px-5 rounded-md">
              SCORE :
              <span className="font-bold text-[#2341ca] ml-2">{score}</span>
            </span>
          </div>
          <div className="w-[500px] sm:w-[400px] xs:w-[90%] h-[300px] xs:h-[230px] border grid grid-cols-4 gap-2 p-2">
            {cards.map((item: string, i: number) => {
              return (
                <div
                  onClick={handleSelect}
                  key={i}
                  className="card-item rounded-md rotate-180 border border-gray-400 text-gray-400 flex items-center justify-center font-bold text-2xl bg-gray-400"
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

export default GuessCardApp;
