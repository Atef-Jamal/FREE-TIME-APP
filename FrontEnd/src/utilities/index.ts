/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IFormData } from "../types/othersTypes";

interface IValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreePrivacy?: string;
  };
}

export const validateCredentials = (
  formData: IFormData,
  isSignIn: boolean,
  agreePrivacy: boolean,
): IValidationResult => {
  const errors: IValidationResult["errors"] = {};

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Email validation
  if (!formData.email || formData.email.trim().length === 0) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Email is invalid";
  }

  // Password validation
  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (isSignIn) return { isValid: Object.keys(errors).length === 0, errors };

  // Name validation
  if (!formData.name || formData.name.trim().length === 0) {
    errors.name = "Name is required";
  } else if (formData.name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (formData.name.length > 50) {
    errors.name = "Name cannot exceed 50 characters";
  }

  // Confirm password validation
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!agreePrivacy) {
    errors.agreePrivacy = "you must agree to the Privacy Policy and Terms of Service";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validation = (values: string[], signIn: boolean, agreePrivacy?: boolean) => {
  let result = `Must Be Exist-`;
  values.map((item, index) => {
    let name;
    if (index === 0) name = `${signIn ? "Email" : "Username"} `;
    if (index === 1) name = `${signIn ? "Password" : "Email"} `;
    if (index === 2) name = `Password `;
    if (index === 3) name = `Confirm Password `;
    return item.trim() === "" ? (result += name) : undefined;
  });
  if (values.every((item) => item.trim() !== "") && values[2] !== values[3])
    return (result = `Password doesn't Match`);
  if (values[0].length < 3 && !signIn) return (result = `name must be at least 3 character`);
  if (values[0].length > 17 && !signIn) return (result = `name must be less than 17 character`);
  if (!signIn) {
    if (!agreePrivacy && values.every((item) => item.trim() !== "")) {
      return (result = `must agree Privacy Policy and terms of service`);
    }
  }
  if (values.every((item) => item.trim() !== "")) {
    return (result = "");
  }
  return result.split("-").reverse().join("");
};

export const formateDate = (date: Date): string => {
  const now: Date = new Date();
  const past: Date = new Date(date);
  const diffInSeconds: number = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `just now`;
  }
  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  }
  if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / (60 * 60))} hours ago`;
  }
  if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / (60 * 60 * 24))} day ago`;
  }

  if (diffInSeconds < 2592000) {
    return `${Math.floor(diffInSeconds / (60 * 60 * 24 * 7))} week ago`;
  }
  if (diffInSeconds < 31536000) {
    return `${Math.floor(diffInSeconds / (60 * 60 * 24 * 7 * 4))} month ago`;
  }

  return `${Math.floor(diffInSeconds / (60 * 60 * 24 * 7 * 4 * 12))} years ago`;
};

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
  let errorMessage = "";
  if (error?.response.data?.error && typeof error.response.data.error === "string") {
    errorMessage = error.response.data.error;
  } else {
    errorMessage = "An unexpected Error occurred";
  }
  return errorMessage;
};

// export const debounce = (
//   func: (params: any) => void,
//   wait: number,
//   timoutRef: RefObject<NodeJS.Timeout | null>,
// ) => {
//   return (...arg: any) => {
//     if (timoutRef.current) clearTimeout(timoutRef.current);
//     timoutRef.current = setTimeout(() => {
//       func.apply(this, arg);
//     }, wait);
//   };
// };

type IDebouncedFunction<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void;

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
