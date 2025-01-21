import { ReactNode, Suspense } from "react";
import { resetModel } from "../../context/StateManeger";
import { useAppDispatch } from "../../context/Hooks";

const Model = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="fixed z-[11] flex h-screen w-screen items-center justify-center">
      <div
        onClick={() => dispatch(resetModel())}
        className="absolute z-[-1] h-full w-full bg-[#0b0b119c] backdrop-blur-sm"
      ></div>
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-b-transparent border-l-yellow-500 border-r-transparent border-t-yellow-500"></span>
          </div>
        }
        children={children}
      />
    </div>
  );
};

export default Model;
