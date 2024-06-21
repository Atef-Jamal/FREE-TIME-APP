import { useAppSelector } from "../../context/Hooks";
import LockedPage from "../Errors/LockedPage";
import LoadingWebsite from "./LoadingWebsite";

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, currentAccountRequestFullfiled } = useAppSelector(
    (state) => state.stateManeger
  );
  if (!currentAccountRequestFullfiled) return <LoadingWebsite />;
  if (!currentUser) return <LockedPage />;
  return children;
};

export default ProtectedPage;
