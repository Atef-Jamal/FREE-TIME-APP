import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./context/Hooks";
import { setSocet } from "./context/StateManeger";
import io from "socket.io-client";
import "./App.css";
import { router } from "./routes";

const queryClient = new QueryClient();

const App = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
      query: { userId: currentUser?._id },
    });
    dispatch(setSocet(socket));
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [currentUser?._id, dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider future={{ v7_startTransition: true }} router={router} />;
    </QueryClientProvider>
  );
};

export default App;
