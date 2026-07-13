import http from "http";
import { Server } from "socket.io";
import User, { IUser } from "../models/user.js";
import { verifyAccessToken } from "../services/authServices.js";
import * as cookie from "cookie";
import { IPublicChatItem } from "../models/publicMessage.js";
import { INotification } from "../models/notification.js";
import { IPrivateMessage } from "../models/privateMessage.js";
import { getActiveConversationKey } from "../utils/index.js";

interface ServerToClientEvents {
  connected_guests: (h: number) => void;
  public_chat_typing_start: () => void;
  public_chat_typing_stop: () => void;
  public_chat_message: (publicMessage: IPublicChatItem) => void;
  online_users: (usersIds: string[]) => void;
  user_updated: (updatedUser: IUser) => void;
  notification: (updatedUser: INotification) => void;
  public_chat_message_reaction: (publicMessage: IPublicChatItem) => void;
  private_chat_message: (privateMessage: IPrivateMessage) => void;
  conversation_read: (data: { receiver: string; sender: string }) => void;
}

interface ClientToServerEvents {
  public_chat_typing_start: () => void;
  public_chat_typing_stop: () => void;
  user_joined_conversation: (data: { firstParty: string; secondParty: string }) => void;
  user_leaved_conversation: (data: { firstParty: string; secondParty: string }) => void;
}

interface SocketData {
  userId: string;
}

type IServer = http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

const initializeSocket = function (server: IServer) {
  let totalGuests = 0;

  const onlineUsers = new Map<string, Set<string>>();

  const activeConversations = new Map<string, Set<string>>();

  const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(server, {
    cors: { origin: process.env.CLIENT_BASE_URL, credentials: true },
  });

  const trackUserConnection = (userId: string, socketId: string): void => {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId)!.add(socketId);
  };

  const trackUserDisconnection = (userId: string, socketId: string): void => {
    const userSockets = onlineUsers.get(userId);
    if (userSockets) {
      userSockets.delete(socketId);
      if (userSockets.size === 0) {
        onlineUsers.delete(userId);
      }
    }
  };

  io.use((socket, next) => {
    const reqCookie = socket.handshake.headers.cookie;

    if (!reqCookie) return next();

    const cookies = cookie.parse(reqCookie);
    const token = cookies.accessToken;

    if (!token) return next();
    try {
      const decoded: any = verifyAccessToken(token);
      socket.data.userId = decoded.userId;
      return next();
    } catch (error) {
      return next();
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.data.userId;

    totalGuests += 1;
    io.emit("connected_guests", totalGuests);
    if (userId) {
      try {
        const updated = await User.findByIdAndUpdate(
          userId,
          { $set: { isOnline: true } },
          { returnDocument: "after" },
        ).select("isOnline");

        if (updated) {
          trackUserConnection(userId, socket.id);
          io.emit("online_users", [...onlineUsers.keys()]);
        }
      } catch (error) {
        console.log(`Failed to connect online status for userId: ${userId}`);
      }

      socket.on("user_joined_conversation", ({ firstParty, secondParty }) => {
        const key = getActiveConversationKey(firstParty, secondParty);

        if (!activeConversations.has(key)) {
          activeConversations.set(key, new Set(firstParty));
        } else activeConversations.get(key)!.add(firstParty);
      });

      socket.on("user_leaved_conversation", ({ firstParty, secondParty }) => {
        const key = getActiveConversationKey(firstParty, secondParty);

        activeConversations.get(key)?.delete(firstParty);
        if (activeConversations.get(key)?.size === 0) {
          activeConversations.delete(key);
        }
      });
    }

    socket.on("public_chat_typing_start", () => {
      socket.broadcast.emit("public_chat_typing_start");
    });

    socket.on("public_chat_typing_stop", () => {
      socket.broadcast.emit("public_chat_typing_stop");
    });

    socket.on("disconnect", async () => {
      totalGuests -= 1;
      io.emit("connected_guests", totalGuests);
      if (userId) {
        try {
          const updated = await User.findByIdAndUpdate(
            userId,
            { $set: { isOnline: false } },
            {
              returnDocument: "after",
            },
          ).select("isOnline");

          if (updated) {
            trackUserDisconnection(userId, socket.id);
            io.emit("online_users", [...onlineUsers.keys()]);
          }
        } catch (error) {
          console.log(`Failed to disconnect online status for userId: ${userId}`);
        }
      }
    });
  });
  return { io, onlineUsers, activeConversations };
};

export default initializeSocket;
