import { Dispatch, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { IMusicInfo } from "../features/musics/types";
import { IUser } from "../features/user/types";
import { IToast } from "../components/Shared/Toast";
import { IModal } from "../components/Shared/Modal";
import { Socket } from "socket.io-client";

export interface IInitialState {
  userAuth: "pending" | "authenticated" | "unauthenticated";
  currentUser: IUser | null;
  isChatOpen: boolean;
  isSignInMode: boolean;
  mobileScreen: boolean;
  toastNotify: IToast;
  socket: Socket | null;
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
