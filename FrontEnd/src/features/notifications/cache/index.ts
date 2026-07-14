import { QueryClient } from "@tanstack/react-query";
import { ICashedNotificaions, INotifications } from "../types";

export const updateNotificationsCache = ({
  queryClient,
  notification,
}: {
  queryClient: QueryClient;
  notification: INotifications;
}) => {
  return queryClient.setQueryData(
    ["notifications"],
    (previous: ICashedNotificaions | undefined): ICashedNotificaions | undefined => {
      if (!previous) return;
      return previous.map((item) => {
        if (item._id === notification._id) {
          return notification;
        }
        return item;
      });
    },
  );
};

export const updateNotificationsIsReadCache = ({ queryClient }: { queryClient: QueryClient }) => {
  return queryClient.setQueryData(
    ["notifications"],
    (previous: ICashedNotificaions | undefined): ICashedNotificaions | undefined => {
      if (!previous) return;
      return previous.map((notify) => {
        return { ...notify, isRead: true };
      });
    },
  );
};

export const addNewNotificationCache = ({
  queryClient,
  newNotification,
}: {
  queryClient: QueryClient;
  newNotification: INotifications;
}) => {
  return queryClient.setQueryData(
    ["notifications"],
    (previous: ICashedNotificaions | undefined): ICashedNotificaions | undefined => {
      if (!previous) return;
      return [newNotification, ...previous];
    },
  );
};
