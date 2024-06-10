import {
  useFetchPublicMessages,
  useFetchPrivateChatMessages,
} from "./chatsHooks";
import { useFetchAllApps, useFetchTaskApp } from "./appsHooks";
import {
  useListenToSocketEvents,
  useCloseMenuOnClickOutSide,
} from "./listenersHooks";
import { useFetchFrames } from "./framesHooks";
import {
  useFetchActivities,
  useFetchAllUsers,
  useFetchMusics,
  useFetchUser,
} from "./commonHooks";

export {
  useFetchAllUsers,
  useFetchUser,
  useFetchActivities,
  useFetchMusics,
  useCloseMenuOnClickOutSide,
  useFetchPublicMessages,
  useFetchPrivateChatMessages,
  useFetchAllApps,
  useFetchTaskApp,
  useFetchFrames,
  useListenToSocketEvents,
};
