/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type IDebouncedFunction<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void;

export function calculateTimeLeft(startDate: Date) {
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

export const handleApiError = (error: any) => {
  let errorMessage = "An unexpected Error occurred";
  if (error?.response.data?.error) {
    errorMessage = error.response.data.error;
  }
  return errorMessage;
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number = 300,
): IDebouncedFunction<T> => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const displaySound = (src: string) => {
  new Audio(src).play();
};
