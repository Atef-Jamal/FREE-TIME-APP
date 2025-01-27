import { MouseEvent, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { BsCheck2Circle, BsExclamationOctagonFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { setCurrentUser, openToast } from "../../context/appStateSlice";
import { makeRequest } from "../../services";
import { handleApiError } from "../../utilities";
import { IQuizTask } from "../../types/earnTypes";

interface IProps {
  taskApp: IQuizTask;
}

const QuizTask = ({ taskApp }: IProps) => {
  const currentUser = useAppSelector((state) => state.appState.currentUser);
  const [activeQuesition, setActiveQeustion] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState({
    status: false,
    corrects: 0,
    wrongs: 0,
  });
  const dispatch = useAppDispatch();

  let selected = "";

  const handlSelect = (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>, choice: string) => {
    selected = "";
    const event = e.target as HTMLElement;
    const element = document.getElementById("choices");
    if (!element) {
      return;
    }
    const allChoises = Array.from(element.children);
    allChoises.forEach((item: Element) => {
      item.classList.remove("activeQuizeChoise");
    });
    event.classList.add("activeQuizeChoise");
    selected = choice;
  };

  const handleNextBtn = () => {
    setAnswers((prev) => [...prev, selected]);
    setActiveQeustion((prev) => prev + 1);
    const element = document.getElementById("choices")!;
    const allChoises = Array.from(element.children);
    allChoises.forEach((item: Element) => {
      item.classList.remove("activeQuizeChoise");
    });
  };

  const handleSendRewardToUser = async () => {
    try {
      if (!currentUser) {
        return;
      }
      if (error) setError("");
      if (!loading) setLoading(true);
      const response = await makeRequest.post(`api/tasks/complete-quiz-app/${taskApp._id}`, {
        answers: [...answers, selected],
      });
      if (response.data.corrects > response.data.wrongs) {
        dispatch(
          setCurrentUser({
            ...currentUser,
            completedTasks: [...currentUser.completedTasks, taskApp._id],
          }),
        );
      }
      setResults({
        status: true,
        corrects: response.data.corrects,
        wrongs: response.data.wrongs,
      });
    } catch (error) {
      setError(handleApiError(error));
      dispatch(
        openToast({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const habdleReset = () => {
    setResults({
      status: false,
      corrects: 0,
      wrongs: 0,
    });
    setAnswers([]);
    setActiveQeustion(0);
    setLoading(false);
    setError("");
  };

  return (
    <div className="flex h-full min-h-[800px] items-center justify-center sm:min-h-[490px]">
      {loading && (
        <div className="flex items-center gap-4 sm:gap-2">
          <ImSpinner3 className="animate-spin text-4xl sm:text-2xl" />
          <span className="font-serif text-3xl font-bold text-[#abbe3eee] sm:text-xl">
            Waiting Results...
          </span>
        </div>
      )}

      {error && "Error Occurred" + error}

      {!error && !loading && !results.status && (
        <div className="mx-2 w-[500px] rounded-lg bg-[#3f3f4dee] p-6">
          <div className="flex w-full flex-col gap-5">
            <div className="border-b-2 border-gray-400 py-3 text-xl font-bold text-[#e79e9e] sm:text-lg">
              {taskApp.quizes[activeQuesition].question}
            </div>
            <div id="choices" className="flex w-full flex-col gap-3">
              {taskApp.quizes[activeQuesition].choises.map((item, index) => {
                return (
                  <span
                    key={index + item + new Date().getTime()}
                    onClick={(event) => {
                      handlSelect(event, item);
                    }}
                    className="border border-gray-600 p-3 text-sm font-bold tracking-wider text-gray-300 hover:opacity-75"
                  >
                    {item}
                  </span>
                );
              })}
              {taskApp.quizes.length - 1 !== activeQuesition && (
                <button
                  onClick={() => handleNextBtn()}
                  className="rounded-md bg-[#63dd58] px-5 py-1 text-black"
                >
                  Next
                </button>
              )}
              {taskApp.quizes.length - 1 === activeQuesition && (
                <button
                  onClick={() => handleSendRewardToUser()}
                  className="rounded-md bg-[#63dd58] px-5 py-1 text-black"
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {!loading && results.status === true && (
        <>
          {results.corrects > results.wrongs && (
            <div className="mx-2 flex h-[150px] w-[400px] flex-col items-center justify-center gap-2 rounded-sm bg-[#422c75c5]">
              <div className="flex justify-center gap-1 md:gap-3">
                <BsCheck2Circle className="text-3xl" />
                <p className="font-500 text-center text-gray-400">
                  <span className="mr-1 font-bold text-[#8ecf58]">Congratulation!</span>
                  Successfully Completed
                </p>
              </div>
              <div className="flex items-center justify-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-yellow-500">corrects :</span>
                  <span className="text-lg font-bold text-[#d1cece]">{results.corrects}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-yellow-500">wrongs :</span>
                  <span className="text-lg font-bold text-[#eeee]">{results.wrongs}</span>
                </div>
              </div>
              <p className="text-center text-sm font-bold text-gray-400">
                Go to your Notifications and claim Reward
              </p>
            </div>
          )}
          {results.corrects <= results.wrongs && (
            <div className="flex h-[150px] w-[400px] flex-col items-center justify-center gap-3 rounded-sm bg-[#422c75c5]">
              <div className="flex items-center justify-center gap-3">
                <BsExclamationOctagonFill className="text-2xl opacity-50" />
                <p className="text-lg font-bold text-gray-300">Failed to Pass</p>
              </div>
              <div className="flex items-center justify-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-yellow-500">corrects :</span>
                  <span className="text-lg font-bold text-[#d1cece]">{results.corrects}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-yellow-500">wrongs :</span>
                  <span className="text-lg font-bold text-[#eeee]">{results.wrongs}</span>
                </div>
              </div>
              <button
                onClick={habdleReset}
                className="rounded-md bg-[#7c5252] px-8 py-1 text-center text-gray-300 underline"
              >
                Try again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizTask;
