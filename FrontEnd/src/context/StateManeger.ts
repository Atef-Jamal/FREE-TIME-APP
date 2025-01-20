import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { IInitialState, IMusicInfo, IToast } from "../types/reduxTypes";
import { IUser } from "../types/userTypes";

const initialState: IInitialState = {
  currentUserStatus: "pending",
  currentUser: null,
  openNotification: false,
  ToastNotify: {
    type: null,
    message: "",
  },
  isChatOpen: Boolean(localStorage.getItem("isDesktopChatOpen")),
  isSignInMode: false,
  smallScreen: window.innerWidth < 1024,
  openSidebarMobile: false,
  sidebarCollapsed: window.innerWidth < 1400 ? true : false,
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

interface ITogglActionPayload {
  entity:
    | "openNotification"
    | "isSignInMode"
    | "smallScreen"
    | "hiddenLiveStats"
    | "isChatOpen"
    | "openSidebarMobile"
    | "sidebarCollapsed"
    | "openMusicModal"
    | "musicIsPlaying";
  value: boolean;
}

interface ISidbareUnreadedMsgs {
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
    setCurrentUser(state, action: PayloadAction<IUser>) {
      state.currentUser = action.payload;
    },
    updateThisEntity(state, action: PayloadAction<ITogglActionPayload>) {
      const { entity, value } = action.payload;
      state[entity] = value;
    },
    showPopup(state, action: PayloadAction<IToast>) {
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
    handleAddMusic(state, action: PayloadAction<IMusicInfo>) {
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
    updateSidebarUnReadedMsgCount(state, action: PayloadAction<ISidbareUnreadedMsgs>) {
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
