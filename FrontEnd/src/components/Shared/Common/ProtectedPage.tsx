import { useAppSelector } from "../../../context/hooks";
import LockedPage from "../../Errors/LockedPage";
import BigLoading from "../../../Pages/BigLoading/BigLoading";
import { selectUserAuth } from "../../../context/appStateSlice";

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const userAuth = useAppSelector(selectUserAuth);
  if (userAuth === "pending") return <BigLoading />;
  if (userAuth === "unauthenticated") return <LockedPage />;
  return children;
};

export default ProtectedPage;
