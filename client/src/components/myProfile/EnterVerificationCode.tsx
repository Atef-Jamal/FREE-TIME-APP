import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../context/Hooks";
import { showPopup } from "../../context/StateManeger";
import { makeRequest } from "../../utils";

const EnterVerificationCode = () => {
  const [successfullyVerified, setSuccessfullyVerified] = useState(false);
  const [first, setFirst] = useState("");
  const [second, setSecod] = useState("");
  const [third, setThird] = useState("");
  const [fourt, setFourt] = useState("");

  const firstInput = useRef<HTMLInputElement>(null);
  const secondInput = useRef<HTMLInputElement>(null);
  const thirdInput = useRef<HTMLInputElement>(null);
  const fourtInput = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    firstInput.current?.focus();
  }, []);

  const handleVerify = async () => {
    const code = first + second + third + fourt;
    try {
      await makeRequest.post("api/auth/verifiyemail", { enteredCode: code });
      setSuccessfullyVerified(true);
    } catch (error) {
      console.log(error);
      dispatch(showPopup({ status: true, message: "an error occured" }));
    }
  };

  if (successfullyVerified) {
    return (
      <div className="w-full h-[70px] p-4 flex items-center justify-center text-xl text-[#a7f1b7]">
        successfully verified go to your notifications and collect the Reward
      </div>
    );
  }

  return (
    <div className="w-[500px] xs:w-[350px] p-4 bg-[#414368] rounded-md">
      <p className=" text-[#64e0a2] mx-2 font-bold">
        Your Verification code has been sent successfully, check your Email
      </p>
      <div className="flex items-center justify-center gap-4 mt-3 ">
        <input
          type="text"
          value={first}
          ref={firstInput}
          onChange={(e) => {
            if (e.target.value.length !== 1 && e.target.value.length !== 0) {
              return;
            } else {
              setFirst(e.target.value);
              if (e.target.value.length === 1) secondInput.current?.focus();
            }
          }}
          className="w-[35px] h-[40px] outline-none bg-[#442d2d] text-white p-[3px] rounded-sm text-center"
        />
        <input
          type="text"
          value={second}
          ref={secondInput}
          onChange={(e) => {
            if (e.target.value.length !== 1 && e.target.value.length !== 0) {
              console.log(e.target.value);
              return;
            } else {
              setSecod(e.target.value);
              if (e.target.value.length === 1) {
                thirdInput.current?.focus();
              } else if (e.target.value.length === 0) {
                firstInput.current?.focus();
              }
            }
          }}
          className="w-[35px] h-[40px] outline-none bg-[#442d2d] text-white p-[3px] rounded-sm text-center"
        />
        <input
          type="text"
          value={third}
          ref={thirdInput}
          onChange={(e) => {
            if (e.target.value.length !== 1 && e.target.value.length !== 0) {
              console.log(e.target.value);
              return;
            } else {
              setThird(e.target.value);
              if (e.target.value.length === 1) {
                fourtInput.current?.focus();
              } else if (e.target.value.length === 0) {
                secondInput.current?.focus();
              }
            }
          }}
          className="w-[35px] h-[40px] outline-none bg-[#442d2d] text-white p-[3px] rounded-sm text-center"
        />
        <input
          type="text"
          value={fourt}
          ref={fourtInput}
          onChange={(e) => {
            if (e.target.value.length !== 1 && e.target.value.length !== 0) {
              return;
            } else {
              setFourt(e.target.value);
              if (e.target.value.length === 0) {
                thirdInput.current?.focus();
              }
            }
          }}
          className="w-[35px] h-[40px] outline-none bg-[#442d2d] text-white p-[3px] rounded-sm text-center"
        />
        <button
          onClick={handleVerify}
          className="bg-[#59e97dee] text-blue-900 py-2 px-4 font-bold"
        >
          Verify
        </button>
      </div>
      <p className="text-sm font-bold text-[#cec1c1ee] flex items-center gap-4 mt-4">
        Don't have Code
        <button
          onClick={() => {}}
          className="underline font-bold text-[#7bc44b]"
        >
          Resend
        </button>
      </p>
    </div>
  );
};
export default EnterVerificationCode;
