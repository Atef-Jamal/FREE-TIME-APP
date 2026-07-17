import { createSelector, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import type { IInitialState, ITogglActionPayload } from "./types";
import { RootState } from "./store";
import { IMusicInfo } from "../features/musics/types";
import { IUser } from "../features/user/types";
import { IToast } from "../components/Shared/Toast";
import { IModal } from "../components/Shared/Modal";

const hasAccessToken = !!localStorage.getItem("isLoggedIn");

const initialState: IInitialState = {
  currentUser: null,
  userAuth: hasAccessToken ? "pending" : "unauthenticated",
  isSignInMode: false,
  mobileScreen: window.innerWidth < 1024,
  isChatOpen: Boolean(localStorage.getItem("isDesktopChatOpen")),
  secondUserId: localStorage.getItem("activeChatSecondUserId") || null,
  publicMsgNotify: false,
  socket: null,
  openMusicModal: false,
  activeMusic: null,
  musicIsPlaying: false,
  sidebarCollapsed: window.innerWidth < 1400 ? true : false,
  hideLiveStats: false,
  toastNotify: { type: null, message: "" },
  modal: null,
};

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
    updateStateField(state, action: PayloadAction<ITogglActionPayload>) {
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
    setSocket(state, action: PayloadAction<any>) {
      state.socket = action.payload;
    },
    handleAddMusic(state, action: PayloadAction<IMusicInfo>) {
      state.activeMusic = action.payload;
      state.musicIsPlaying = true;
    },
    handleCloseMusic(state) {
      state.activeMusic = null;
      state.musicIsPlaying = false;
    },
    setPublicMsgRedPoint(state, action: PayloadAction<boolean>) {
      state.publicMsgNotify = action.payload;
    },
    updateActiveChatId(state, action: PayloadAction<string | null>) {
      state.secondUserId = action.payload;
    },
  },
});

export const {
  updateCurrentUserStatus,
  setCurrentUser,
  openToast,
  resetPopup,
  handleAddMusic,
  setSocket,
  handleCloseMusic,
  updateActiveChatId,
  showModal,
  resetModel,
  updateStateField,
  setPublicMsgRedPoint,
} = appStateReducer.actions;

const selectState = (state: RootState) => state.appState;

export const selectCurrentUser = createSelector(selectState, ({ currentUser }) => currentUser);
export const selectUserAuth = createSelector(selectState, ({ userAuth }) => userAuth);
export const selectModal = createSelector(selectState, ({ modal }) => modal);
export const selectIsSignInMode = createSelector(selectState, ({ isSignInMode }) => isSignInMode);
export const selectSocket = createSelector(selectState, ({ socket }) => socket);
export const selectIsChatOpen = createSelector(selectState, ({ isChatOpen }) => isChatOpen);
export const selectToastNotify = createSelector(selectState, ({ toastNotify }) => toastNotify);
export const selectActiveMusic = createSelector(selectState, ({ activeMusic }) => activeMusic);
export const selectMusicIsPlaying = createSelector(selectState, ({ musicIsPlaying }) => musicIsPlaying);
export const selectOpenMusicModal = createSelector(selectState, ({ openMusicModal }) => openMusicModal);
export const selectActiveSecondUserId = createSelector(selectState, ({ secondUserId }) => secondUserId);
export const selectPublicMsgNotify = createSelector(selectState, ({ publicMsgNotify }) => publicMsgNotify);
export const selectHidenLiveStats = createSelector(selectState, ({ hideLiveStats }) => hideLiveStats);
export const selectSidebarCollapsed = createSelector(selectState, ({ sidebarCollapsed }) => sidebarCollapsed);
export const selectSmallScreen = createSelector(selectState, ({ mobileScreen }) => mobileScreen);

export default appStateReducer.reducer;
