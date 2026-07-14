import { FcLock } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { showModal, updateStateField } from "../context/appStateSlice";
import { useAppDispatch } from "../context/hooks";

const LockedPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto flex flex-col items-center justify-center">
        <FcLock className="mb-5 text-6xl lg:text-8xl" />
        <div className="mb-5">
          <p className="text-2xl font-bold tracking-wide text-[#95aeb9] lg:text-3xl">Protected Page</p>
          <p className="text-2xl font-bold tracking-wide text-[#95aeb9] lg:text-3xl">Sign in to view</p>
        </div>
        <div className="w-full">
          <button
            onClick={() => {
              dispatch(updateStateField({ entity: "isSignInMode", value: true }));
              dispatch(showModal("register-modal"));
            }}
            className="mb-2 w-full rounded-lg bg-[#1a4b68] py-1 text-lg font-bold text-[#95aeb9] md:py-2 lg:text-2xl"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-lg bg-[#0f1b22f1] py-1 text-lg font-bold text-[#95aeb9] md:py-2 lg:text-2xl"
          >
            GO TO HOMEPAGE
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockedPage;
