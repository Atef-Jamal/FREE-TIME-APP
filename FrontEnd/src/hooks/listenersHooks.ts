/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useAppSelector } from "../context/Hooks";

type HandleUpdate = (arg: any) => void;
interface TypeUseListentoSocketEvents {
  eventsToListen: string[];
  handlers: HandleUpdate[];
  dependencies?: any[];
}

export const useListenToSocketEvents = ({
  eventsToListen,
  handlers,
  dependencies = [],
}: TypeUseListentoSocketEvents) => {
  const { socket } = useAppSelector((state) => state.stateManeger);

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
  }, [socket, ...dependencies, ...eventsToListen, ...handlers]);
};

export const useListenToDocumentEvent = ({
  eventToListen,
  onUpdate,
  dependencies = [],
}: {
  eventToListen: string;
  onUpdate: (arg: any) => void;
  dependencies?: any[];
}) => {
  useEffect(() => {
    document.addEventListener(eventToListen, onUpdate);
    return () => document.removeEventListener(eventToListen, onUpdate);
  }, [...dependencies, eventToListen, onUpdate]);
};

export const useCloseMenuOnClickOutSide = ({
  menuRef,
  handleClose,
}: {
  menuRef: React.RefObject<HTMLElement | null>;
  handleClose: () => void;
}) => {
  const [initialRender, setInitialRender] = useState(false);

  useEffect(() => {
    if (!initialRender) return;
    const handler = (event: any) => {
      if (!menuRef.current?.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [initialRender, handleClose, menuRef]);

  useEffect(() => {
    setInitialRender(true);
  }, []);
};
