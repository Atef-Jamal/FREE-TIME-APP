import { Suspense, lazy, useEffect } from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import io from "socket.io-client";
import { setOnlineUsers, setSocet } from "./context/StateManeger";
import { useListenToSocketEvents } from "./hooks";
import MobileChat from "./components/chats/PublicChat/mobileChat/MobileChat";
import LoadingWebsite from "./components/others/LoadingWebsite";
import { useAppDispatch, useAppSelector } from "./context/Hooks";
import ProtectedPage from "./components/others/ProtectedPage";
import PageNotFound from "./components/errors/PageNotFound";
import AppError from "./components/errors/AppError";

const Layout = lazy(() => import("./pages/Layout"));
const Home = lazy(() => import("./pages/Home"));
const Earn = lazy(() => import("./pages/Earn"));
const Affiliates = lazy(() => import("./pages/Affiliates"));
const LeaderBoard = lazy(() => import("./pages/LeaderBoard"));
const CashOut = lazy(() => import("./pages/CashOut"));
const Rewards = lazy(() => import("./pages/Rewards"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const PublicUserProfile = lazy(() => import("./pages/PublicUserProfile"));
const MarketPlace = lazy(() => import("./pages/MarketPlace"));
const PrivateChat = lazy(() => import("./pages/PrivateChat"));
const Playing = lazy(() => import("./pages/Playing"));
const Musics = lazy(() => import("./pages/Musics"));

const router = createBrowserRouter([
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
]);

const App = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const dispatch = useAppDispatch();

  const handleUpdateOnlineUsers = (data: string[]) => {
    const filtered = data.filter((userId) => userId !== "undefined");
    dispatch(setOnlineUsers(filtered));
  };

  useListenToSocketEvents({
    eventsToListen: ["online-users"],
    handlers: [handleUpdateOnlineUsers],
  });

  useEffect(() => {
    const establishSocetConnection = () => {
      const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
        query: { userId: currentUser?._id },
      });
      dispatch(setSocet(socket));
      return socket;
    };

    const socket = establishSocetConnection();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [currentUser?._id]);

  return <RouterProvider router={router} />;
};

export default App;
