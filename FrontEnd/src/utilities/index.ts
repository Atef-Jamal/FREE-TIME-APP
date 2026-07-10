/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { IFormData } from "../types";
import axios from "axios";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// export const loginSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
// });

// export const signupSchema = z
//   .object({
//     name: z.string().min(3, "Name must be at least 3 characters"),
//     email: z.string().email("Invalid email address"),
//     password: z.string().min(8, "Password must be at least 8 characters"),
//     confirmPassword: z.string(),
//     profilePicture: z
//       .any()
//       .optional()
//       .refine((file) => {
//         if (!file[0]) return true;
//         return file[0].size <= MAX_FILE_SIZE;
//       }, "Max image size is 2MB.")
//       .refine((file) => {
//         if (!file[0]) return true;
//         return ACCEPTED_IMAGE_TYPES.includes(file[0].type);
//       }, "Only .jpg, .png, and .webp formats are supported."),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

const baseSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const authSchema = z.discriminatedUnion("mode", [
  // Login State
  baseSchema.extend({
    mode: z.literal("login"),
  }),

  // Register State
  baseSchema
    .extend({
      mode: z.literal("register"),
      name: z.string().min(3, "Name must be at least 3 characters"),
      confirmPassword: z.string(),
      profilePicture: z
        .any()
        .optional()
        .refine((file) => {
          if (!file[0]) return true;
          return file[0].size <= MAX_FILE_SIZE;
        }, "Max image size is 2MB.")
        .refine((file) => {
          if (!file[0]) return true;
          return ACCEPTED_IMAGE_TYPES.includes(file[0].type);
        }, "Only .jpg, .png, and .webp formats are supported."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"], // Directs the error to the confirmPassword field
    }),
]);

export type AuthFormValues = z.infer<typeof authSchema>;

// export type SignupFormData = z.infer<typeof signupSchema>;
// export type LoginFormData = z.infer<typeof loginSchema>;

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

export const axiosRequest = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        return axiosRequest(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("isLoggedIn");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

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
  let errorMessage = "An unexpected Error occurred";
  if (error?.response.data?.error) {
    errorMessage = error.response.data.error;
  }
  return errorMessage;
};

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

export const displaySound = (src: string) => {
  new Audio(src).play();
};
