import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import LoadingPage from "./Pages/LoadingPage";

import { Layout, Home, Offers, Affiliates, MarketPlace, LeaderBoard, CashOut, MobileChat } from "./Pages";
import { Rewards, MyProfile, Musics, PrivateChat, PublicUserProfile, Playing } from "./Pages";
import { ProtectedPage, PageNotFound, AppError } from "./Pages";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Suspense fallback={<LoadingPage className="h-screen w-screen" />} children={<Layout />} />,
      errorElement: <Suspense children={<AppError />} />,
      children: [
        {
          index: true,
          element: <Suspense fallback={<LoadingPage />} children={<Home />} />,
        },

        {
          path: "earn",
          element: <Suspense fallback={<LoadingPage />} children={<Offers />} />,
        },
        {
          path: "affiliates",
          element: <Suspense fallback={<LoadingPage />} children={<Affiliates />} />,
        },
        {
          path: "marketplace",
          element: <Suspense fallback={<LoadingPage />} children={<MarketPlace />} />,
        },
        {
          path: "leaderboard",
          element: <Suspense fallback={<LoadingPage />} children={<LeaderBoard />} />,
        },
        {
          path: "cashout",
          element: <Suspense fallback={<LoadingPage />} children={<CashOut />} />,
        },
        {
          path: "rewards",
          element: <Suspense fallback={<LoadingPage />} children={<Rewards />} />,
          errorElement: <Suspense children={<div>reward page error </div>} />,
        },
        {
          path: "myprofile",
          element: (
            <Suspense
              fallback={<LoadingPage />}
              children={
                <ProtectedPage>
                  <MyProfile />
                </ProtectedPage>
              }
            />
          ),
        },
        {
          path: "musics",
          element: <Suspense fallback={<LoadingPage />} children={<Musics />} />,
        },
        {
          path: "chat",
          element: <Suspense fallback={<LoadingPage />} children={<MobileChat />} />,
        },
        {
          path: "privatechat",
          element: (
            <Suspense
              fallback={<LoadingPage />}
              children={
                <ProtectedPage>
                  <PrivateChat />
                </ProtectedPage>
              }
            />
          ),
        },
        {
          path: "user/:id",
          element: <Suspense fallback={<LoadingPage />} children={<PublicUserProfile />} />,
        },
        {
          path: "playing",
          children: [
            {
              path: ":offerId",
              element: (
                <Suspense
                  fallback={<LoadingPage />}
                  children={
                    <ProtectedPage>
                      <Playing />
                    </ProtectedPage>
                  }
                />
              ),
            },
          ],
        },
        {
          path: "*",
          element: <Suspense fallback={<></>} children={<PageNotFound />} />,
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
