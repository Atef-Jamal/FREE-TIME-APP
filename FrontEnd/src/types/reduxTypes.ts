import { Socket } from "socket.io-client";
import { IUser } from "./userTypes";
import { Dispatch, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { IFormData } from "./othersTypes";

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
  smallScreen: boolean;
  toastNotify: IToast;
  sidebarCollapsed: boolean;
  hideLiveStats: boolean;
  openMusicModal: boolean;
  musicIsPlaying: boolean;
  activeMusic: IMusicInfo | null;
  socket: Socket | null;
  onlineUsers: string[];
  activeChatId: string | null;
  modal: IModal;
  publicMsgNotify: boolean;
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
  formData: IFormData;
  dispatch: IDispatch;
  referrerUser?: string | null;
}

export interface ILoginProps {
  formData: Omit<IFormData, "name" | "confirmPassword" | "profilePicture">;
  dispatch: IDispatch;
}
