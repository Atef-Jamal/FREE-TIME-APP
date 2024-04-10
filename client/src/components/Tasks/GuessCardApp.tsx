import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../context/Hooks";

import { FaCircleCheck } from "react-icons/fa6";
import axios from "axios";
import { TypeTaskApp } from "../../types";
import { setCurrentUser } from "../../context/StateManeger";
import { BsCheck2Circle } from "react-icons/bs";

const GuessCardApp = ({ taskApp }: { taskApp: TypeTaskApp }) => {
  const { currentUser, token } = useAppSelector((state) => state.stateManeger);
  const cards = ["a", "b", "c", "b", "a", "c", "e", "g", "f", "e", "g", "f"];
  const [selected, setSelected] = useState<string>("");
  const [score, setScore] = useState(0);
  const [stopp, setStopp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const allElements = document.querySelectorAll(".card-item");

  const dispatch = useAppDispatch();
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  };

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
      if (currentUser) {
        try {
          setError("");
          setIsLoading(true);
          const response = await axios.post(
            `http://localhost:3000/api/tasks/completegame/${taskApp._id}`,
            {
              status: "success",
            },
            { headers }
          );
          if (response.status === 200) {
            setCompleted(true);
            dispatch(
              setCurrentUser({
                ...currentUser,
                completedTasks: [...currentUser.completedTasks, taskApp._id],
              })
            );
          }
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          setError("an error occured !");
        }
      }
    };

    if (score >= 5) {
      getReward();
    }
  }, [score]);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <span>{error}</span>;
  }

  if (
    currentUser?.completedTasks.includes(taskApp._id) &&
    !error &&
    !completed
  ) {
    return (
      <div className="flex items-center justify-center gap-3 h-full opacity-70 py-8 font-bold text-lg">
        <FaCircleCheck className="text-xl" />
        Has Been Completed Before, Try another app
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3 min-h-[70vh]">
      {completed && (
        <div className="w-[400px] h-[150px] bg-[#422c75c5] flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-3">
            <BsCheck2Circle className="text-3xl" />
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
          <span className="font-bold text-black bg-[#b8ae56] py-1 px-5 rounded-md">
            SCORE :
            <span className="font-bold text-[#2341ca] ml-2">{score}</span>
          </span>
          <div className="w-[500px] h-[400px] border grid grid-cols-4 gap-2 p-2">
            {cards.map((item: string, i: number) => {
              return (
                <div
                  onClick={handleSelect}
                  key={i}
                  className="card-item rotate-180 border border-gray-400 text-gray-400 flex items-center justify-center font-bold text-2xl bg-gray-400"
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
