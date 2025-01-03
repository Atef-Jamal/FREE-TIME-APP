import { lazy } from "react";

export const Layout = lazy(() => import("./Layout"));
export const Home = lazy(() => import("./Home"));
export const MyProfile = lazy(() => import("./MyProfile"));
export const PublicUserProfile = lazy(() => import("./PublicUserProfile"));
export const Earn = lazy(() => import("./Earn"));
export const Rewards = lazy(() => import("./Rewards"));
export const MarketPlace = lazy(() => import("./MarketPlace"));
export const LeaderBoard = lazy(() => import("./LeaderBoard"));
export const Affiliates = lazy(() => import("./Affiliates"));
export const Musics = lazy(() => import("./Musics"));
export const PublicChatMobile = lazy(() => import("./PublicChatMobile"));
export const PrivateChat = lazy(() => import("./PrivateChat"));
export const Playing = lazy(() => import("./Playing"));
export const CashOut = lazy(() => import("./CashOut"));
export const ProtectedPage = lazy(() => import("./ProtectedPage"));
export const PageNotFound = lazy(() => import("./PageNotFound"));
export const AppError = lazy(() => import("./AppError"));
