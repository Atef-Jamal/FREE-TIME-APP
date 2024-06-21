import { useEffect, useState } from "react";
import { useAppSelector } from "../context/Hooks";

type HandleUpdate = (arg: any) => void;

export const useListenToSocketEvents = ({
  eventsToListen,
  handlers,
  dependencies = [],
}: {
  eventsToListen: string[];
  handlers: HandleUpdate[];
  dependencies?: any[];
}) => {
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
  }, [socket, ...dependencies]);
};

export const useListenToDocumentEvent = <T>({
  eventToListen,
  onUpdate,
  dependencies = [],
}: {
  eventToListen: string;
  onUpdate: (arg: T | any) => void;
  dependencies?: any[];
}) => {
  useEffect(() => {
    document.addEventListener(eventToListen, onUpdate);
    return () => document.removeEventListener(eventToListen, onUpdate);
  }, dependencies);
};

export const useCloseMenuOnClickOutSide = ({
  menuRef,
  handleClose,
}: {
  menuRef: React.RefObject<HTMLElement>;
  handleClose: () => void;
}) => {
  const [initialRender, setInitialRender] = useState(false);

  const handler = (e: any) => {
    if (!menuRef.current?.contains(e.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    if (!initialRender) return;
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [initialRender]);

  useEffect(() => {
    setInitialRender(true);
  }, []);
};
