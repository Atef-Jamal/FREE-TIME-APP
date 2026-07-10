/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useAppSelector } from "../context/hooks";
import { selectSocket } from "../context/appStateSlice";
import { ServerToClientEvents } from "../types/socket";

export const useSocketEvents = (eventHandlers: {
  [K in keyof ServerToClientEvents]?: ServerToClientEvents[K];
}) => {
  const socket = useAppSelector(selectSocket);

  useEffect(() => {
    if (!socket) return;

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      return socket.on(event as any, handler);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        return socket.off(event as any, handler);
      });
    };
  }, [socket, eventHandlers]);
};
