/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import http from "http";
import User from "../models/user";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";

declare module "socket.io" {
  interface Socket {
    isAuthenticated: boolean;
    userId?: Types.ObjectId;
  }
}

interface IDecodedToken {
  userId: string;
  iat?: number;
}

type TypeIO = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
type IServer = http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

export const onLineUsers: { [key: string]: string } = {};

export let io: TypeIO;

const initializeSocket = function (server: IServer) {
  io = new Server(server, { cors: { origin: "*" } });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      socket.isAuthenticated = false;
      return next();
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as IDecodedToken;
      socket.userId = new Types.ObjectId(decoded.userId);
      socket.isAuthenticated = true;
      next();
    } catch (error) {
      socket.isAuthenticated = false;
      next();
    }
  });

  const setupPublicHandlers = (socket: Socket) => {
    socket.on("new-user-registered", () => {
      socket.broadcast.emit("new-user-registered");
    });
    socket.on("user-updated", (updatedUser: any) => {
      socket.broadcast.emit("user-updated", updatedUser);
    });
    socket.on("public-message", (message: any) => {
      socket.broadcast.emit("public-message", message);
    });
    socket.on("typing-public-message", () => {
      socket.broadcast.emit("typing-public-message");
    });
    socket.on("stop-typing-public-message", () => {
      socket.broadcast.emit("stop-typing-public-message");
    });
    socket.on("public-message-interaction", (updatedMessage: any) => {
      socket.broadcast.emit("public-message-interaction", updatedMessage);
    });
  };

  const setupPrivateHandlers = (socket: Socket) => {
    if (!socket.isAuthenticated || !socket.userId) return;
    socket.on("private-message", (message: any) => {
      if (!onLineUsers[message.to]) return;
      socket.to(onLineUsers[message.to]).emit("private-message", message.data);
    });
    socket.on("conversation-readed", (data: any) => {
      if (!onLineUsers[data.reciever]) return;
      socket.to(onLineUsers[data.reciever]).emit("conversation-readed", data);
    });
  };

  const updateUserStatus = async (socket: Socket, online: boolean) => {
    if (!socket.userId) return;
    if (online === true) onLineUsers[socket.userId.toString()] = socket.id;
    if (online === false) delete onLineUsers[socket.userId.toString()];
    try {
      await User.findByIdAndUpdate(socket.userId, { $set: { isOnline: online } });
    } catch (error) {
      // console.log(error);
    }
  };

  const emitOnlineUsers = () => {
    const onlineUsers = Object.keys(onLineUsers).map((id) => new Types.ObjectId(id));
    io.emit("online-users", onlineUsers);
  };

  io.on("connection", async (socket) => {
    await updateUserStatus(socket, true);
    const getOnlineUsers = Object.keys(onLineUsers);
    io.emit("online-users", getOnlineUsers);

    const handleDisconnect = async () => {
      await updateUserStatus(socket, false);
      emitOnlineUsers();
      socket.removeAllListeners();
    };
    setupPublicHandlers(socket);
    setupPrivateHandlers(socket);
    socket.on("disconnect", handleDisconnect);
    socket.on("error", (d) => {
      console.log("Error", d);
    });
  });
};

export default initializeSocket;
