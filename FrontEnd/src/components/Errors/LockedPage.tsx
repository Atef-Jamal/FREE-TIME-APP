import { FcLock } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toggleThisEntity } from "../../context/StateManeger";
import { useAppDispatch } from "../../context/Hooks";

const LockedPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center mx-3">
        <FcLock className="text-8xl sm:text-6xl mb-5" />
        <div className="mb-5">
          <p className="text-[#95aeb9] text-3xl sm:text-2xl font-bold tracking-wide">
            Protected Page
          </p>
          <p className="text-[#95aeb9] text-3xl sm:text-2xl font-bold tracking-wide">
            Sign in to view
          </p>
        </div>
        <div className="w-full">
          <button
            onClick={() => {
              dispatch(
                toggleThisEntity({ entity: "isSignInMode", value: true })
              );
              dispatch(
                toggleThisEntity({ entity: "openRegisterForm", value: true })
              );
            }}
            className="w-full py-2 xs:py-1 mb-2 text-[#95aeb9]  text-2xl sm:text-lg font-bold bg-[#1a4b68] rounded-lg"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-2 xs:py-1 text-[#95aeb9]  text-2xl sm:text-lg font-bold bg-[#0f1b22f1] rounded-lg"
          >
            GO TO HOMEPAGE
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockedPage;
