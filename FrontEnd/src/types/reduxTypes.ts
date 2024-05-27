import { Socket } from "socket.io-client";
import { User } from "./userTypes";

export interface TypePopup {
  type: "ERROR_GENERAL" | "ERROR_LOCK" | "SUCESS" | "LOADING" | null;
  message: string | null;
}

export interface TypeMusicInfo {
  id: string;
  artist: string;
  cover: string;
  title: string;
  musicSrc: string;
}

export interface TypeInitialState {
  currentUser: User | null;
  currentUserIsLoading: boolean;
  currentAccountRequestFullfiled: boolean;
  openRegisterForm: boolean;
  openNotification: boolean;
  isChatOpen: boolean;
  isSignInMode: boolean;
  openSidebarMobile: boolean;
  openPopup: TypePopup;
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
  reFetchThisUserId: string;
  allUnReadedMesseges: string[];
  model: { status: boolean; children: React.ReactNode };
}
