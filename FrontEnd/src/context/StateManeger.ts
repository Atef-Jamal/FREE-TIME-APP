import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { TypeInitialState, TypeMusicInfo, TypePopup } from "../types/reduxTypes";
import { User } from "../types/userTypes";

const initialState: TypeInitialState = {
  currentUserStatus: "pending",
  currentUser: null,
  isCurrentUserReqFinished: false,
  openNotification: false,
  ToastNotify: {
    type: null,
    message: "",
  },
  isChatOpen: Boolean(localStorage.getItem("isDesktopChatOpen")),
  isSignInMode: false,
  isMobile: window.innerWidth <= 867,
  openSidebarMobile: false,
  resizeSidebare: window.innerWidth < 1300 ? true : false,
  hiddenLiveStats: false,
  openMusicModal: false,
  musicIsPlaying: false,
  activeMusic: {
    audio: new Audio(),
    musicInfo: null,
  },
  socket: null,
  onlineUsers: [],
  allUnReadedMesseges: [],
  activeConversation: localStorage.getItem("active-converstaion") || null,
  model: { status: false, children: null },
  publicMsgRedPoint: false,
};

export interface TypeTogglActionPayload {
  entity:
    | "openNotification"
    | "isSignInMode"
    | "isMobile"
    | "hiddenLiveStats"
    | "isChatOpen"
    | "openSidebarMobile"
    | "resizeSidebare"
    | "openMusicModal"
    | "musicIsPlaying";
  value: boolean;
}

interface TypeSidbareUnreadedMsgs {
  type: "ADD-ALL" | "ADD-ONE" | "REMOVE-ONE" | "REMOVE-ALL";
  userId?: string | string[];
}

const StateManegerSlice = createSlice({
  name: "stateManeger",
  initialState,
  reducers: {
    updateCurrentUserStatus(state, action: PayloadAction<typeof state.currentUserStatus>) {
      state.currentUserStatus = action.payload;
    },
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    updateThisEntity(state, action: PayloadAction<TypeTogglActionPayload>) {
      const { entity, value } = action.payload;
      state[entity] = value;
    },
    setCurrentAccountRequestFullfiled(state, action: PayloadAction<boolean>) {
      state.isCurrentUserReqFinished = action.payload;
    },
    showPopup(state, action: PayloadAction<TypePopup>) {
      state.ToastNotify.message = action.payload.message;
      state.ToastNotify.type = action.payload.type;
    },
    openModel(state, action: PayloadAction<{ status: boolean; children: React.ReactNode }>) {
      state.model.status = true;
      state.model.children = action.payload.children;
    },
    resetModel(state) {
      state.model.status = false;
      state.model.children = null;
    },
    resetPopup(state) {
      state.ToastNotify.type = null;
      state.ToastNotify.message = null;
    },
    handleAddMusic(state, action: PayloadAction<TypeMusicInfo>) {
      state.activeMusic.audio.src = action.payload.musicSrc;
      state.activeMusic.musicInfo = action.payload;
      state.activeMusic.audio.play();
      state.musicIsPlaying = true;
    },
    handleCloseMusic(state) {
      state.activeMusic.audio.src = "";
      state.activeMusic.musicInfo = null;
      state.musicIsPlaying = false;
    },
    handlePlayMusic(state) {
      state.activeMusic.audio.play();
      state.musicIsPlaying = true;
    },
    handlePauseMusic(state) {
      state.activeMusic.audio.pause();
      state.musicIsPlaying = false;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSocet(state, action: PayloadAction<any>) {
      state.socket = action.payload;
    },
    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },
    setPublicMsgRedPoint(state, action: PayloadAction<boolean>) {
      state.publicMsgRedPoint = action.payload;
    },
    updateSidebarUnReadedMsgCount(state, action: PayloadAction<TypeSidbareUnreadedMsgs>) {
      const { type, userId } = action.payload;
      if (type === "ADD-ALL") {
        state.allUnReadedMesseges = userId as string[];
      }
      if (type === "ADD-ONE") {
        state.allUnReadedMesseges.push(userId as string);
      }
      if (type === "REMOVE-ONE") {
        state.allUnReadedMesseges = state.allUnReadedMesseges.filter((item) => item !== userId);
      }
      if (type === "REMOVE-ALL") {
        state.allUnReadedMesseges = [];
      }
    },
    setActiveConversation(state, action: PayloadAction<string | null>) {
      state.activeConversation = action.payload;
    },
  },
});

export const {
  updateCurrentUserStatus,
  setCurrentUser,
  setCurrentAccountRequestFullfiled,
  showPopup,
  resetPopup,
  handleAddMusic,
  handleCloseMusic,
  handlePlayMusic,
  handlePauseMusic,
  setSocet,
  setOnlineUsers,
  updateSidebarUnReadedMsgCount,
  setActiveConversation,
  openModel,
  resetModel,
  updateThisEntity,
  setPublicMsgRedPoint,
} = StateManegerSlice.actions;

export default StateManegerSlice;
