import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import LoadingWebsite from "./Pages/LoadingWebsite";
import { Layout, Home, Earn, Affiliates, MarketPlace, LeaderBoard, CashOut, PublicChatMobile } from "./Pages";
import { Rewards, MyProfile, Musics, PrivateChat, PublicUserProfile, Playing } from "./Pages";
import { ProtectedPage, PageNotFound, AppError } from "./Pages";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <Suspense fallback={<LoadingWebsite className="w-screen h-screen" />}>
          <Layout />
        </Suspense>
      ),
      errorElement: (
        <Suspense>
          <AppError />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LoadingWebsite />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "earn",
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
              <PublicChatMobile />
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
          element: (
            <Suspense>
              <PageNotFound />
            </Suspense>
          ),
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
