import { useEffect, useState } from "react";
import { calculateTimeLeft } from "../../utils/common";

const Timer = ({
  date,
  setIsActive,
}: {
  date: Date;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(date));
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  useEffect(() => {
    if (
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0
    ) {
      setIsActive(true);
    }
  }, [timeLeft]);
  return (
    <span className="flex items-center justify-center gap-1">
      <span className="w-7 text-[#e79349]">
        {timeLeft.hours > 9 ? timeLeft.hours : "0" + timeLeft.hours}
      </span>
      :
      <span className="w-7 text-[#e79349]">
        {timeLeft.minutes > 9 ? timeLeft.minutes : "0" + timeLeft.minutes}
      </span>
      :
      <span className="w-7 text-[#e79349]">
        {timeLeft.seconds > 9 ? timeLeft.seconds : "0" + timeLeft.seconds}
      </span>
    </span>
  );
};

export default Timer;
