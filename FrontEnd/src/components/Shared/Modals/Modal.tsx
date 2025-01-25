import { Suspense } from "react";
import { resetModel } from "../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import Spinner from "../Common/Spinner";

const Modal = () => {
  const modal = useAppSelector((state) => state.stateManeger.modal);
  const dispatch = useAppDispatch();

  const closeModel = () => dispatch(resetModel());

  if (!modal.children) return;

  return (
    <div className="fixed z-[11] flex h-[100dvh] w-[100dvw] items-center justify-center">
      <div
        onClick={closeModel}
        className="absolute z-[-1] h-full w-full backdrop-blur-sm backdrop-brightness-[0.6]"
      ></div>
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Spinner className="h-14 w-14 border-[4px]" />
          </div>
        }
        children={modal.children}
      />
    </div>
  );
};

export default Modal;
