import { Socket } from "socket.io-client";
import { User } from "./user";

export interface TypePopup {
  status: boolean;
  type: "ERROR_GENERAL" | "ERROR_LOCK" | "SUCESS" | "LOADING" | null;
  message: string;
}

export interface TypeInitialState {
  currentUser: User | null;
  currentUserIsLoading: boolean;
  currentUserIsFetched: boolean;
  openRegisterForm: boolean;
  openNotification: boolean;
  isChatOpen: boolean;
  isSignIn: boolean;
  openSidebarMobile: boolean;
  openPopup: TypePopup;
  resizeSidebare: boolean;
  hiddenLiveStats: boolean;
  openMusicModal: boolean;
  isPlaying: boolean;
  allMusics: any[];
  currentSong: {
    artist: { name: string };
    id: string;
    title: string;
    album: { cover: string };
  } | null;
  socet: Socket | null;
  onlineUsers: string[];
  reFetchThisUserId: string;
  allUnReadedMesseges: string[];
  model: { status: boolean; children: React.ReactNode };
}
