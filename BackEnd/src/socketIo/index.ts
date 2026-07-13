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
  connected_guests: (guests: number) => void;
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
  const activeGuestConnections = new Map<string, Set<string>>();
  const activeUserConnections = new Map<string, Set<string>>();
  const activeConversations = new Map<string, Set<string>>();

  const userConnect = (userId: string, socketId: string): boolean => {
    if (!activeUserConnections.has(userId)) {
      activeUserConnections.set(userId, new Set());
    }
    activeUserConnections.get(userId)!.add(socketId);

    return activeUserConnections.get(userId)!.size === 1;
  };

  const userDisconnect = (userId: string, socketId: string): boolean => {
    if (!activeUserConnections.has(userId)) return false;

    const userSockets = activeUserConnections.get(userId)!;
    userSockets.delete(socketId);

    if (userSockets.size === 0) {
      activeUserConnections.delete(userId);
      return true;
    }

    return false;
  };

  const guestConnect = (ipAddress: string, socketId: string): boolean => {
    if (!activeGuestConnections.has(ipAddress)) {
      activeGuestConnections.set(ipAddress, new Set());
    }
    activeGuestConnections.get(ipAddress)!.add(socketId);

    return activeGuestConnections.get(ipAddress)!.size === 1;
  };

  const guestDisconnect = (ipAddress: string, socketId: string): boolean => {
    if (!activeGuestConnections.has(ipAddress)) return false;

    const guestSockets = activeGuestConnections.get(ipAddress)!;
    guestSockets.delete(socketId);

    if (guestSockets.size === 0) {
      activeGuestConnections.delete(ipAddress);
      return true;
    }

    return false;
  };

  const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(server, {
    cors: { origin: process.env.CLIENT_BASE_URL, credentials: true },
  });

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
    const ip = socket.handshake.address;

    const isFirsGuesttTab = guestConnect(ip, socket.id);
    if (isFirsGuesttTab) {
      io.emit("connected_guests", activeGuestConnections.size);
    }

    if (userId) {
      const isFirstUserTab = userConnect(userId, socket.id);
      if (isFirstUserTab) {
        socket.broadcast.emit("online_users", [...activeUserConnections.keys()]);
        try {
          await User.findByIdAndUpdate(userId, { isOnline: true });
        } catch (error) {
          console.log(`Failed to update user status in DB: ${userId}`);
        }
      }

      socket.on("user_joined_conversation", ({ firstParty, secondParty }) => {
        const key = getActiveConversationKey(firstParty, secondParty);

        if (!activeConversations.has(key)) {
          activeConversations.set(key, new Set());
        }
        activeConversations.get(key)!.add(firstParty);
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
      const isLastGuestTab = guestDisconnect(ip, socket.id);
      if (isLastGuestTab) {
        io.emit("connected_guests", activeGuestConnections.size);
      }
      if (userId) {
        const isLastUserTab = userDisconnect(userId, socket.id);
        if (isLastUserTab) {
          socket.broadcast.emit("online_users", [...activeUserConnections.keys()]);
          try {
            await User.findByIdAndUpdate(userId, { isOnline: false });
          } catch (err) {
            console.error("Failed to update user status in DB:", err);
          }
        }
      }
    });
  });
  return { io, onlineUsers: activeUserConnections, activeConversations };
};

export default initializeSocket;
