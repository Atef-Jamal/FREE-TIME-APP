import { handleDeleteMessage } from "../../../../utils";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import Spinner from "../../../Others/Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { showPopup } from "../../../../context/StateManeger";
import { handleApiError } from "../../../../utils/common";
import { ICashedPublicChat } from "../../../../types/publicChatTypes";
import { v4 as uuidV4 } from "uuid";

interface IProps {
  messageToDelete: string;
  setMessageToDelete: Dispatch<SetStateAction<string | null>>;
  height: number | undefined;
}

export const ChatModelDeletion = ({ messageToDelete, setMessageToDelete, height }: IProps) => {
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: handleDeleteMessage,
    onSuccess: (deletedMessage) => {
      socket?.emit("interact-with-public-message", deletedMessage);
      queryClient.setQueryData(
        ["public-chat-messages"],
        (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
          if (!previous) return;
          return {
            ...previous,
            pages: previous.pages.map((page) => {
              return {
                ...page,
                messages: page.messages.map((msg) => {
                  if (msg._id === deletedMessage._id) {
                    return { ...deletedMessage, _id: uuidV4() };
                  }
                  return msg;
                }),
              };
            }),
          };
        },
      );
    },
    onError: (error) => {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    },
    onSettled: async () => {
      setMessageToDelete(null);
    },
  });

  return (
    <div
      onClick={() => setMessageToDelete(null)}
      style={{
        height,
      }}
      className="absolute top-0 z-[1] w-full bg-[#03020ad2]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sticky top-[35%] mx-2 rounded-lg border border-[#645252] bg-[#242222] p-4"
      >
        <p className="mb-6 text-center text-sm font-bold text-[#87abc9]">
          Are your sure to delete your message ?
        </p>

        <div className="flex items-center justify-center gap-x-4">
          <button
            disabled={mutation.status === "pending"}
            onClick={() => {
              mutation.mutate(messageToDelete);
            }}
            className="rounded-lg bg-[#2d773f] px-8 py-1"
          >
            {mutation.status === "pending" ? <Spinner className="h-5 w-5" /> : "Yes"}
          </button>
          <button
            onClick={() => setMessageToDelete(null)}
            disabled={mutation.status === "pending"}
            className="rounded-lg bg-[#0f0e29] px-9 py-1"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};
