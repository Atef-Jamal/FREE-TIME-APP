import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import { FaCircleCheck } from "react-icons/fa6";
import { TypeTaskApp } from "../types";
import { handleApiError, makeRequest } from "../utils";
import GuessCardApp from "../components/Tasks/GuessCardApp";
import QuizApp from "../components/Tasks/QuizApp";
import Spinner from "../components/Others/Spinner";
import { showPopup } from "../context/StateManeger";
import { BiErrorAlt } from "react-icons/bi";

const Playing = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [taskApp, setTaskApp] = useState<TypeTaskApp | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isCompleted, setIsComleted] = useState<boolean>(false);
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchTask = async () => {
      if (id && currentUser) {
        try {
          if (!isLoading) {
            setIsLoading(true);
          }
          setError("");
          const userResponse = await makeRequest.get(
            `api/users/${currentUser._id}`
          );
          const cHeckIsCompleted =
            userResponse.data.completedTasks.includes(id);

          if (cHeckIsCompleted) {
            setIsComleted(true);
          }

          const response = await makeRequest.get(`api/tasks/${id}`);

          setTaskApp(response.data);
        } catch (err) {
          dispatch(
            showPopup({
              status: true,
              message: handleApiError(error),
              icon: <BiErrorAlt />,
            })
          );
          setError("an error occurred, try again");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchTask();
  }, [id, currentUser?._id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="w-20 h-20" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-full opacity-70 border font-bold px-8 text-center">
        <FaCircleCheck className="text-2xl" />
        {error}
      </div>
    );
  }
  if (isCompleted && !error) {
    return (
      <div className="flex items-center justify-center gap-3 h-full opacity-70 py-8 font-extrabold text-lg">
        <FaCircleCheck className="text-xl" />
        Has Been Completed Before, Try another app
      </div>
    );
  }

  if (taskApp?.category === "quiz" && currentUser && !error) {
    return <QuizApp taskApp={taskApp} />;
  }

  if (taskApp?.category === "game" && currentUser && !error) {
    return <GuessCardApp taskApp={taskApp} />;
  }
};

export default Playing;
