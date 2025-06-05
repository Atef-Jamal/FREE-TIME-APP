import { lazy } from "react";

export const Layout = lazy(() => import("../Layout/Layout"));
export const Home = lazy(() => import("./Home"));
export const MyProfile = lazy(() => import("./MyProfile"));
export const PublicUserProfile = lazy(() => import("./PublicUserProfile"));
export const Earn = lazy(() => import("./Earn"));
export const Rewards = lazy(() => import("./Rewards"));
export const MarketPlace = lazy(() => import("./MarketPlace"));
export const LeaderBoard = lazy(() => import("./Leaderboard"));
export const Affiliates = lazy(() => import("./Affiliates"));
export const Musics = lazy(() => import("./Musics"));
export const MobileChat = lazy(() => import("./PublichChat/MobileChat"));
export const PrivateChat = lazy(() => import("./PrivateChat"));
export const Playing = lazy(() => import("./Playing"));
export const CashOut = lazy(() => import("./CashOut"));
export const ProtectedPage = lazy(() => import("./ProtectedPage"));
export const PageNotFound = lazy(() => import("./PageNotFound"));
export const AppError = lazy(() => import("./AppError"));
