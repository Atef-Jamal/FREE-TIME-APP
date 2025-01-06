import { Socket } from "socket.io-client";
import { User } from "./userTypes";
import { Dispatch, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { TypeFormData } from "./othersTypes";

export interface TypePopup {
  type: "ERROR_GENERAL" | "ERROR_LOCK" | "SUCESS" | "LOADING" | null;
  message: string | null;
  time?: number;
}

export interface TypeMusicInfo {
  id: string;
  artist: string;
  cover: string;
  title: string;
  musicSrc: string;
}

export interface TypeInitialState {
  currentUserStatus: "pending" | "authenticated" | "unauthenticated";
  currentUser: User | null;
  openNotification: boolean;
  isChatOpen: boolean;
  isSignInMode: boolean;
  openSidebarMobile: boolean;
  isMobile: boolean;
  ToastNotify: TypePopup;
  resizeSidebare: boolean;
  hiddenLiveStats: boolean;
  openMusicModal: boolean;
  musicIsPlaying: boolean;
  activeMusic: {
    audio: HTMLAudioElement;
    musicInfo: TypeMusicInfo | null;
  };
  socket: Socket | null;
  onlineUsers: string[];
  allUnReadedMesseges: string[];
  activeConversation: string | null;
  model: { status: boolean; children: React.ReactNode };
  publicMsgRedPoint: boolean;
}

export type TypeDispatch = ThunkDispatch<
  {
    stateManeger: TypeInitialState;
  },
  undefined,
  UnknownAction
> &
  Dispatch<UnknownAction>;

export interface TypeRegisterProps {
  formData: TypeFormData;
  dispatch: TypeDispatch;
  referrerUser?: string | null;
}
export interface TypeLoginProps {
  formData: Omit<TypeFormData, "name" | "confirmPassword" | "profilePicture">;
  dispatch: TypeDispatch;
}
