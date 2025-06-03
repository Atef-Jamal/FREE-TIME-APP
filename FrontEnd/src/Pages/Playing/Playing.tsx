import { useParams } from "react-router-dom";
import { useAppSelector } from "../../context/hooks";
import { FaCircleCheck } from "react-icons/fa6";
import GuessCardTask from "../../components/Tasks/GuessCardTask";
import QuizTask from "../../components/Tasks/QuizTask";
import { BiErrorAlt } from "react-icons/bi";
import Spinner from "../../components/Shared/Common/Spinner";
import { useFetchTaskDetails } from "../../tanstackQuery/queryFetch";
import { selectCurrentUser } from "../../context/appStateSlice";

const Playing = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const { taskId } = useParams();

  const { data: taskApp, status: statusTaskApp, error: errorTaskApp } = useFetchTaskDetails({ taskId });

  let isCompletedBefore: boolean = false;

  if (taskId) {
    if (currentUser?.completedTasks.includes(taskId)) {
      isCompletedBefore = true;
    }
  }

  if (statusTaskApp === "pending") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="h-16 w-16" />
      </div>
    );
  }

  if (!taskId) {
    return <div className="flex h-full w-full items-center justify-center">an error occurred</div>;
  }

  if (isCompletedBefore) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-x-2 text-lg opacity-70">
        <div className="flex flex-col items-center justify-center gap-3 px-4">
          <FaCircleCheck className="text-xl" />
          <span className="text-center">sorry, you Completed this app Before, Try another app</span>
        </div>
      </div>
    );
  }

  if (errorTaskApp) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-3 px-8 text-center font-bold opacity-70">
        <BiErrorAlt className="text-2xl" />
        {errorTaskApp?.response?.data.error || errorTaskApp?.response?.data.error}
      </div>
    );
  }

  if (taskApp?.type === "QUIZ_APP" && taskApp.isAvailable === "AVAILABLE") {
    return <QuizTask taskApp={taskApp} />;
  }

  if (taskApp?.type === "GAME_APP" && taskApp.isAvailable === "AVAILABLE") {
    return <GuessCardTask taskApp={taskApp} />;
  }

  return <></>;
};

export default Playing;
