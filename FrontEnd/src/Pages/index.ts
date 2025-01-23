import { lazy } from "react";

export const Layout = lazy(() => import("../Layout/Layout"));
export const Home = lazy(() => import("./Home/Home"));
export const MyProfile = lazy(() => import("./MyProfile/MyProfile"));
export const PublicUserProfile = lazy(() => import("./PublicUserProfile/PublicUserProfile"));
export const Earn = lazy(() => import("./Earn/Earn"));
export const Rewards = lazy(() => import("./Rewards/Rewards"));
export const MarketPlace = lazy(() => import("./MarketPlace/MarketPlace"));
export const LeaderBoard = lazy(() => import("./Leaderboard/LeaderBoard"));
export const Affiliates = lazy(() => import("./Affiliates/Affiliates"));
export const Musics = lazy(() => import("./Musics/Musics"));
export const PublicChatMobile = lazy(() => import("./PublichChat/PublicChatMobile"));
export const PrivateChat = lazy(() => import("./PrivateChat/PrivateChat"));
export const Playing = lazy(() => import("./Playing/Playing"));
export const CashOut = lazy(() => import("./CashOut/CashOut"));
export const ProtectedPage = lazy(() => import("../components/Shared/Common/ProtectedPage"));
export const PageNotFound = lazy(() => import("../components/Errors/PageNotFound"));
export const AppError = lazy(() => import("../components/Errors/AppError"));
