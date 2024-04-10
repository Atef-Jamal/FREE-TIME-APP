import { LiaUserAltSlashSolid } from "react-icons/lia";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const UserNotFound = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="h-full flex items-center justify-center p-6 gap-4 text-gray-300">
        <LiaUserAltSlashSolid className="text-3xl opacity-50" />
        {error.data}
      </div>
    );
  } else {
    return (
      <div className="h-full flex items-center justify-center p-6 gap-4 text-gray-300">
        Person Not Founded
      </div>
    );
  }
};

export default UserNotFound;
