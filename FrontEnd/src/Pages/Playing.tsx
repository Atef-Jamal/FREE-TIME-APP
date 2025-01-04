import { useParams } from "react-router-dom";
import { useAppSelector } from "../context/Hooks";
import { FaCircleCheck } from "react-icons/fa6";
import GuessCardApp from "../components/Tasks/GuessCardApp";
import QuizApp from "../components/Tasks/QuizApp";
import Spinner from "../components/Others/Spinner";
import { BiErrorAlt } from "react-icons/bi";
import { skipToken, useQuery } from "@tanstack/react-query";
import { fetchAppDetails, fetchUserById } from "../utils";

const Playing = () => {
  const currentUserId = useAppSelector((state) => state.stateManeger.currentUser?._id);
  const { taskId } = useParams();

  const {
    data: user,
    status: userStatus,
    error: errorUser,
  } = useQuery({
    queryKey: ["user", currentUserId],
    queryFn: currentUserId ? () => fetchUserById(currentUserId) : skipToken,
  });

  const {
    data: taskApp,
    status: statusTaskApp,
    error: errorTaskApp,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: taskId ? () => fetchAppDetails({ taskId }) : skipToken,
  });

  let isCompletedBefore: boolean = false;

  if (taskId) {
    if (user?.completedTasks.includes(taskId)) {
      isCompletedBefore = true;
    }
  }

  if (userStatus === "pending" || statusTaskApp === "pending") {
    return (
      <div className="flex items-center justify-center h-full min-h-[800px] sm:min-h-[490px]">
        <Spinner className="w-20 h-20" />
      </div>
    );
  }

  if (!taskId) {
    return (
      <div className="flex items-center justify-center h-full min-h-[800px] sm:min-h-[490px]">
        an error occurred
      </div>
    );
  }

  if (isCompletedBefore) {
    return (
      <div className="flex items-center justify-center gap-2 h-full min-h-[800px] sm:min-h-[490px] opacity-70 text-lg">
        <div className="px-4 flex flex-col items-center justify-center gap-3">
          <FaCircleCheck className="text-xl" />
          <span className="text-center">sorry, you Completed this app Before, Try another app</span>
        </div>
      </div>
    );
  }

  if (errorUser || errorTaskApp) {
    return (
      <div className="flex items-center justify-center gap-3 h-full min-h-[800px] sm:min-h-[490px] opacity-70 font-bold px-8 text-center">
        <BiErrorAlt className="text-2xl" />
        {errorUser?.response?.data.error || errorTaskApp?.response?.data.error}
      </div>
    );
  }

  if (taskApp?.type === "QUIZ_APP" && taskApp.isAvailable === "AVAILABLE") {
    return <QuizApp taskApp={taskApp} />;
  }

  if (taskApp?.type === "GAME_APP" && taskApp.isAvailable === "AVAILABLE") {
    return <GuessCardApp taskApp={taskApp} />;
  }

  return <></>;
};

export default Playing;
