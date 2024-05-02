import { useEffect } from "react";
import { useAppSelector } from "../context/Hooks";

export const useListenToEvent = <T>({
  eventToListen,
  onUpdate,
  dependencies = [],
}: {
  eventToListen: string;
  onUpdate: (arg: T) => void;
  dependencies?: any[];
}) => {
  const { socet } = useAppSelector((state) => state.stateManeger);

  useEffect(() => {
    if (socet) {
      socet.on(eventToListen, onUpdate);
      return () => {
        socet.off(eventToListen, onUpdate);
      };
    }
  }, [socet, ...dependencies]);
};
