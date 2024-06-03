import { useEffect, useState } from "react";

const Timer = ({
  date,
  setRefresh,
}: {
  date: Date;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(date));
      if (
        timeLeft.days === 0 &&
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0
      ) {
        console.log("first");
        setRefresh((prev) => !prev);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  function calculateTimeLeft(startDate: Date) {
    const now = new Date();
    let timeDiff = startDate.getTime() - now.getTime();

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    timeDiff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    timeDiff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(timeDiff / (1000 * 60));
    timeDiff -= minutes * (1000 * 60);

    const seconds = Math.floor(timeDiff / 1000);

    return { days, hours, minutes, seconds };
  }

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
