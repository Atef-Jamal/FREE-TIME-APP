import { useEffect } from "react";
import { useAppSelector } from "../context/Hooks";

export const useListenToSocketEvent = <T>({
  eventToListen,
  onUpdate,
  dependencies = [],
}: {
  eventToListen: string;
  onUpdate: (arg: T) => void;
  dependencies?: any[];
}) => {
  const { socket } = useAppSelector((state) => state.stateManeger);

  useEffect(() => {
    if (socket) {
      socket.on(eventToListen, onUpdate);
      return () => {
        socket.off(eventToListen, onUpdate);
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
  onClose,
}: {
  menuRef: React.RefObject<HTMLElement>;
  onClose: () => void;
}) => {
  useEffect(() => {
    const func = (event: globalThis.MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("click", func);
    return () => document.removeEventListener("click", func);
  }, []);
};
