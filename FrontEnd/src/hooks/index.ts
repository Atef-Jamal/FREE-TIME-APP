/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAppSelector } from "../context/Hooks";
import { useSearchParams } from "react-router-dom";

type HandleUpdate = (arg: any) => void;

interface TypeSocketHook {
  eventsToListen: string[];
  handlers: HandleUpdate[];
  dependencies?: any[];
}

interface TypeUseScrollToElementHook {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies?: any[];
  scrollPosition?: "center" | "start" | "end" | "nearest";
  key?: string;
  callback?: () => void;
}

export const useListenToSocketEvents = ({ eventsToListen, handlers, dependencies = [] }: TypeSocketHook) => {
  const socket = useAppSelector((state) => state.stateManeger.socket);

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

export const useScrollToElement = ({
  key = "to",
  scrollPosition = "center",
  dependencies = [],
  callback,
}: TypeUseScrollToElementHook) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get(key);

  useEffect(() => {
    if (queryParam) {
      const targetElement = document.getElementById(queryParam);
      const handleRemoveAnimation = (event: MouseEvent) => {
        const targetElement = event.currentTarget as HTMLElement;
        targetElement.classList.remove("activeElement");
        setSearchParams((prev) => {
          prev.delete(key);
          return prev;
        });
      };

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: scrollPosition,
        });
        targetElement.classList.add("activeElement");
        targetElement.addEventListener("click", handleRemoveAnimation);
        return () => {
          targetElement.classList.remove("activeElement");
          targetElement.removeEventListener("click", handleRemoveAnimation);
        };
      } else {
        if (callback) callback();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParam, setSearchParams, key, ...dependencies]);
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
