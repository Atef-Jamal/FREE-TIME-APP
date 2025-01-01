import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Earn from "./Pages/Earn";
import Affiliates from "./Pages/Affiliates";
import MarketPlace from "./Pages/MarketPlace";
import LeaderBoard from "./Pages/LeaderBoard";
import CashOut from "./Pages/CashOut";
import Rewards from "./Pages/Rewards";
import MyProfile from "./Pages/MyProfile";
import Musics from "./Pages/Musics";
import PrivateChat from "./Pages/PrivateChat";
import PublicUserProfile from "./Pages/PublicUserProfile";
import Playing from "./Pages/Playing";

import MobileChat from "./components/Chats/PublicChat/MobileChat/MobileChat";
import LoadingWebsite from "./components/Others/LoadingWebsite";
import ProtectedPage from "./components/Others/ProtectedPage";
import PageNotFound from "./components/Errors/PageNotFound";
import AppError from "./components/Errors/AppError";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: <AppError />,
      children: [
        {
          path: "",
          element: (
            <Suspense fallback={<LoadingWebsite />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "earn",
          errorElement: <div className="w-full h-full">an error ocurred</div>,

          element: (
            <Suspense fallback={<LoadingWebsite />}>
              <Earn />
            </Suspense>
          ),
        },
        {
          path: "affiliates",
          element: (
            <Suspense fallback={<LoadingWebsite />}>
              <Affiliates />
            </Suspense>
          ),
        },
        {
          path: "marketplace",
          element: (
            <Suspense fallback={<LoadingWebsite />}>
              <MarketPlace />
            </Suspense>
          ),
        },
        {
          path: "leaderboard",
          element: (
            <Suspense fallback={<LoadingWebsite />}>
              <LeaderBoard />
            </Suspense>
          ),
        },
        {
          path: "cashout",
          element: (
            <Suspense fallback={<LoadingWebsite />}>
              <CashOut />
            </Suspense>
          ),
        },
        {
          path: "rewards",
          element: (
            <Suspense fallback={<LoadingWebsite />}>
              <Rewards />
            </Suspense>
          ),
        },
        {
          path: "myprofile",
          element: (
            <Suspense fallback={<LoadingWebsite />}>
              <ProtectedPage>
                <MyProfile />
              </ProtectedPage>
            </Suspense>
          ),
        },
        {
          path: "musics",
          element: (
            <Suspense fallback={<LoadingWebsite />}>
              <Musics />
            </Suspense>
          ),
        },
        {
          path: "chat",
          element: (
            <Suspense fallback={<LoadingWebsite />}>
              <MobileChat />
            </Suspense>
          ),
        },
        {
          path: "privatechat",
          element: (
            <Suspense fallback={<LoadingWebsite />}>
              <ProtectedPage>
                <PrivateChat />
              </ProtectedPage>
            </Suspense>
          ),
          errorElement: <div>an error occurred!</div>,
        },
        {
          path: "user/:id",
          element: (
            <Suspense fallback={<LoadingWebsite />}>
              <PublicUserProfile />
            </Suspense>
          ),
        },
        {
          path: "playing",
          children: [
            {
              path: ":id",
              element: (
                <Suspense fallback={<LoadingWebsite />}>
                  <ProtectedPage>
                    <Playing />
                  </ProtectedPage>
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "*",
          element: <PageNotFound />,
        },
      ],
    },
  ],
  {
    future: {
      v7_normalizeFormMethod: true,
      v7_fetcherPersist: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);
