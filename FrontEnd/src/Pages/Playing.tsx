import { useParams } from "react-router-dom";
import { useAppSelector } from "../context/Hooks";
import { FaCircleCheck } from "react-icons/fa6";
import GuessCardApp from "../components/Tasks/GuessCardApp";
import QuizApp from "../components/Tasks/QuizApp";
import Spinner from "../components/Others/Spinner";
import { BiErrorAlt } from "react-icons/bi";
import { useFetchTaskApp, useFetchUser } from "../hooks";

const Playing = () => {
  const { currentUser, currentAccountRequestFullfiled } = useAppSelector(
    (state) => state.stateManeger
  );
  const { id } = useParams();

  const {
    user,
    loading: loadingUser,
    error: errorUser,
  } = useFetchUser({
    userId: currentUser?._id,
    initialLoading: true,
    dependencies: [id, currentUser?._id],
  });

  const {
    taskApp,
    loading: loadingTaskApp,
    error: errorTaskApp,
  } = useFetchTaskApp({
    appId: id,
    initialLoading: true,
    dependencies: [id],
  });

  let isCompletedBefore: boolean = false;

  if (id) {
    if (user?.completedTasks.includes(id)) {
      isCompletedBefore = true;
    }
  }

  if (loadingUser || loadingTaskApp || !currentAccountRequestFullfiled) {
    return (
      <div className="flex items-center justify-center h-full min-h-[800px] sm:min-h-[490px]">
        <Spinner className="w-20 h-20" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full min-h-[800px] sm:min-h-[490px]">
        sign In first
      </div>
    );
  }
  if (!id) {
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
          <span className="text-center">
            sorry, you Completed this app Before, Try another app
          </span>
        </div>
      </div>
    );
  }

  if (errorUser || errorTaskApp) {
    return (
      <div className="flex items-center justify-center gap-3 h-full min-h-[800px] sm:min-h-[490px] opacity-70 font-bold px-8 text-center">
        <BiErrorAlt className="text-2xl" />
        {errorUser || errorTaskApp}
      </div>
    );
  }

  if (taskApp?.type === "QUIZ_APP" && taskApp.isAvailable === "AVAILABLE") {
    return <QuizApp taskApp={taskApp} />;
  }

  if (taskApp?.type === "GAME_APP" && taskApp.isAvailable === "AVAILABLE") {
    return <GuessCardApp taskApp={taskApp} />;
  }
};

export default Playing;
