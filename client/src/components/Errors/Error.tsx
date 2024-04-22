import { FaExclamationTriangle } from "react-icons/fa";
import { toggleThisEntity } from "../../context/StateManeger";
import { useAppDispatch } from "../../context/Hooks";
const Error = ({ generalError }: { generalError?: boolean }) => {
  const dispatch = useAppDispatch();
  return (
    <div className=" flex flex-col items-center justify-center gap-5 h-[60vh] bg-[#191935]">
      <FaExclamationTriangle className="text-5xl " />
      {generalError ? (
        <span>Somthing Went Wrong !</span>
      ) : (
        <>
          <p className="text-xl font-bold text-[#63f337]">
            <button
              onClick={() => {
                dispatch(
                  toggleThisEntity({ entity: "openRegisterForm", value: true })
                );
                dispatch(toggleThisEntity({ entity: "isSignIn", value: true }));
              }}
              className="underline text-[#fd6d6d]"
            >
              Sign In
            </button>
            First
          </p>
          <p className="text-xl font-bold text-[#62f336]">
            Don't Have an Account,
            <button
              className="underline text-[#fd6d6d]"
              onClick={() => {
                dispatch(
                  toggleThisEntity({ entity: "openRegisterForm", value: true })
                );
              }}
            >
              Sign Up
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default Error;
