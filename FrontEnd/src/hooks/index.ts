/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useAppSelector } from "../context/Hooks";
import { useSearchParams } from "react-router-dom";

type IHandleUpdate = (arg: any) => void;

interface ISocketHook {
  eventsToListen: string[];
  handlers: IHandleUpdate[];
  dependencies?: any[];
}

interface IScrollToElementHook {
  dependencies?: any[];
  scrollPosition?: "center" | "start" | "end" | "nearest";
  key?: string;
  callback?: () => void;
}

export const useListenToSocketEvents = ({ eventsToListen, handlers, dependencies = [] }: ISocketHook) => {
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
}: IScrollToElementHook) => {
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
  }, [queryParam, setSearchParams, key, ...dependencies]);
};

export const useClickOutside = (ref: React.RefObject<HTMLDivElement | null>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};
