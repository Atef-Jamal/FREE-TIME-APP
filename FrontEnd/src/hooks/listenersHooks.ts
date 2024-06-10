import { useEffect, useState } from "react";
import { useAppSelector } from "../context/Hooks";

type HandleUpdate = (arg: any) => void;

export const useListenToSocketEvents = ({
  eventToListen,
  onUpdate,
  dependencies = [],
}: {
  eventToListen: string[];
  onUpdate: HandleUpdate[];
  dependencies?: any[];
}) => {
  const { socket } = useAppSelector((state) => state.stateManeger);

  useEffect(() => {
    if (socket) {
      for (let index = 0; index < eventToListen.length; index++) {
        socket.on(eventToListen[index], onUpdate[index]);
      }
      return () => {
        for (let index = 0; index < eventToListen.length; index++) {
          socket.off(eventToListen[index], onUpdate[index]);
        }
      };
    }
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

  useEffect(() => {
    if (initialRender) {
      const handleClick = (e: any) => {
        if (!menuRef.current?.contains(e.target)) {
          handleClose();
        }
      };
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [initialRender]);

  useEffect(() => {
    setInitialRender(true);
  }, []);
};
