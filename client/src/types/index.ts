import { Timestamp } from "firebase/firestore";
import { Socket } from "socket.io-client";

export interface TypeMentionNotify {
  _id: string;
  type: "MENTION";
  createdAt: Date;
  isRead: boolean;
  messageLocation: string;
  mentionedUser: User;
}
export interface TypeEmailVerifiedNotify {
  _id: string;
  type: "EMAIL-VERIFIED";
  createdAt: Date;
  isRead: boolean;
  isCollected: boolean;
  prize: number;
}
export interface TypeReferrerNotify {
  _id: string;
  type: "REFERRER";
  createdAt: Date;
  isRead: boolean;
  isCollected: boolean;
  referredUser: User;
  prize: number;
}
export interface TypeBuyFrameNotify {
  _id: string;
  type: "BUY-FRAME";
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
  frame: TypeFrame;
}
export interface TypeQuizAppNotify {
  _id: string;
  type: "QUIZ-APP";
  createdAt: Date;
  isRead: boolean;
  isCollected: boolean;
  prize: number;
}
export interface TypeAnnouncementNoify {
  _id: string;
  type: "ANNOUNCEMENT";
  announceContent: string;
  createdAt: Date;
  isRead: boolean;
}
export interface TypeGuessCardNotify {
  _id: string;
  type: "GUESS-CARD";
  isCollected: boolean;
  prize: number;
  createdAt: Date;
  isRead: boolean;
}
export interface TypeMusicNotify {
  _id: string;
  type: "MUSIC";
  musicTitle: string;
  price: number;
  createdAt: Date;
  isRead: boolean;
}

export type TypeNotifications =
  | TypeMentionNotify
  | TypeEmailVerifiedNotify
  | TypeReferrerNotify
  | TypeBuyFrameNotify
  | TypeQuizAppNotify
  | TypeAnnouncementNoify
  | TypeGuessCardNotify
  | TypeMusicNotify;

export interface TypeFrame {
  _id: string;
  title: string;
  image: string;
  price: number;
  description: string;
  purshasedBy: string[];
}

export interface TypePopup {
  status: boolean;
  message: string;
  spinner?: boolean;
  icon?: React.ReactNode;
}

interface TypeDailyReward {
  day: number;
  isCollected: boolean;
  reward: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  createdAt: string;
  emailVerified: boolean;
  points: number;
  copouns: string[];
  activeFrame: TypeFrame | null;
  myFrames: TypeFrame[];
  mySongs: string[];
  completedTasks: string[];
  dailyReward: { week: number; days: TypeDailyReward[] };
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
  token: string | null;
  socet: Socket | null;
  onlineUsers: string[];
  reFetchThisUserId: string;
  allUnReadedMesseges: string[];
  model: { status: boolean; children: React.ReactNode };
}

export interface TypePublicChatMessage {
  _id: string;
  type: "MESSAGE";
  createdAt: Date;
  updatedAt: Date;
  sender: User;
  message: string;
  isDeleted: boolean;
  likes: string[];
  dislikes: string[];
  loves: string[];
  mentioned: User | null;
  // pending?: boolean;
}

export interface TypePublicChatFreeTime {
  _id: string;
  type: "FREETIME";
  typeOfTask: "REFERRER" | "TASK" | "MUSIC" | "FRAME" | "EMAIL-VERIFIED";
  sender: User;
  newUserReferred: User;
  musicTitle: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TypePublicChatItem = TypePublicChatMessage | TypePublicChatFreeTime;

export interface TypePrivateMessage {
  sender: User;
  message: string;
  _id: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TypeSingleQuiz {
  question: string;
  choises: string[];
  correctAnswer: string;
}

export interface TypeTaskApp {
  _id: string;
  quizes: TypeSingleQuiz[];
  prize: number;
  name: string;
  category: "quiz" | "game";
  image: string;
  createdAt: Timestamp;
}

export interface TypeGame {
  _id: string;
  name: string;
  category: string;
  prize: number;
  description: string;
  createdAt: Timestamp;
  image: string;
}
