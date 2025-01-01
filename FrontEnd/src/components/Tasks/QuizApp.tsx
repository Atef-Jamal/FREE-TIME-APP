import { MouseEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { setCurrentUser, showPopup } from "../../context/StateManeger";
import { BsCheck2Circle, BsExclamationOctagonFill } from "react-icons/bs";
import { makeRequest } from "../../utils";
import { handleApiError } from "../../utils/common";
import { ImSpinner3 } from "react-icons/im";
import { TypeQuizApp } from "../../types/earnTypes";

interface TypeProps {
  taskApp: TypeQuizApp;
}

const QuizApp = ({ taskApp }: TypeProps) => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const [activeQuesition, setActiveQeustion] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState({
    status: false,
    corrects: 0,
    wrongs: 0,
  });

  let selected = "";

  const dispatch = useAppDispatch();

  const handlSelect = (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>, choice: string) => {
    selected = "";
    const event = e.target as HTMLElement;
    const element = document.getElementById("choices");
    if (!element) {
      return;
    }
    const allChoises = Array.from(element.children);
    allChoises.forEach((item: Element) => {
      item.classList.remove("activeSelect");
    });
    event.classList.add("activeSelect");
    selected = choice;
  };

  const handleNextBtn = () => {
    setAnswers((prev) => [...prev, selected]);
    setActiveQeustion((prev) => prev + 1);
    const element = document.getElementById("choices")!;
    const allChoises = Array.from(element.children);
    allChoises.forEach((item: Element) => {
      item.classList.remove("activeSelect");
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
          })
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
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        })
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
    <div className="h-full min-h-[800px] sm:min-h-[490px] flex items-center justify-center">
      {loading && (
        <div className="flex items-center gap-4 sm:gap-2">
          <ImSpinner3 className="text-4xl sm:text-2xl animate-spin" />
          <span className="text-[#abbe3eee] text-3xl sm:text-xl font-bold font-serif">
            Waiting Results...
          </span>
        </div>
      )}
      {error && "Error Occurred" + error}

      {!error && !loading && !results.status && (
        <div className="w-[500px] bg-[#3f3f4dee] p-6 rounded-lg mx-2 ">
          <div className="w-full flex flex-col gap-5">
            <div className=" text-[#e79e9e] font-bold border-b-2 border-gray-400 text-xl sm:text-lg py-3">
              {taskApp.quizes[activeQuesition].question}
            </div>
            <div id="choices" className="flex flex-col gap-3 w-full ">
              {taskApp.quizes[activeQuesition].choises.map((item, index) => {
                return (
                  <span
                    key={index + item + new Date().getTime()}
                    onClick={(event) => {
                      handlSelect(event, item);
                    }}
                    className="text-gray-300 tracking-wider font-bold text-sm border border-gray-600 p-3 hover:opacity-75"
                  >
                    {item}
                  </span>
                );
              })}
              {taskApp.quizes.length - 1 !== activeQuesition && (
                <button
                  onClick={() => handleNextBtn()}
                  className="bg-[#63dd58] rounded-md px-5 py-1 text-black"
                >
                  Next
                </button>
              )}
              {taskApp.quizes.length - 1 === activeQuesition && (
                <button
                  onClick={() => handleSendRewardToUser()}
                  className="bg-[#63dd58] rounded-md px-5 py-1 text-black"
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
            <div className="w-[400px] h-[150px] bg-[#422c75c5] flex flex-col items-center justify-center gap-2 rounded-sm mx-2">
              <div className="flex justify-center gap-3 xs:gap-1">
                <BsCheck2Circle className="text-3xl" />
                <p className="text-gray-400 font-500 text-center">
                  <span className="font-bold text-[#8ecf58] mr-1">Congratulation!</span>
                  Successfully Completed
                </p>
              </div>
              <div className="flex items-center justify-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg text-yellow-500 font-bold">corrects :</span>
                  <span className="text-lg font-bold text-[#d1cece]">{results.corrects}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-yellow-500 font-bold">wrongs :</span>
                  <span className="text-lg font-bold text-[#eeee]">{results.wrongs}</span>
                </div>
              </div>
              <p className="text-gray-400 font-bold text-sm text-center">
                Go to your Notifications and claim Reward
              </p>
            </div>
          )}
          {results.corrects <= results.wrongs && (
            <div className="w-[400px] h-[150px] bg-[#422c75c5] flex flex-col items-center justify-center gap-3 rounded-sm">
              <div className="flex items-center justify-center gap-3">
                <BsExclamationOctagonFill className="text-2xl opacity-50" />
                <p className="text-gray-300  font-bold text-lg">Failed to Pass</p>
              </div>
              <div className="flex items-center justify-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg text-yellow-500 font-bold">corrects :</span>
                  <span className="text-lg font-bold text-[#d1cece]">{results.corrects}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-yellow-500 font-bold">wrongs :</span>
                  <span className="text-lg font-bold text-[#eeee]">{results.wrongs}</span>
                </div>
              </div>
              <button
                onClick={habdleReset}
                className="px-8 py-1 text-center bg-[#7c5252] text-gray-300 rounded-md underline"
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

export default QuizApp;
