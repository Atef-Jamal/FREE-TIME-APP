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
import http from "http";
import { Server } from "socket.io";
import User from "./models/user";

dotenv.config();
const app = express();
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

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join("uploads")));

app.get("/api/health", (_, res) => {
  return res.status(200).json({ message: "OK" });
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

app.get("/api/atef", (req) => {
  console.log(req.body);
});

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

server.listen(process.env.PORT, () => {
  connecteToMongodb();
  console.log(`success server Running on port: ${process.env.PORT}`);
});
