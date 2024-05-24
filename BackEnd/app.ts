import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connecteToMongodb } from "./db/connectToMongodb";
import authRouter from "./routes/authRoutes";
import usersRouter from "./routes/usersRoutes";
import conversationsRoute from "./routes/privateChatRoutes";
import notificationRoute from "./routes/notificationRoutes";
import publicChatRoute from "./routes/publicChatRoutes";
import songRoute from "./routes/songRoutes";
import taskRoute from "./routes/appsRoutes";
import frameRoute from "./routes/frameRoutes";
import testimonialRoute from "./routes/testimonialRoutes";
import couponRoute from "./routes/couponRoutes";
import searchRoute from "./routes/searchRoute";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);

app.use(
  cors({
    origin: [process.env.CLIENT_BASE_URL!],
  })
);

export const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_BASE_URL!],
  },
});

app.use("/api/auth", authRouter);

app.use("/api/users", usersRouter);

app.use("/api/conversations", conversationsRoute);

app.use("/api/publicchat", publicChatRoute);

app.use("/api/notifications", notificationRoute);

app.use("/api/tasks", taskRoute);

app.use("/api/songs", songRoute);

app.use("/api/frames", frameRoute);

app.use("/api/testimonials", testimonialRoute);

app.use("/api/coupons", couponRoute);

app.use("/api/search", searchRoute);

app.use("/uploads", express.static(path.join("uploads")));

export const onLineUsers: { [key: string]: string } = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    onLineUsers[userId] = socket.id;
    io.emit("online-users", Object.keys(onLineUsers));
  }

  const handleUserUpdated = (updatedUser: any) => {
    socket.broadcast.emit("user-updated", updatedUser);
  };

  const handleNewPublicMessage = (message: any) => {
    socket.broadcast.emit("public-message", message);
  };

  const handleInteractWithPMessage = (updatedMessage: any) => {
    socket.broadcast.emit("interact-with-public-message", updatedMessage);
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
    socket.off("public-message", handleNewPublicMessage);
    socket.off("private-message", handleNewPrivateMessage);
    socket.off("interact-with-public-message", handleInteractWithPMessage);
    socket.off("conversation-readed", handleConversationReaded);
  };

  socket.on("user-updated", handleUserUpdated);
  socket.on("public-message", handleNewPublicMessage);
  socket.on("interact-with-public-message", handleInteractWithPMessage);
  socket.on("private-message", handleNewPrivateMessage);
  socket.on("conversation-readed", handleConversationReaded);
  socket.on("disconnect", handleDisconnect);
});

server.listen(process.env.PORT, () => {
  connecteToMongodb();
  console.log(`success server Running on port: ${process.env.PORT}`);
});
