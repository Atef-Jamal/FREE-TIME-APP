import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { CgClose } from "react-icons/cg";
import { resetModel, showPopup } from "../../context/StateManeger";
import Spinner from "../Others/Spinner";
import EnterVerificationCode from "./EnterVerificationCode";
import { handleApiError, makeRequest } from "../../utils";

const VerifyEmailBox = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [openEnterCode, setOpenEnterCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const sendVerificationCode = async () => {
    if (!currentUser || currentUser.emailVerified) {
      dispatch(
        showPopup({
          status: true,
          type: "ERROR_GENERAL",
          message: "sorry, Email already verified",
        })
      );
      return;
    }
    setLoading(true);
    try {
      await makeRequest.post(`api/auth/send-verification-email-code`, {
        FOR_CONSISTENCY: "FOR_CONSISTENCY",
      });
      setOpenEnterCode(true);
    } catch (error) {
      dispatch(
        showPopup({
          status: true,
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    } finally {
      setLoading(false);
    }
  };

  if (openEnterCode) {
    return <EnterVerificationCode />;
  }
  return (
    <div className="w-full h-[110px] p-4 flex flex-col  gap-3 bg-[#414368] rounded-md ">
      <div className="flex items-center justify-between">
        <h1 className="text-[#7bbe67] font-bold ">Send Verification Code To</h1>
        <button
          onClick={() => dispatch(resetModel())}
          className="text-xl rounded-lg"
        >
          <CgClose />
        </button>
      </div>
      <div className="flex items-center gap-5 w-full">
        <p className="text-[#c2a5a5] text-lg underline">{currentUser?.email}</p>
        <button
          onClick={sendVerificationCode}
          className="bg-[#93e672] w-[140px] sm:w-[80px]  text-blue-950 py-1 rounded-md flex items-center justify-center border border-[#9b4848]"
        >
          {loading ? (
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
