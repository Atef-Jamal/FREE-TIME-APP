import { useEffect } from "react";

import { useAppSelector } from "../context/hooks";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IHandleUpdate = (arg: any) => void;

interface ISocketHook {
  eventsToListen: string[];
  handlers: IHandleUpdate[];
}

export const useListenToSocketEvents = ({ eventsToListen, handlers }: ISocketHook) => {
  const socket = useAppSelector((state) => state.appState.socket);
  useEffect(() => {
    if (!socket) return;
    for (let index = 0; index < eventsToListen.length; index++) {
      socket.on(eventsToListen[index], handlers[index]);
    }
    return () => {
      for (let index = 0; index < eventsToListen.length; index++) {
        socket.off(eventsToListen[index], handlers[index]);
      }
    };
  }, [socket, eventsToListen, handlers]);
};
