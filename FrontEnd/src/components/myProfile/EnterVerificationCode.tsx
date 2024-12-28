import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../context/Hooks";
import { showPopup } from "../../context/StateManeger";
import { sendVerificationCode, verifyMyEmail } from "../../utils";
import { handleApiError } from "../../utils/common";
import { useMutation } from "@tanstack/react-query";

const EnterVerificationCode = () => {
  const [successfullyVerified, setSuccessfullyVerified] = useState(false);
  const [reSending, setResending] = useState(false);
  const [first, setFirst] = useState("");
  const [second, setSecod] = useState("");
  const [third, setThird] = useState("");
  const [fourt, setFourt] = useState("");

  const firstInput = useRef<HTMLInputElement>(null);
  const secondInput = useRef<HTMLInputElement>(null);
  const thirdInput = useRef<HTMLInputElement>(null);
  const fourtInput = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleChangeFirstInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 1) {
      return;
    } else {
      setFirst(e.target.value);
      if (e.target.value.length === 1) secondInput.current?.focus();
    }
  };

  const handleChangeSecondInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 1) {
      return;
    } else {
      setSecod(e.target.value);
      if (e.target.value.length === 1) {
        thirdInput.current?.focus();
      } else if (e.target.value.length === 0) {
        firstInput.current?.focus();
      }
    }
  };
  const handleChangeThirdInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 1) {
      return;
    } else {
      setThird(e.target.value);
      if (e.target.value.length === 1) {
        fourtInput.current?.focus();
      } else if (e.target.value.length === 0) {
        secondInput.current?.focus();
      }
    }
  };
  const handleChangeFourtInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 1) {
      return;
    } else {
      setFourt(e.target.value);
      if (e.target.value.length === 0) {
        thirdInput.current?.focus();
      }
    }
  };

  const mutation = useMutation({
    mutationFn: verifyMyEmail,
    onSuccess: () => {
      setSuccessfullyVerified(true);
    },
    onError: (error) => {
      dispatch(
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        })
      );
    },
  });

  const handleVerify = async () => {
    const enteredCode = first + second + third + fourt;
    mutation.mutate({ enteredCode });
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await sendVerificationCode();
      dispatch(
        showPopup({
          message: "Resended successfully, check your email box",
          type: "SUCESS",
        })
      );
    } catch (error) {
      dispatch(
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        })
      );
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    firstInput.current?.focus();
  }, []);

  if (successfullyVerified) {
    return (
      <div className="w-full xs:w-[95%] sm:text-sm mx-2 h-[70px] p-4 flex items-center justify-center text-xl text-[#a7f1b7] bg-[#433175] text-center rounded-lg">
        successfully verified go to your notifications and collect the Reward
      </div>
    );
  }

  return (
    <div className="w-[500px] xs:w-[350px] p-4 bg-[#213743] rounded-md">
      <p className=" text-[#64e0a2] mx-2 font-bold">
        Your Verification code has been sent successfully, check your Email
      </p>
      <div className="flex items-center justify-center gap-4 mt-3 ">
        <input
          type="text"
          value={first}
          ref={firstInput}
          onChange={handleChangeFirstInput}
          className="w-[40px] h-[40px] outline-none bg-[#292525] text-white p-[3px] rounded-sm text-center"
        />
        <input
          type="text"
          value={second}
          ref={secondInput}
          onChange={handleChangeSecondInput}
          className="w-[40px] h-[40px] outline-none bg-[#292525] text-white p-[3px] rounded-sm text-center"
        />
        <input
          type="text"
          value={third}
          ref={thirdInput}
          onChange={handleChangeThirdInput}
          className="w-[40px] h-[40px] outline-none bg-[#292525] text-white p-[3px] rounded-sm text-center"
        />
        <input
          type="text"
          value={fourt}
          ref={fourtInput}
          onChange={handleChangeFourtInput}
          className="w-[40px] h-[40px] outline-none bg-[#292525] text-white p-[3px] rounded-sm text-center"
        />
        <button
          onClick={handleVerify}
          className="bg-[#59e97dee] text-[#25223f] py-2 px-4 font-bold"
        >
          Verify
        </button>
      </div>
      <p className="text-sm font-bold text-[#cec1c1ee] flex items-center gap-4 mt-4">
        Don't have Code
        <button
          onClick={handleResend}
          className="underline font-bold text-[#7bc44b]"
        >
          {reSending ? "Resending..." : "Resend"}
        </button>
      </p>
    </div>
  );
};
export default EnterVerificationCode;
