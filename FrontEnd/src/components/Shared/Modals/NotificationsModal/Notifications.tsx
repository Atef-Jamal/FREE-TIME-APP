import { memo, useCallback, useEffect } from "react";
import { MdOutlineClose, MdOutlineEditNotifications } from "react-icons/md";
import { useAppDispatch } from "../../../../context/hooks";
import { resetModel, openToast } from "../../../../context/appStateSlice";
import { handleApiError } from "../../../../utilities";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import type { INotifications } from "../../../../types";
import Spinner from "../../Common/Spinner";
import Empty from "../../Common/Empty";
import NotificationItem from "./NotificationItem";
import { updateNotificationsIsReadCache } from "../../../../tanstackQuery/queryCache";
import { axiosRequest } from "../../../../lib/axios";

const Notifications = memo(() => {
  const queryClient = useQueryClient();
  const isLoading = useIsFetching({ queryKey: ["notifications"], exact: true });
  const notifications: INotifications[] | undefined = queryClient.getQueryData(["notifications"]);
  const dispatch = useAppDispatch();

  const handleRefetch = () => {
    queryClient.refetchQueries({ queryKey: ["notifications"] });
  };

  const markNotificationasRead = useCallback(async () => {
    try {
      const response = await axiosRequest.get("api/notifications");
      if (response.status === 200) {
        updateNotificationsIsReadCache({ queryClient });
      }
    } catch (error) {
      dispatch(
        openToast({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    }
  }, [dispatch, queryClient]);

  useEffect(() => {
    const isUnReaded = notifications?.some((item) => item.isRead === false);
    if (isUnReaded) {
      markNotificationasRead();
    }
  }, [markNotificationasRead, notifications]);

  return (
    <div className="lg::mr-5 mb-auto mt-11 flex max-h-[90%] w-[95%] flex-col rounded-lg bg-[#2e2e4b] p-1 sm:ml-auto sm:mr-2 sm:mt-14 sm:max-w-[600px] sm:p-2 md:p-3 lg:mr-5">
      <div className="flex items-center justify-between bg-[#2e2e4b]">
        <h1 className="flex items-center gap-x-2 text-lg font-bold tracking-wider text-gray-300">
          <MdOutlineEditNotifications className="text-2xl" /> Notifications
        </h1>
        <MdOutlineClose onClick={() => dispatch(resetModel())} className="text-2xl" />
      </div>
      <hr className="mx-1 mb-1 mt-2 border-[#746969]" />
      <div className="scrollbar-custom flex-1 space-y-1 overflow-y-auto">
        {isLoading > 0 && (
          <div className="my-10 flex h-12 w-full items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        )}
        {notifications === undefined && isLoading === 0 && (
          <div className="my-6 space-y-3 text-center">
            <p className="font-bold text-[#eb5050]">an error occurred</p>
            <button onClick={handleRefetch} className="rounded-sm bg-[#555768] px-5 py-1 text-gray-300">
              try again
            </button>
          </div>
        )}
        {notifications?.length === 0 && <Empty text="Empty Notifications" />}
        {notifications?.map((item) => <NotificationItem key={item._id} {...item} />)}
      </div>
    </div>
  );
});

export default Notifications;
