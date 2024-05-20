import {
  useFetchPublicMessages,
  useFetchPrivateChatMessages,
} from "./chatsHooks";
import { useFetchAllApps, useFetchTaskApp } from "./appsHooks";
import {
  useListenToSocketEvent,
  useCloseMenuOnClickOutSideListener,
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
  useCloseMenuOnClickOutSideListener,
  useFetchPublicMessages,
  useFetchPrivateChatMessages,
  useFetchAllApps,
  useFetchTaskApp,
  useFetchFrames,
  useListenToSocketEvent,
};
