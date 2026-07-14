import { useAppSelector } from "../context/hooks";
import { selectUserAuth } from "../context/appStateSlice";
import LoadingPage from "./LoadingPage";
import LockedPage from "./LockedPage";

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const userAuth = useAppSelector(selectUserAuth);
  if (userAuth === "pending") return <LoadingPage />;
  if (userAuth === "unauthenticated") return <LockedPage />;
  return children;
};

export default ProtectedPage;
