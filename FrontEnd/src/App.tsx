import { Suspense, lazy, useEffect } from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import io from "socket.io-client";
import { setOnlineUsers, setSocet } from "./context/StateManeger";
import { useListenToSocketEvents } from "./hooks";
import MobileChat from "./components/Chats/PublicChat/MobileChat/MobileChat";
import LoadingWebsite from "./components/Others/LoadingWebsite";
import ProtectedPage from "./components/Others/ProtectedPage";
import PageNotFound from "./components/Errors/PageNotFound";
import AppError from "./components/Errors/AppError";
import { useAppDispatch, useAppSelector } from "./context/Hooks";
import { useTranslation } from "react-i18next";

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

const router = createBrowserRouter(
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
  }
);

const App = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();

  const example = false;
  if (example) {
    console.log(i18n);
  }

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
  }, [currentUser?._id, dispatch]);

  return (
    <RouterProvider future={{ v7_startTransition: true }} router={router} />
  );
};

export default App;
