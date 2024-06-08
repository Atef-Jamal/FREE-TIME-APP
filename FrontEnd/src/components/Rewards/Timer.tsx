import { useEffect, useState } from "react";
import { calculateTimeLeft } from "../../utils/common";
// import { useAppSelector } from "../../context/Hooks";

const Timer = ({
  date,
  setIsActive,
  setDayWhichTimmerIsLocated,
}: {
  date: Date;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  setDayWhichTimmerIsLocated: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}) => {
  // const { currentUser } = useAppSelector((state) => state.stateManeger);
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
    if (helper) {
      // const nearestNextDay = currentUser?.dailyReward.find(
      //   (item) => item.availableAt > date.toISOString()
      // );
      const copied = new Date(date);
      const nextDay = new Date(copied.setDate(copied.getDay() + 3));

      // if (nearestNextDay) {
      setDayWhichTimmerIsLocated(nextDay.toISOString());
      // }
    }
  }, [helper]);

  // console.log("old", new Date(date.setHours(0, 0, 0, 0)));
  // console.log(
  //   "new",
  //   new Date(new Date(copied.setDate(copied.getDay() + 3)).setHours(0, 0, 0, 0))
  // );
  // console.log(date.toISOString());

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
