import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GuessCardApp, QuizApp, Spinner } from "../components";
import { useAppSelector } from "../context/Hooks";
import { FaCircleCheck } from "react-icons/fa6";
import { TypeTaskApp } from "../types";
import { FaExclamationCircle } from "react-icons/fa";
import { makeRequest } from "../utils";

const Playing = () => {
  const { currentUser} = useAppSelector((state) => state.stateManeger);
  const [taskApp, setTaskApp] = useState<TypeTaskApp | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isCompleted, setIsComleted] = useState<boolean>(false);
  const { id } = useParams();



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

          const response = await makeRequest.get(
            `api/tasks/${id}`,
          );

          setTaskApp(response.data);
        } catch (err) {
          console.log(err);
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
      <div className="text-gray-400 font-bold  h-full flex items-center justify-center text-xl">
        <FaExclamationCircle className="opacity-50 mr-3 text-2xl" /> {error}
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
