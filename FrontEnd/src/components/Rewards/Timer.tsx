import { useEffect, useState } from "react";
import { calculateTimeLeft } from "../../utils/common";

const Timer = ({
  date,
  setIsActive,
  dayWhichTimmerIsLocated,
  setDayWhichTimmerIsLocated,
}: {
  date: Date;
  dayWhichTimmerIsLocated: string | null;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  setDayWhichTimmerIsLocated: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(date));
  const [helper, setHelper] = useState(false);

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
      setHelper((prev) => !prev);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (helper && dayWhichTimmerIsLocated) {
      // const copied = new Date(dayWhichTimmerIsLocated);
      // const nextDay = new Date(copied.setDate(copied.getDate() + 1));

      // setDayWhichTimmerIsLocated(nextDay.toISOString());
      setDayWhichTimmerIsLocated("2024-06-08T00:00:00.000Z");
    }
  }, [helper]);

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
