import { useEffect, useState } from "react";
import { calculateTimeLeft } from "../../utils/common";

const Timer = ({
  date,
  handleUpdateNextTimerDay,
}: {
  date: Date;
  handleUpdateNextTimerDay: () => void;
}) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(date));
  // const hoursRef = useRef<HTMLSpanElement>(null);
  // const minutesRef = useRef<HTMLSpanElement>(null);
  // const secondRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // const initialTime = calculateTimeLeft(date);
    // hoursRef.current?.scrollBy({ top: 8 * 27 });
    // minutesRef.current?.scrollBy({ top: 0 * 27 });
    // secondRef.current?.scrollBy({ top: 0 * 27 });
    // hoursRef.current?.scrollBy({ top: initialTime.hours * 27 });
    // minutesRef.current?.scrollBy({ top: initialTime.hours * 27 });
    // secondRef.current?.scrollBy({ top: initialTime.seconds * 27 });
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
      handleUpdateNextTimerDay();
    }
  }, [timeLeft]);

  return (
    <span className="flex items-center justify-center h-[30px] overflow-hidden ">
      <span className="w-9 h-[30px]">
        <div
          style={{
            transform: `translatey(${34 * -timeLeft.hours}px)`,
          }}
          className="w-full transition-all duration-700 ease-out flex flex-col items-center gap-1"
        >
          {[...Array(25).keys()].map((item) => (
            <span
              key={item}
              className="flex items-center justify-center w-full min-h-[30px] text-[#e79349]"
            >
              {item <= 9 ? "0" + item : item}
            </span>
          ))}
        </div>
      </span>
      <span className="h-full">:</span>
      <span className="w-9 h-[30px]">
        <div
          style={{
            transform: `translatey(${34 * -timeLeft.minutes}px)`,
          }}
          className="w-full transition-all duration-700 ease-out flex flex-col items-center gap-1"
        >
          {[...Array(60).keys()].map((item) => (
            <span
              key={item}
              className="flex items-center justify-center w-full min-h-[30px]  text-[#e79349]"
            >
              {item <= 9 ? "0" + item : item}
            </span>
          ))}
        </div>
      </span>
      <span className="h-full">:</span>
      <span className="w-9 h-[30px]">
        <div
          style={{
            transform: `translatey(${34 * -timeLeft.seconds}px)`,
          }}
          className="w-full transition-all duration-700 ease-out flex flex-col items-center gap-1"
        >
          {[...Array(60).keys()].map((item) => (
            <span
              key={item}
              className="flex items-center justify-center w-full min-h-[30px]  text-[#e79349]"
            >
              {item <= 9 ? "0" + item : item}
            </span>
          ))}
        </div>
      </span>
    </span>
  );
};

export default Timer;
