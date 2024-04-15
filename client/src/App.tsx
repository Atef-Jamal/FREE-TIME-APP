import { Suspense, lazy } from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const Layout = lazy(() => import("./Pages/Layout"));
const Home = lazy(() => import("./Pages/Home"));
const Earn = lazy(() => import("./Pages/Earn"));
const Offers = lazy(() => import("./Pages/Offers"));
const Affiliates = lazy(() => import("./Pages/Affiliates"));
const LeaderBoard = lazy(() => import("./Pages/LeaderBoard"));
const CashOut = lazy(() => import("./Pages/CashOut"));
const Rewards = lazy(() => import("./Pages/Rewards"));
const All = lazy(() => import("./Pages/All"));
const Quiz = lazy(() => import("./Pages/Quiz"));
const Other = lazy(() => import("./Pages/Other"));
const MyProfile = lazy(() => import("./Pages/MyProfile"));
const OtherUserProfile = lazy(() => import("./Pages/OtherUserProfile"));
const MarketPlace = lazy(() => import("./Pages/MarketPlace"));
const Games = lazy(() => import("./Pages/Games"));
const PrivateChat = lazy(() => import("./Pages/PrivateChat"));
const Playing = lazy(() => import("./Pages/Playing"));
const Protected = lazy(() => import("./Pages/Protected"));
const OffersSignUp = lazy(() => import("./Pages/OffersSignUp"));
const Musics = lazy(() => import("./Pages/Musics"));

import { MobileChat, ChatBody, Error } from "./components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // errorElement: <GeneralError />,
    children: [
      {
        path: "",
        element: (
          <Suspense>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "error",
        element: (
          <Suspense>
            <Error />
          </Suspense>
        ),
      },
      {
        path: "earn",
        element: (
          <Suspense>
            <Earn />
          </Suspense>
        ),
      },
      {
        path: "offers",
        element: (
          <Suspense>
            <Offers />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense>
                <All />
              </Suspense>
            ),
          },
          {
            path: "offerssignup",
            element: (
              <Suspense>
                <OffersSignUp />
              </Suspense>
            ),
          },
          {
            path: "quiz",
            element: (
              <Suspense>
                <Quiz />
              </Suspense>
            ),
          },
          {
            path: "games",
            element: (
              <Suspense>
                <Games />
              </Suspense>
            ),
          },
          {
            path: "other",
            element: (
              <Suspense>
                <Other />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "affiliates",
        element: (
          <Suspense>
            <Affiliates />
          </Suspense>
        ),
      },
      {
        path: "marketplace",
        element: (
          <Suspense>
            <MarketPlace />
          </Suspense>
        ),
      },
      {
        path: "leaderboard",
        element: (
          <Suspense>
            <LeaderBoard />
          </Suspense>
        ),
      },
      {
        path: "cashout",
        element: (
          <Suspense>
            <CashOut />
          </Suspense>
        ),
      },
      {
        path: "rewards",
        element: (
          <Suspense>
            <Rewards />
          </Suspense>
        ),
      },
      {
        path: "myprofile",
        element: (
          <Suspense>
            <MyProfile />
          </Suspense>
        ),
      },
      {
        path: "musics",
        element: (
          <Suspense>
            <Musics />
          </Suspense>
        ),
      },
      {
        path: "chat",
        element: (
          <Suspense>
            <MobileChat />
          </Suspense>
        ),
      },
      {
        path: "privatechat",
        element: (
          <Suspense>
            <PrivateChat />
          </Suspense>
        ),
        children: [
          {
            path: ":id",
            element: (
              <Suspense>
                <ChatBody />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "user/:id",
        element: (
          <Suspense>
            <OtherUserProfile />
          </Suspense>
        ),
      },
      {
        path: "playing",
        element: (
          <Suspense>
            <Protected />
          </Suspense>
        ),
        children: [
          {
            path: ":id",
            element: (
              <Suspense>
                <Playing />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
