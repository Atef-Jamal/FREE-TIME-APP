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
// import Task from "./models/task";
// import Task from "./models/task";
// import cron from "node-cron";
// import moment from "moment-timezone";
// import { grantRewardsToAllUsers } from "./utils";

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

export const onLineUsers: { [key: string]: string } = {};

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

// const scheduleTime = moment
//   .tz("12:00", "HH:mm", "Africa/Cairo")
//   .tz("EET")
//   .format("m H * * *");

// cron.schedule(scheduleTime, grantRewardsToAllUsers);

// const train = async () => {
//   try {
//     const res = await Task.updateMany(
//       { rating: 1 },
//       {
//         devices: "DESKTOP",
//       }
//     );
//     console.log(res);
//   } catch (error) {
//     console.log(error);
//   }
// };

// train();

io.on("connection", (socet) => {
  const userId = socet.handshake.query.userId;
  if (userId !== undefined) {
    onLineUsers[userId as string] = socet.id;
  }
  io.emit("online-users", Object.keys(onLineUsers));

  socet.on("new-user-joined", (newUser) => {
    io.emit("new-user-joined", newUser);
  });

  socet.on("user-updated", (updatedUser) => {
    io.emit("user-updated", updatedUser);
  });

  socet.on("public-message", (message) => {
    io.emit("public-message", message);
  });

  socet.on("interact-with-public-message", (updatedMessage) => {
    io.emit("interact-with-public-message", updatedMessage);
  });

  socet.on("conversation-readed", (data) => {
    io.to(onLineUsers[data.reciever]).emit("conversation-readed", data);
  });

  socet.on("disconnect", () => {
    const userId = socet.handshake.query.userId;
    delete onLineUsers[userId as string];
    io.emit("online-users", Object.keys(onLineUsers));
  });
});

server.listen(process.env.PORT, () => {
  connecteToMongodb();
  console.log(`success server Running on port: ${process.env.PORT}`);
});
