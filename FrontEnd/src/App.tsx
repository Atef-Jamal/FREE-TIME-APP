import { Suspense, lazy, useEffect } from "react";
import "./App.css";
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import io from "socket.io-client";
import { setOnlineUsers, setSocet } from "./context/StateManeger";
import { useListenToSocketEvents } from "./hooks";
import MobileChat from "./components/Chats/PublicChat/MobileChat/MobileChat";
import LoadingWebsite from "./components/Others/LoadingWebsite";
import { useAppDispatch, useAppSelector } from "./context/Hooks";
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
    errorElement: (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <span className="text-[150px] font-bold sm:text-[50px] text-[#56c760]">
          404
        </span>
        <span className="text-3xl font-bold text-[#56c760]">
          Page Not Found!
        </span>
        <div className="flex items-center gap-3 mt-2">
          <Link
            to={"/"}
            className="bg-[#4fca74] py-1 px-4 rounded-md text-black font-bold"
          >
            GO TO HOMEPAGE
          </Link>
          <button
            onClick={() =>
              (window.location.href = import.meta.env.VITE_CLIENT_BASE_URL)
            }
            className="bg-[#4fca74] py-1 px-4 rounded-md text-black font-bold"
          >
            RELOAD APP
          </button>
        </div>
      </div>
    ),
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
            <MyProfile />
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
            <PrivateChat />
          </Suspense>
        ),
        errorElement: <div>an error occurred!</div>,
        // children: [
        //   {
        //     path: ":id",
        //     element: (
        //       <Suspense fallback={<LoadingWebsite />}>
        //         <ChatBody />
        //       </Suspense>
        //     ),
        //   },
        // ],
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
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const dispatch = useAppDispatch();

  const handleUpdateOnlineUsers = (data: string[]) => {
    const filtered = data.filter((userId) => userId !== "undefined");
    dispatch(setOnlineUsers(filtered));
  };

  useListenToSocketEvents({
    eventToListen: ["online-users"],
    onUpdate: [handleUpdateOnlineUsers],
  });

  useEffect(() => {
    const establishSocetConnection = () => {
      const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
        query: { userId: currentUser?._id },
      });
      dispatch(setSocet(socket));
      return () => socket.close();
    };
    establishSocetConnection();
  }, [currentUser?._id]);

  return <RouterProvider router={router} />;
};

export default App;
