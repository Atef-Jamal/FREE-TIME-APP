import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import BigLoading from "./Pages/BigLoading";
import { Layout, Home, Earn, Affiliates, MarketPlace, LeaderBoard, CashOut, PublicChatMobile } from "./Pages";
import { Rewards, MyProfile, Musics, PrivateChat, PublicUserProfile, Playing } from "./Pages";
import { ProtectedPage, PageNotFound, AppError } from "./Pages";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Suspense fallback={<BigLoading className="h-screen w-screen" />} children={<Layout />} />,
      errorElement: <Suspense children={<AppError />} />,
      children: [
        {
          index: true,
          element: <Suspense fallback={<BigLoading />} children={<Home />} />,
        },
        {
          path: "earn",
          element: <Suspense fallback={<BigLoading />} children={<Earn />} />,
        },
        {
          path: "affiliates",
          element: <Suspense fallback={<BigLoading />} children={<Affiliates />} />,
        },
        {
          path: "marketplace",
          element: <Suspense fallback={<BigLoading />} children={<MarketPlace />} />,
        },
        {
          path: "leaderboard",
          element: <Suspense fallback={<BigLoading />} children={<LeaderBoard />} />,
        },
        {
          path: "cashout",
          element: <Suspense fallback={<BigLoading />} children={<CashOut />} />,
        },
        {
          path: "rewards",
          element: <Suspense fallback={<BigLoading />} children={<Rewards />} />,
        },
        {
          path: "myprofile",
          element: (
            <Suspense
              fallback={<BigLoading />}
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
          element: <Suspense fallback={<BigLoading />} children={<Musics />} />,
        },
        {
          path: "chat",
          element: <Suspense fallback={<BigLoading />} children={<PublicChatMobile />} />,
        },
        {
          path: "privatechat",
          element: (
            <Suspense
              fallback={<BigLoading />}
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
          element: <Suspense fallback={<BigLoading />} children={<PublicUserProfile />} />,
        },
        {
          path: "playing",
          children: [
            {
              path: ":id",
              element: (
                <Suspense
                  fallback={<BigLoading />}
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
