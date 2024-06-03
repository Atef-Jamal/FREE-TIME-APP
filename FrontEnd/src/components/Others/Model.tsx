import { ReactNode } from "react";
import { resetModel } from "../../context/StateManeger";
import { useAppDispatch } from "../../context/Hooks";

const Model = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  return (
    <div
      onClick={() => dispatch(resetModel())}
      className="fixed top-0 left-0 z-[5] w-screen h-screen flex items-center justify-center bg-[#0000003d]"
    >
      <div className="mb-16" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Model;
