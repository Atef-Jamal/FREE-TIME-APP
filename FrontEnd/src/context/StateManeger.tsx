import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { TypeInitialState, TypePopup } from "../types/redux";
import { User } from "../types/user";

const initialState: TypeInitialState = {
  currentUser: null,
  currentUserIsLoading: false,
  currentAccountRequestFullfiled: false,
  openNotification: false,
  openPopup: {
    status: false,
    type: null,
    message: "",
  },
  openRegisterForm: false,
  isChatOpen: false,
  isSignIn: false,
  openSidebarMobile: false,
  resizeSidebare: window.innerWidth < 1300 ? true : false,
  hiddenLiveStats: false,
  openMusicModal: false,
  isPlaying: false,
  currentSong: null,
  socet: null,
  onlineUsers: [],
  reFetchThisUserId: "",
  allUnReadedMesseges: [],
  model: { status: false, children: null },
};

export interface TypeTogglActionPayload {
  entity:
    | "openRegisterForm"
    | "openNotification"
    | "isSignIn"
    | "hiddenLiveStats"
    | "isChatOpen"
    | "openSidebarMobile"
    | "resizeSidebare"
    | "openMusicModal"
    | "isPlaying";
  value?: boolean;
}

const StateManegerSlice = createSlice({
  name: "stateManeger",
  initialState,
  reducers: {
    toggleThisEntity(state, action: PayloadAction<TypeTogglActionPayload>) {
      const { entity, value } = action.payload;
      state[entity] = value || !state[entity];
    },
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    setCurrentUserIsLoading(state, action: PayloadAction<boolean>) {
      state.currentUserIsLoading = action.payload;
    },
    setCurrentAccountRequestFullfiled(state, action: PayloadAction<boolean>) {
      state.currentAccountRequestFullfiled = action.payload;
    },
    setRefetchUnReadedMessagesCount(state, action) {
      state.reFetchThisUserId = action.payload;
    },

    showPopup(state, action: PayloadAction<TypePopup>) {
      state.openPopup.status = true;
      state.openPopup.message = action.payload.message;
      state.openPopup.type = action.payload.type;
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
      state.openPopup.type = null;
      state.openPopup.message = "";
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
  setCurrentUser,
  setCurrentUserIsLoading,
  setCurrentAccountRequestFullfiled,
  showPopup,
  resetPopup,
  setCurrentSong,
  resetCurrentSong,
  setSocet,
  setOnlineUsers,
  setRefetchUnReadedMessagesCount,
  setAllUnReadedMesseges,
  openModel,
  resetModel,
  toggleThisEntity,
} = StateManegerSlice.actions;

export default StateManegerSlice;
