import { useAppSelector } from "../../context/hooks";
import { selectUserAuth } from "../../context/appStateSlice";
import BigLoading from "../BigLoading";
import LockedPage from "../LockedPage";

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const userAuth = useAppSelector(selectUserAuth);
  if (userAuth === "pending") return <BigLoading />;
  if (userAuth === "unauthenticated") return <LockedPage />;
  return children;
};

export default ProtectedPage;
