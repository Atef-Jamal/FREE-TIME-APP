import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Layout,
  Home,
  Earn,
  Offers,
  Affiliates,
  LeaderBoard,
  CashOut,
  Rewards,
  All,
  Quiz,
  Other,
  MyProfile,
  OtherUserProfile,
  MarketPlace,
  Games,
  PrivateChat,
  Playing,
  Protected,
  OffersSignUp,
  Musics,
} from "./Pages";

import { MobileChat, ChatBody, Error } from "./components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // errorElement: <GeneralError />,
    children: [
      { path: "", element: <Home /> },
      { path: "error", element: <Error /> },
      { path: "earn", element: <Earn /> },
      {
        path: "offers",
        element: <Offers />,
        children: [
          { path: "", element: <All /> },
          { path: "offerssignup", element: <OffersSignUp /> },
          { path: "quiz", element: <Quiz /> },
          { path: "games", element: <Games /> },
          { path: "other", element: <Other /> },
        ],
      },
      { path: "affiliates", element: <Affiliates /> },
      { path: "marketplace", element: <MarketPlace /> },
      { path: "leaderboard", element: <LeaderBoard /> },
      { path: "cashout", element: <CashOut /> },
      { path: "rewards", element: <Rewards /> },
      { path: "myprofile", element: <MyProfile /> },
      { path: "musics", element: <Musics /> },
      {
        path: "chat",
        element: <MobileChat />,
      },
      {
        path: "privatechat",
        element: <PrivateChat />,
        children: [{ path: ":id", element: <ChatBody /> }],
      },
      {
        path: "user/:id",
        element: <OtherUserProfile />,
      },
      {
        path: "playing",
        element: <Protected />,
        children: [{ path: ":id", element: <Playing /> }],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
