/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

import { socket } from "../lib/socketIO";
import { ServerToClientEvents } from "../lib/socketIO/types";

export const useSocketEvents = (eventHandlers: {
  [K in keyof ServerToClientEvents]?: ServerToClientEvents[K];
}) => {
  useEffect(() => {
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      return socket.on(event as any, handler);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        return socket.off(event as any, handler);
      });
    };
  }, [eventHandlers]);
};
