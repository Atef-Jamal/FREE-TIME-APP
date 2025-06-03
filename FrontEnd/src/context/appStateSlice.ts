import { createSelector, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import type { IUser, IInitialState, IModal, IMusicInfo, IToast } from "../types";
import { RootState } from "./store";

const initialState: IInitialState = {
  currentUser: null,
  userAuth: "pending",
  isSignInMode: false,
  onlineUsers: [],
  socket: null,
  smallScreen: window.innerWidth < 1024,
  isChatOpen: Boolean(localStorage.getItem("isDesktopChatOpen")),
  unReadMsgsCount: [],
  activeChatId: localStorage.getItem("active-converstaion") || null,
  publicMsgNotify: false,
  openMusicModal: false,
  activeMusic: null,
  musicIsPlaying: false,
  sidebarCollapsed: window.innerWidth < 1400 ? true : false,
  hideLiveStats: false,
  toastNotify: { type: null, message: "" },
  modal: null,
};

interface ITogglActionPayload {
  entity:
    | "isSignInMode"
    | "smallScreen"
    | "hideLiveStats"
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
    updateCurrentUserStatus(state, action: PayloadAction<typeof state.userAuth>) {
      state.userAuth = action.payload;
    },
    setCurrentUser(state, action: PayloadAction<IUser>) {
      state.currentUser = action.payload;
    },
    updateThisEntity(state, action: PayloadAction<ITogglActionPayload>) {
      const { entity, value } = action.payload;
      state[entity] = value;
    },
    openToast(state, action: PayloadAction<IToast>) {
      state.toastNotify.message = action.payload.message;
      state.toastNotify.type = action.payload.type;
    },
    showModal(state, action: PayloadAction<IModal>) {
      state.modal = action.payload;
    },
    resetModel(state) {
      state.modal = null;
    },
    resetPopup(state) {
      state.toastNotify.type = null;
      state.toastNotify.message = null;
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
      state.publicMsgNotify = action.payload;
    },
    updateSidebarUnReadedMsgCount(state, action: PayloadAction<ISidbareUnreadedMsgs>) {
      const { type, userId } = action.payload;
      if (type === "ADD-ALL") {
        state.unReadMsgsCount = userId as string[];
      }
      if (type === "ADD-ONE") {
        state.unReadMsgsCount.push(userId as string);
      }
      if (type === "REMOVE-ONE") {
        state.unReadMsgsCount = state.unReadMsgsCount.filter((item) => item !== userId);
      }
      if (type === "REMOVE-ALL") {
        state.unReadMsgsCount = [];
      }
    },
    updateActiveChatId(state, action: PayloadAction<string | null>) {
      state.activeChatId = action.payload;
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
  updateActiveChatId,
  showModal,
  resetModel,
  updateThisEntity,
  setPublicMsgRedPoint,
} = appStateReducer.actions;

const selectState = (state: RootState) => state.appState;

export const selectCurrentUser = createSelector(selectState, ({ currentUser }) => currentUser);
export const selectUserAuth = createSelector(selectState, ({ userAuth }) => userAuth);
export const selectOnlineUsers = createSelector(selectState, ({ onlineUsers }) => onlineUsers);
export const selectSocket = createSelector(selectState, ({ socket }) => socket);
export const selectModal = createSelector(selectState, ({ modal }) => modal);
export const selectIsSignInMode = createSelector(selectState, ({ isSignInMode }) => isSignInMode);
export const selectIsChatOpen = createSelector(selectState, ({ isChatOpen }) => isChatOpen);
export const selectToastNotify = createSelector(selectState, ({ toastNotify }) => toastNotify);
export const selectActiveMusic = createSelector(selectState, ({ activeMusic }) => activeMusic);
export const selectMusicIsPlaying = createSelector(selectState, ({ musicIsPlaying }) => musicIsPlaying);
export const selectOpenMusicModal = createSelector(selectState, ({ openMusicModal }) => openMusicModal);
export const selectActiveChatId = createSelector(selectState, ({ activeChatId }) => activeChatId);
export const selectPublicMsgNotify = createSelector(selectState, ({ publicMsgNotify }) => publicMsgNotify);
export const selectUnReadMsgsCount = createSelector(selectState, ({ unReadMsgsCount }) => unReadMsgsCount);
export const selectHidenLiveStats = createSelector(selectState, ({ hideLiveStats }) => hideLiveStats);
export const selectSidebarCollapsed = createSelector(selectState, ({ sidebarCollapsed }) => sidebarCollapsed);
export const selectSmallScreen = createSelector(selectState, ({ smallScreen }) => smallScreen);

export default appStateReducer.reducer;
