import { Suspense, lazy } from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MobileChat from "./components/Chats/PublicChat/MobileChat/MobileChat";
import ChatBody from "./components/Chats/PrivateChat/ChatBody";
const Layout = lazy(() => import("./Pages/Layout"));
const Home = lazy(() => import("./Pages/Home"));
const Earn = lazy(() => import("./Pages/Earn"));
const Affiliates = lazy(() => import("./Pages/Affiliates"));
const LeaderBoard = lazy(() => import("./Pages/LeaderBoard"));
const CashOut = lazy(() => import("./Pages/CashOut"));
const Rewards = lazy(() => import("./Pages/Rewards"));
const MyProfile = lazy(() => import("./Pages/MyProfile"));
const PublicUserProfile = lazy(() => import("./Pages/PublicUserProfile"));
const MarketPlace = lazy(() => import("./Pages/MarketPlace"));
const PrivateChat = lazy(() => import("./Pages/PrivateChat"));
const Playing = lazy(() => import("./Pages/Playing"));
const Musics = lazy(() => import("./Pages/Musics"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
        path: "earn",
        element: (
          <Suspense>
            <Earn />
          </Suspense>
        ),
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
