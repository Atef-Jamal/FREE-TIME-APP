import { useAppSelector } from "../../context/Hooks";
import LockedPage from "../Errors/LockedPage";
import LoadingWebsite from "./LoadingWebsite";

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const currentAccountRequestFullfiled = useAppSelector(
    (state) => state.stateManeger.currentAccountRequestFullfiled
  );

  if (!currentAccountRequestFullfiled) return <LoadingWebsite />;
  if (!currentUser) return <LockedPage />;
  return children;
};

export default ProtectedPage;
