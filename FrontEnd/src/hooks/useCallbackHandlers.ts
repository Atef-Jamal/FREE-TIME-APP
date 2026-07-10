import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../context/hooks";
import { openToast, selectUserAuth, showModal } from "../context/appStateSlice";

export const useCallbackHandlers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const loggedInWithProvider = searchParams.get("provider-authenticated");
  const comeFromQuery = searchParams.get("comeFrom");
  const refQuery = searchParams.get("referrerUser");
  const dispatch = useAppDispatch();
  const userAuth = useAppSelector(selectUserAuth);

  useEffect(() => {
    if (loggedInWithProvider) {
      localStorage.setItem("isLoggedIn", "ok");
      setSearchParams((prevSearchParams) => {
        prevSearchParams.delete("provider-authenticated");
        return prevSearchParams;
      });
    }
  }, [loggedInWithProvider, setSearchParams]);

  useEffect(() => {
    if (refQuery && userAuth === "unauthenticated") {
      dispatch(showModal("register-modal"));
    }
  }, [dispatch, refQuery, userAuth]);

  useEffect(() => {
    if (comeFromQuery) {
      let message;
      switch (comeFromQuery) {
        case "signup":
          message = "Sign Up successfull";
          break;
        case "login":
          message = "Login successfull";
          break;
        case "logout":
          message = "Logout successfull";
          break;
        default:
          break;
      }

      if (message) {
        dispatch(
          openToast({
            message: message,
            type: "SUCESS",
          }),
        );
        setSearchParams((prevSearchParams) => {
          prevSearchParams.delete("comeFrom");
          return prevSearchParams;
        });
      }
    }
  }, [loggedInWithProvider, refQuery, comeFromQuery, userAuth, setSearchParams, dispatch]);
};
