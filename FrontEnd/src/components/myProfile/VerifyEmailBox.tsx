import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { CgClose } from "react-icons/cg";
import { resetModel, showPopup } from "../../context/StateManeger";
import Spinner from "../Others/Spinner";
import EnterVerificationCode from "./EnterVerificationCode";
import { sendVerificationCode } from "../../utils";
import { handleApiError } from "../../utils/common";
import { useMutation } from "@tanstack/react-query";

const VerifyEmailBox = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const [openEnterCode, setOpenEnterCode] = useState(false);
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: sendVerificationCode,
    onSuccess: () => {
      setOpenEnterCode(true);
    },
    onError: (error) => {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    },
  });

  const sendVerificationCodHandler = () => {
    if (!currentUser) return;
    if (currentUser.emailVerified) {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: "sorry, Email already verified",
        })
      );
      return;
    }
    mutation.mutate();
  };

  if (openEnterCode) {
    return <EnterVerificationCode />;
  }

  return (
    <div className="w-full h-[110px] p-4 flex flex-col  gap-3 bg-[#213743] rounded-md ">
      <div className="flex items-center justify-between">
        <h1 className="text-[#7bbe67] font-bold ">Send Verification Code To</h1>
        <button onClick={() => dispatch(resetModel())} className="text-xl rounded-lg">
          <CgClose />
        </button>
      </div>
      <div className="flex items-center gap-5 w-full">
        <p className="text-[#c2a5a5] text-lg underline">{currentUser?.email}</p>
        <button
          onClick={sendVerificationCodHandler}
          className="bg-[#93e672] w-[140px] sm:w-[80px]  text-blue-950 py-1 rounded-md flex items-center justify-center border border-[#9b4848]"
        >
          {mutation.isPending ? (
            <Spinner className="w-5 h-5 mx-auto border-b-[#291a3b] border-l-[#291a3b]" />
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailBox;
