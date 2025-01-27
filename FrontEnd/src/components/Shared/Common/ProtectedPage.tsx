import { useAppSelector } from "../../../context/hooks";
import LockedPage from "../../Errors/LockedPage";
import BigLoading from "../../../Pages/BigLoading/BigLoading";

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const currentUserStatus = useAppSelector((state) => state.appState.currentUserStatus);
  if (currentUserStatus === "pending") return <BigLoading />;
  if (currentUserStatus === "unauthenticated") return <LockedPage />;
  return children;
};

export default ProtectedPage;
