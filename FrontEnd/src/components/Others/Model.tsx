import { ReactNode, Suspense } from "react";
import { resetModel } from "../../context/StateManeger";
import { useAppDispatch } from "../../context/Hooks";

const Model = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const closeModel = () => dispatch(resetModel());
  return (
    <div className="fixed z-[11] flex h-[100dvh] w-[100dvw] items-center justify-center">
      <div
        onClick={closeModel}
        className="absolute z-[-1] h-full w-full backdrop-blur-sm backdrop-brightness-[0.6]"
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
