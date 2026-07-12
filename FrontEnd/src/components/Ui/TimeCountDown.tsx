import { useState, useEffect } from "react";

interface RelativeCountdownProps {
  targetIsoString: Date;
}

export default function RelativeCountdown({ targetIsoString }: RelativeCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("Calculating...");

  useEffect(() => {
    const targetDate: Date = new Date(targetIsoString);

    const calculateTime = (): string => {
      const now: Date = new Date();
      const difference: number = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        const absDiff: number = Math.abs(difference);
        const secondsAgo: number = Math.floor(absDiff / 1000);
        const minutesAgo: number = Math.floor(secondsAgo / 60);
        const hoursAgo: number = Math.floor(minutesAgo / 60);

        if (secondsAgo < 60) return "just now";
        if (minutesAgo < 60) return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
        return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
      }

      const days: number = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours: number = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes: number = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds: number = Math.floor((difference % (1000 * 60)) / 1000);

      const parts: string[] = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      return `${parts.join(" ")} left`;
    };

    setTimeLeft(calculateTime());

    const intervalId: NodeJS.Timeout = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 10000);

    return () => clearInterval(intervalId);
  }, [targetIsoString]);

  return <span className="-mt-[2px] text-[0.7rem] font-bold text-[#746767] sm:text-xs">{timeLeft}</span>;
}
