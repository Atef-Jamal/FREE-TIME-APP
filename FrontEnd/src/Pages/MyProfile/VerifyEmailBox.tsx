import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { CgClose } from "react-icons/cg";
import { resetModel, openToast } from "../../context/appStateSlice";
import EnterVerificationCode from "./EnterVerificationCode";
import { sendVerificationCode } from "../../services";
import { handleApiError } from "../../utilities";
import { useMutation } from "@tanstack/react-query";
import Spinner from "../../components/Shared/Common/Spinner";

const VerifyEmailBox = () => {
  const currentUser = useAppSelector((state) => state.appState.currentUser);
  const [openEnterCode, setOpenEnterCode] = useState(false);
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: sendVerificationCode,
    onSuccess: () => {
      setOpenEnterCode(true);
    },
    onError: (error) => {
      dispatch(
        openToast({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    },
  });

  const sendVerificationCodHandler = () => {
    if (!currentUser) return;
    if (currentUser.emailVerified) {
      dispatch(
        openToast({
          type: "ERROR_GENERAL",
          message: "sorry, Email already verified",
        }),
      );
      return;
    }
    mutation.mutate();
  };

  if (openEnterCode) {
    return <EnterVerificationCode />;
  }

  return (
    <div className="flex h-[100px] w-[90%] max-w-[500px] flex-col gap-3 rounded-md bg-[#213743] p-2 md:p-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-[#7bbe67]">Send Verification Code To</h1>
        <button onClick={() => dispatch(resetModel())} className="rounded-lg text-xl">
          <CgClose />
        </button>
      </div>
      <div className="flex w-full items-center justify-between">
        <p className="text-lg text-[#c2a5a5] underline">{currentUser?.email}</p>
        <button
          onClick={sendVerificationCodHandler}
          className="flex h-[30px] items-center justify-center rounded-md border border-[#9b4848] bg-[#93e672] px-4 text-blue-950 sm:w-[80px]"
        >
          {mutation.isPending ? <Spinner color="blue" /> : "Send"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailBox;
