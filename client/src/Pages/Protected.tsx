import { Outlet } from "react-router-dom";
import { useAppSelector } from "../context/Hooks";
import { useEffect, useState } from "react";
import { BsExclamationOctagonFill } from "react-icons/bs";

const Protected = () => {
  const { currentUser, currentUserIsLoading } = useAppSelector(
    (state) => state.stateManeger
  );
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const waitSomeTime = setTimeout(() => {
      setIsInitialized(true);
    }, 1000);
    return () => clearTimeout(waitSomeTime);
  }, []);

  if (!currentUser && !currentUserIsLoading && isInitialized) {
    return (
      <div className=" h-full text-3xl text-gray-400 font-bold flex items-center justify-center">
        <BsExclamationOctagonFill className="opacity-50 mr-4" />
        sign in first
      </div>
    );
  }

  return <div className="h-full w-full"><Outlet /> </div>;
};

export default Protected;
