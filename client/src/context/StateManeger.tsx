import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { TypePopup, User, TypeInitialState } from "../types";
// import music from "../../assets/music.mp3";

const initialState: TypeInitialState = {
  currentUser: null,
  currentUserIsLoading: false,
  openNotification: false,
  openPopup: {
    status: false,
    message: "",
    spinner: false,
    icon: null,
  },
  openRegisterForm: false,
  isChatOpen: false,
  isSignIn: false,
  openSidebarMobile: false,
  resizeSidebare: false,
  hiddenLiveStats: false,
  songs: [],
  openMusicModal: false,
  isPlaying: false,
  currentSong: null,
  token: localStorage.getItem("token") || null,
  socet: null,
  onlineUsers: [],
  reFetchThisUserId: "",
  allUnReadedMesseges: [],
  model: { status: false, children: null },
};

const StateManegerSlice = createSlice({
  name: "stateManeger",
  initialState,
  reducers: {
    toggleRegisterForm(state, action: PayloadAction<boolean>) {
      state.openRegisterForm = action.payload || !state.openRegisterForm;
    },
    toggleNotifications(state, action: PayloadAction<boolean>) {
      state.openNotification = action.payload;
    },
    toggleSigningMode(state, action: PayloadAction<boolean>) {
      state.isSignIn = action.payload;
    },
    toggleLiveStats(state) {
      state.hiddenLiveStats = !state.hiddenLiveStats;
    },
    chatToggleButton(state) {
      state.isChatOpen = !state.isChatOpen;
    },
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    setCurrentUserIsLoading(state, action: PayloadAction<boolean>) {
      state.currentUserIsLoading = action.payload;
    },
    toggleSidebarMobile(state) {
      state.openSidebarMobile = !state.openSidebarMobile;
    },
    toggleResizeSidebare(state) {
      state.resizeSidebare = !state.resizeSidebare;
    },
    setRefetchUnReadedMessagesCount(state, action) {
      state.reFetchThisUserId = action.payload;
    },

    showPopup(state, action: PayloadAction<TypePopup>) {
      state.openPopup.status = true;
      state.openPopup.message = action.payload.message;
      state.openPopup.spinner = action.payload.spinner;
      state.openPopup.icon = action.payload.icon;
    },
    openModel(
      state,
      action: PayloadAction<{ status: boolean; children: React.ReactNode }>
    ) {
      state.model.status = true;
      state.model.children = action.payload.children;
    },
    resetModel(state) {
      state.model.status = false;
      state.model.children = null;
    },
    resetPopup(state) {
      state.openPopup.status = false;
      state.openPopup.icon = null;
      state.openPopup.spinner = false;
      state.openPopup.message = "";
    },
    setAllSongs(state, action: PayloadAction<any>) {
      state.songs = action.payload;
    },
    toggleMusicModal(state, action: PayloadAction<boolean>) {
      state.openMusicModal = action.payload;
    },
    toggleIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setCurrentSong(state, action: PayloadAction<any>) {
      state.currentSong = action.payload;
    },
    resetCurrentSong(state) {
      state.currentSong = null;
    },
    setSocet(state, action: PayloadAction<any>) {
      state.socet = action.payload;
    },
    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },
    setAllUnReadedMesseges(
      state,
      action: PayloadAction<{
        type: "ADD-ALL" | "ADD-ONE" | "REMOVE";
        userId: string | string[];
      }>
    ) {
      const { type, userId } = action.payload;
      if (type === "ADD-ALL") {
        state.allUnReadedMesseges = userId as string[];
      }
      if (type === "ADD-ONE") {
        state.allUnReadedMesseges.push(userId as string);
      }
      if (type === "REMOVE") {
        state.allUnReadedMesseges = state.allUnReadedMesseges.filter(
          (item) => item !== userId
        );
      }
    },
  },
});

export const {
  toggleRegisterForm,
  toggleNotifications,
  chatToggleButton,
  toggleSigningMode,
  setCurrentUser,
  setCurrentUserIsLoading,
  toggleSidebarMobile,
  showPopup,
  resetPopup,
  toggleResizeSidebare,
  toggleLiveStats,
  setAllSongs,
  toggleMusicModal,
  toggleIsPlaying,
  setCurrentSong,
  resetCurrentSong,
  setSocet,
  setOnlineUsers,
  setRefetchUnReadedMessagesCount,
  setAllUnReadedMesseges,
  openModel,
  resetModel,
} = StateManegerSlice.actions;

export default StateManegerSlice;
