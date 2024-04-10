import { useEffect, useState } from "react";
// import { quizImage } from "../assets";
import { Error, GameCard, Skeleton } from "../components";
import { useAppSelector } from "../context/Hooks";
// import { tasks } from "../helper/data";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { TypeGame } from "../types";

const Quiz = () => {
  const { resizeSidebare } = useAppSelector((state) => state.stateManeger);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [fetchedTasks, setFetchedTasks] = useState<TypeGame[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setError(false);
        setLoading(true);
        const response = await getDocs(
          collection(db, import.meta.env.VITE_TASKS_COLLECTION_NAME)
        );
        let arr: TypeGame[] = [];
        response.forEach((item) =>
          arr.push({ ...item.data(), id: item.id } as TypeGame)
        );
        setFetchedTasks(arr);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(true);

      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="m-4 p-4">
      <h1 className="font-bold text-lg text-gray-300 p-3 border-b mb-4">
        QUIZ APPS
      </h1>
      {error && !loading && fetchedTasks.length === 0 && (
        <Error generalError={true} />
      )}
      <div
        className={`${
          resizeSidebare
            ? "grid grid-cols-8 xl:grid-cols-6 lg:grid-cols-5 sm:grid-cols-4 xs:grid-cols-2"
            : "grid grid-cols-7 xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-3 xs:grid-cols-2"
        } gap-3 p-2`}
      >
        {loading &&
          !error &&
          [...Array(21).keys()].map((i) => (
            <div
              key={i}
              className="h-[250px] p-3 rounded-md flex flex-col items-center justify-between bg-[#2a244481] border border-gray-700"
            >
              <Skeleton className="h-[120px] w-full" />
              <div className="w-full flex flex-col gap-1 ">
                <div className="w-full flex items-center justify-between">
                  <Skeleton className="w-[60%] h-[13px] " />
                  <Skeleton className="w-[35%] h-[13px] " />
                </div>
                <Skeleton className="w-full h-[18px]" />
              </div>
              <div className="w-full flex flex-col items-center gap-1">
                <Skeleton className="h-[12px] w-full" />
              </div>
              <div className="w-full flex items-center justify-between">
                <Skeleton className="w-[35%] h-[22px]" />
                <Skeleton className="w-[60%] h-[22px]" />
              </div>
            </div>
          ))}
        {fetchedTasks.map(
          ({ name, description, category, id, prize, image }, i) => (
            <GameCard
              key={id}
              id={id}
              name={name}
              image={image}
              description={description}
              category={category}
              prize={prize}
              firstItem={i === 0 ? true : false}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Quiz;
