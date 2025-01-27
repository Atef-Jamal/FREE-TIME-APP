import { useEffect, useState } from "react";
import { calculateTimeLeft } from "../../utilities";

interface IProps {
  date: Date;
  handleUpdateNextTimerDay: () => void;
}

const Timer = ({ date, handleUpdateNextTimerDay }: IProps) => {
  const calcTimeLeft = calculateTimeLeft(date);
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(date));
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  useEffect(() => {
    if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
      handleUpdateNextTimerDay();
    }
  }, [timeLeft, handleUpdateNextTimerDay]);

  return (
    <span className="flex h-[30px] items-center justify-center overflow-hidden">
      <span className="h-[30px] w-9">
        <div
          style={{
            transform: `translatey(${34 * -timeLeft.hours}px)`,
          }}
          className="flex w-full flex-col items-center gap-1 transition-all duration-700 ease-out"
        >
          {[...Array(25).keys()].map((item) => (
            <span key={item} className="flex min-h-[30px] w-full items-center justify-center text-[#e79349]">
              {item <= 9 ? "0" + item : item}
            </span>
          ))}
        </div>
      </span>
      <span className="h-full pt-[2px]">:</span>
      <span className="h-[30px] w-9">
        <div
          style={{
            transform: `translatey(${34 * -timeLeft.minutes}px)`,
          }}
          className="flex w-full flex-col items-center gap-1 transition-all duration-700 ease-out"
        >
          {[...Array(60).keys()].map((item) => (
            <span key={item} className="flex min-h-[30px] w-full items-center justify-center text-[#e79349]">
              {item <= 9 ? "0" + item : item}
            </span>
          ))}
        </div>
      </span>
      <span className="h-full pt-[2px]">:</span>
      <span className="h-[30px] w-9">
        <div
          style={{
            transform: `translatey(${34 * -timeLeft.seconds}px)`,
          }}
          className="flex w-full flex-col items-center gap-1 transition-all duration-700 ease-out"
        >
          {[...Array(60).keys()].map((item) => (
            <span key={item} className="flex min-h-[30px] w-full items-center justify-center text-[#e79349]">
              {item <= 9 ? "0" + item : item}
            </span>
          ))}
        </div>
      </span>
    </span>
  );
};

export default Timer;
