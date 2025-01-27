import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../context/hooks";
import { openToast } from "../../context/appStateSlice";
import { sendVerificationCode, verifyMyEmail } from "../../services";
import { handleApiError } from "../../utilities";

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
        openToast({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        }),
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
        openToast({
          message: "Resended successfully, check your email box",
          type: "SUCESS",
        }),
      );
    } catch (error) {
      dispatch(
        openToast({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        }),
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
      <div className="mx-2 flex h-[70px] w-[95%] max-w-[600px] items-center justify-center rounded-lg bg-[#433175] p-4 text-center text-sm text-[#a7f1b7] md:text-xl">
        successfully verified go to your notifications and collect the Reward
      </div>
    );
  }

  return (
    <div className="w-[95%] max-w-[500px] rounded-md bg-[#213743] p-2 md:p-4">
      <p className="mx-2 text-sm text-[#64e0a2] md:text-base">
        Your Verification code has been sent successfully, check your Email
      </p>
      <div className="mt-3 flex items-center justify-center gap-3">
        <input
          type="text"
          value={first}
          ref={firstInput}
          onChange={handleChangeFirstInput}
          className="h-[30px] w-[40px] rounded-sm bg-[#292525] p-[3px] text-center text-white outline-none"
        />
        <input
          type="text"
          value={second}
          ref={secondInput}
          onChange={handleChangeSecondInput}
          className="h-[30px] w-[40px] rounded-sm bg-[#292525] p-[3px] text-center text-white outline-none"
        />
        <input
          type="text"
          value={third}
          ref={thirdInput}
          onChange={handleChangeThirdInput}
          className="h-[30px] w-[40px] rounded-sm bg-[#292525] p-[3px] text-center text-white outline-none"
        />
        <input
          type="text"
          value={fourt}
          ref={fourtInput}
          onChange={handleChangeFourtInput}
          className="h-[30px] w-[40px] rounded-sm bg-[#292525] p-[3px] text-center text-white outline-none"
        />
        <button
          onClick={handleVerify}
          className="ml-auto bg-[#59e97dee] px-4 py-1 text-sm font-bold text-[#25223f]"
        >
          Verify
        </button>
      </div>
      <p className="mt-4 flex items-center gap-4 text-sm text-[#cec1c1ee]">
        Don't have Code
        <button onClick={handleResend} className="text-sm font-bold text-[#7bc44b] underline">
          {reSending ? "Resending..." : "Resend"}
        </button>
      </p>
    </div>
  );
};
export default EnterVerificationCode;
