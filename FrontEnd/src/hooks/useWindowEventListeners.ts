import { useEffect } from "react";
import { openToast, updateStateField } from "../context/appStateSlice";
import { debounce } from "../utilities";
import { useAppDispatch } from "../context/hooks";

export const useWindowEventListeners = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleNetworkOnline = () => {
      dispatch(openToast({ message: "Back online", type: "SUCESS" }));
    };

    const handleNetworkOffline = () => {
      dispatch(openToast({ message: "No internet connection", type: "ERROR_GENERAL" }));
    };

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        dispatch(updateStateField({ entity: "mobileScreen", value: true }));
      } else {
        dispatch(updateStateField({ entity: "mobileScreen", value: false }));
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const debouncedResize: any = debounce(handleResize, 250);

    window.addEventListener("online", handleNetworkOnline);
    window.addEventListener("offline", handleNetworkOffline);
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("online", handleNetworkOnline);
      window.removeEventListener("offline", handleNetworkOffline);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [dispatch]);
};
