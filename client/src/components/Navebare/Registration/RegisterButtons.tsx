import { ImKey2 } from "react-icons/im";
import { toggleThisEntity } from "../../../context/StateManeger";
import { BsFillPersonFill } from "react-icons/bs";
import { useAppDispatch } from "../../../context/Hooks";

const RegisterButtons = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex items-center gap-4 sm:gap-2">
      <button
        onClick={() => {
          dispatch(
            toggleThisEntity({ entity: "openRegisterForm", value: true })
          );
          dispatch(toggleThisEntity({ entity: "isSignIn", value: true }));
        }}
        className=" flex items-center justify-center gap-3 sm:gap-2 rounded-md text-[#ebeaea] bg-[#3b3b7eef] font-bold border border-gray-500 px-7 py-3 tracking-wider sm:py-2 sm:px-3 sm:text-sm"
      >
        <BsFillPersonFill className="text-xl sm:text-lg" />
        Sign In
      </button>
      <button
        onClick={() => {
          dispatch(
            toggleThisEntity({ entity: "openRegisterForm", value: true })
          );
          dispatch(toggleThisEntity({ entity: "isSignIn", value: false }));
        }}
        className=" flex items-center justify-center gap-3 sm:gap-2 rounded-md text-[#ffffff] bg-[#01D676] font-bold border border-gray-500 px-6 py-3 tracking-wider sm:p-2  sm:text-sm"
      >
        <ImKey2 />
        Sign Up
      </button>
    </div>
  );
};

export default RegisterButtons;
