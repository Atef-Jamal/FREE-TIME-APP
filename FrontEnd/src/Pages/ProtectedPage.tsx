import { useAppSelector } from "../context/Hooks";
import LockedPage from "../components/Errors/LockedPage";
import BigLoading from "./BigLoading";

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  if (currentUserStatus === "pending") return <BigLoading />;
  if (currentUserStatus === "unauthenticated") return <LockedPage />;
  return children;
};

export default ProtectedPage;
