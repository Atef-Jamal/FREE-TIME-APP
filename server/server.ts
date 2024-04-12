import express, { Response, Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connecteToMongodb } from "./db/connectToMongodb";
import authRouter from "./routes/authRout";
import usersRouter from "./routes/usersRoute";
import conversationsRoute from "./routes/privateChatRoute";
import notificationRoute from "./routes/notificationRoute";
import publicChatRoute from "./routes/publicChatRoute";
import songRoute from "./routes/songRoute";
import taskRoute from "./routes/taskRoute";
import frameRoute from "./routes/frameRoute";
import testimonialRoute from "./routes/testimonialRoute";
import couponRoute from "./routes/couponRoute";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import User from "./models/user";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(cors());

export const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

app.use(express.json());
app.use(cookieParser());

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

app.use("/api/currentdate", (_: Request, res: Response) => {
  const date = new Date();
  return res.status(200).json(date);
});

export const onLineUsers: any = {};

io.on("connection", (socet) => {
  const userId = socet.handshake.query.userId;
  if (userId !== undefined) {
    onLineUsers[userId as string] = socet.id;
  }

  io.emit("getOnlineUsers", Object.keys(onLineUsers));

  socet.on("public-message", (message) => {
    io.emit("public-message", message);
  });

  socet.on("interact-with-public-message", (data) => {
    io.emit("interact-with-public-message", data);
  });

  socet.on("private-message", (data) => {
    io.to(onLineUsers[data.reciever]).emit("private-message", data.data);
  });

  socet.on("conversation-readed", (data) => {
    io.to(onLineUsers[data.reciever]).emit("conversation-readed", data);
  });

  socet.on("disconnect", () => {
    const userId = socet.handshake.query.userId;
    delete onLineUsers[userId as string];
    io.emit("getOnlineUsers", Object.keys(onLineUsers));
  });
});

setInterval(async () => {
  const users = await User.find().select("dailyReward");

  users.forEach(async (user) => {
    if (user.dailyReward.days.length === 7) {
      if (
        !user.dailyReward.days.some((item: any) => item.isCollected === false)
      ) {
        user.dailyReward = {
          week: user.dailyReward.week + 1,
          days: [{ day: 1, isCollected: false, reward: 50 }],
        };

        await user.save();
      }
    } else {
      const previosDay =
        user.dailyReward.days[user.dailyReward.days.length - 1];
      const newObj = {
        day: previosDay.day + 1,
        isCollected: false,
        reward: previosDay.day * 50,
      };
      user.dailyReward = {
        ...user.dailyReward,
        days: [...user.dailyReward.days, newObj],
      };

      await user.save();
    }
  });
}, 24 * 60 * 60 * 1000);

app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

server.listen(3000, () => {
  connecteToMongodb();
  console.log(`success server Running  on port: 3000`);
});
