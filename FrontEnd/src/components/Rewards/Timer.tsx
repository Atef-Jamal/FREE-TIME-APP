import { useEffect, useState } from "react";
import { useAppSelector } from "../../context/Hooks";
import { calculateTimeLeft } from "../../utils/common";

const Timer = ({
  date,
  setDayWhichTimmerIsLocated,
}: {
  date: Date;
  setDayWhichTimmerIsLocated: React.Dispatch<React.SetStateAction<Date | null>>;
}) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(date));
      if (
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0
      ) {
        const nearstNexttDay = currentUser?.dailyReward.find(
          (item) => new Date(item.availableAt) > date
        );
        if (nearstNexttDay) {
          setDayWhichTimmerIsLocated(nearstNexttDay.availableAt);
        } else {
          setDayWhichTimmerIsLocated(null);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

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
