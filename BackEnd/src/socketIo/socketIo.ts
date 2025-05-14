/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import http from "http";

type TypeIO = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
type IServer = http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

export const onLineUsers: { [key: string]: string } = {};

export let io: TypeIO;

const socketOperations = function (server: IServer) {
  io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId as string;
    if (userId && userId !== "undefined") {
      onLineUsers[userId] = socket.id;
    }
    io.emit("online-users", Object.keys(onLineUsers));

    const handleUserUpdated = (updatedUser: any) => {
      socket.broadcast.emit("user-updated", updatedUser);
    };

    const handleNewUserRegistered = () => {
      socket.broadcast.emit("new-user-registered");
    };

    const handleNewPublicMessage = (message: any) => {
      socket.broadcast.emit("public-message", message);
    };

    const handleTypingPublicMessage = () => {
      socket.broadcast.emit("typing-public-message");
    };

    const handleStopTypingPublicMessage = () => {
      socket.broadcast.emit("stop-typing-public-message");
    };

    const handleInteractWithPMessage = (updatedMessage: any) => {
      socket.broadcast.emit("public-message-interaction", updatedMessage);
    };

    const handleNewPrivateMessage = (message: any) => {
      if (!onLineUsers[message.to]) return;
      socket.to(onLineUsers[message.to]).emit("private-message", message.data);
    };

    const handleConversationReaded = (data: any) => {
      if (!onLineUsers[data.reciever]) return;
      socket.to(onLineUsers[data.reciever]).emit("conversation-readed", data);
    };

    const handleDisconnect = () => {
      if (userId) {
        delete onLineUsers[userId];
        io.emit("online-users", Object.keys(onLineUsers));
      }
      socket.off("user-updated", handleUserUpdated);
      socket.off("new-user-registered", handleNewUserRegistered);
      socket.off("public-message", handleNewPublicMessage);
      socket.off("typing-public-message", handleTypingPublicMessage);
      socket.off("stop-typing-public-message", handleStopTypingPublicMessage);
      socket.off("private-message", handleNewPrivateMessage);
      socket.off("public-message-interaction", handleInteractWithPMessage);
      socket.off("conversation-readed", handleConversationReaded);
    };

    socket.on("new-user-registered", handleNewUserRegistered);
    socket.on("user-updated", handleUserUpdated);
    socket.on("public-message", handleNewPublicMessage);
    socket.on("typing-public-message", handleTypingPublicMessage);
    socket.on("stop-typing-public-message", handleStopTypingPublicMessage);
    socket.on("interact-with-public-message", handleInteractWithPMessage);
    socket.on("private-message", handleNewPrivateMessage);
    socket.on("conversation-readed", handleConversationReaded);
    socket.on("disconnect", handleDisconnect);
  });
};

export default socketOperations;
