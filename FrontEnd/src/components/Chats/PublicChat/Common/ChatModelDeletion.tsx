import { handleDeleteMessage } from "../../../../utils";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import Spinner from "../../../Others/Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { showPopup } from "../../../../context/StateManeger";
import { handleApiError } from "../../../../utils/common";
import { TypeCashedPublicChat } from "../../../../types/publicChatTypes";
import { v4 as uuidV4 } from "uuid";

interface TypeProps {
  messageToDelete: string;
  setMessageToDelete: Dispatch<SetStateAction<string | null>>;
  height: number | undefined;
}

export const ChatModelDeletion = ({ messageToDelete, setMessageToDelete, height }: TypeProps) => {
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: handleDeleteMessage,
    onSuccess: (deletedMessage) => {
      socket?.emit("interact-with-public-message", deletedMessage);
      queryClient.setQueryData(
        ["public-chat-messages"],
        (previous: TypeCashedPublicChat): TypeCashedPublicChat | undefined => {
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
        }
      );
    },
    onError: (error) => {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
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
      className="absolute w-full top-0 z-[1] bg-[#03020ad2]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sticky top-[35%] border border-[#645252] bg-[#242222] rounded-lg mx-2 p-4"
      >
        <p className="text-sm text-[#87abc9] font-bold text-center mb-6">
          Are your sure to delete your message ?
        </p>

        <div className="flex items-center justify-center gap-x-4">
          <button
            disabled={mutation.status === "pending"}
            onClick={() => {
              mutation.mutate(messageToDelete);
            }}
            className="bg-[#2d773f] rounded-lg py-1 px-8"
          >
            {mutation.status === "pending" ? <Spinner className="w-5 h-5" /> : "Yes"}
          </button>
          <button
            onClick={() => setMessageToDelete(null)}
            disabled={mutation.status === "pending"}
            className="bg-[#0f0e29] rounded-lg py-1 px-9"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};
