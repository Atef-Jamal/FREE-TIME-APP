/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from "socket.io";
import http from "http";
import User from "../models/user";
import { verifyAccessToken } from "../services/authServices";
import * as cookie from "cookie";

type IServer = http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

export const onLineUsers: { [key: string]: string } = {};

const initializeSocket = function (server: IServer) {
  const io = new Server(server, { cors: { origin: process.env.CLIENT_BASE_URL, credentials: true } });

  io.use(async (socket, next) => {
    const reqCookie = socket.handshake.headers.cookie;

    if (!reqCookie) {
      socket.isAuthenticated = false;
      return next();
    }

    const cookies = cookie.parse(reqCookie);
    const token = cookies.accessToken;

    if (!token) {
      socket.isAuthenticated = false;
      return next();
    }

    try {
      const decoded: any = verifyAccessToken(token);
      socket.userId = decoded.userId;
      socket.isAuthenticated = true;
      return next();
    } catch (error) {
      socket.isAuthenticated = false;
      return next();
    }
  });

  const updateUserStatus = async (socket: Socket, online: boolean) => {
    if (!socket.userId) return;
    if (online === true) onLineUsers[socket.userId] = socket.id;
    if (online === false) delete onLineUsers[socket.userId];
    try {
      await User.findByIdAndUpdate(socket.userId, { $set: { isOnline: online } });
      io.emit("online-users", Object.keys(onLineUsers));
    } catch {
      return;
    }
  };

  io.on("connection", async (socket) => {
    await updateUserStatus(socket, true);

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

    socket.on("disconnect", async () => await updateUserStatus(socket, false));

    socket.on("error", (err) => {
      console.log("Socket Error", err);
    });

    // authenticated sockets
    if (!socket.isAuthenticated || !socket.userId) return;

    socket.on("private-message", (message: any) => {
      if (!onLineUsers[message.to]) return;
      socket.to(onLineUsers[message.to]).emit("private-message", message.data);
    });

    socket.on("conversation-readed", (data: any) => {
      if (!onLineUsers[data.reciever]) return;
      socket.to(onLineUsers[data.reciever]).emit("conversation-readed", data);
    });
  });

  return io;
};

export default initializeSocket;
