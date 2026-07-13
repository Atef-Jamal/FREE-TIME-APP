import { AuthFormValues } from "../lib/zod";
import { IUser } from "./user";
import { Dispatch, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";

export interface IToast {
  type: "ERROR_GENERAL" | "ERROR_LOCK" | "SUCESS" | "LOADING" | null;
  message: string | null;
  time?: number;
}

export interface IMusicInfo {
  id: string;
  artist: string;
  cover: string;
  title: string;
}

export type IModal =
  | "register-modal"
  | "search-modal"
  | "apply-bonus-code-modal"
  | "notifications-modal"
  | "profile-setting-modal"
  | null;

export interface IInitialState {
  userAuth: "pending" | "authenticated" | "unauthenticated";
  currentUser: IUser | null;
  isChatOpen: boolean;
  isSignInMode: boolean;
  mobileScreen: boolean;
  toastNotify: IToast;
  sidebarCollapsed: boolean;
  hideLiveStats: boolean;
  openMusicModal: boolean;
  musicIsPlaying: boolean;
  activeMusic: IMusicInfo | null;
  secondUserId: string | null;
  modal: IModal;
  publicMsgNotify: boolean;
}

export interface ITogglActionPayload {
  entity: keyof Pick<
    IInitialState,
    | "isSignInMode"
    | "mobileScreen"
    | "hideLiveStats"
    | "isChatOpen"
    | "sidebarCollapsed"
    | "openMusicModal"
    | "musicIsPlaying"
  >;
  value: boolean;
}

export type IDispatch = ThunkDispatch<
  {
    appState: IInitialState;
  },
  undefined,
  UnknownAction
> &
  Dispatch<UnknownAction>;

export interface IRegisterProps {
  data: AuthFormValues;
  referrerUser?: string;
}

export interface ILoginProps {
  data: Omit<AuthFormValues, "name" | "confirmPassword" | "profilePicture">;
}
