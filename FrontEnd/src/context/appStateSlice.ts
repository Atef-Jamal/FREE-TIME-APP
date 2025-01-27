import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { IInitialState, IModal, IMusicInfo, IToast } from "../types/reduxTypes";
import { IUser } from "../types/userTypes";

const initialState: IInitialState = {
  currentUser: null,
  currentUserStatus: "pending",
  isSignInMode: false,
  onlineUsers: [],
  socket: null,
  smallScreen: window.innerWidth < 1024,
  isChatOpen: Boolean(localStorage.getItem("isDesktopChatOpen")),
  allUnReadedMesseges: [],
  activeConversation: localStorage.getItem("active-converstaion") || null,
  publicMsgRedPoint: false,
  openMusicModal: false,
  activeMusic: null,
  musicIsPlaying: false,
  sidebarCollapsed: window.innerWidth < 1400 ? true : false,
  hiddenLiveStats: false,
  ToastNotify: { type: null, message: "" },
  modal: null,
};

interface ITogglActionPayload {
  entity:
    | "isSignInMode"
    | "smallScreen"
    | "hiddenLiveStats"
    | "isChatOpen"
    | "sidebarCollapsed"
    | "openMusicModal"
    | "musicIsPlaying";
  value: boolean;
}

interface ISidbareUnreadedMsgs {
  type: "ADD-ALL" | "ADD-ONE" | "REMOVE-ALL" | "REMOVE-ONE";
  userId?: string | string[];
}

const appStateReducer = createSlice({
  name: "appState",
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
    openToast(state, action: PayloadAction<IToast>) {
      state.ToastNotify.message = action.payload.message;
      state.ToastNotify.type = action.payload.type;
    },
    showModal(state, action: PayloadAction<IModal>) {
      state.modal = action.payload;
    },
    resetModel(state) {
      state.modal = null;
    },
    resetPopup(state) {
      state.ToastNotify.type = null;
      state.ToastNotify.message = null;
    },
    handleAddMusic(state, action: PayloadAction<IMusicInfo>) {
      state.activeMusic = action.payload;
      state.musicIsPlaying = true;
    },
    handleCloseMusic(state) {
      state.activeMusic = null;
      state.musicIsPlaying = false;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSocket(state, action: PayloadAction<any>) {
      state.socket = action.payload;
    },
    disconnectSocket(state) {
      if (state.socket) state.socket.disconnect();
      state.socket = null;
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
  openToast,
  resetPopup,
  handleAddMusic,
  handleCloseMusic,
  setSocket,
  disconnectSocket,
  setOnlineUsers,
  updateSidebarUnReadedMsgCount,
  setActiveConversation,
  showModal,
  resetModel,
  updateThisEntity,
  setPublicMsgRedPoint,
} = appStateReducer.actions;

export default appStateReducer.reducer;
