import express, { Response, Request } from "express";
import dotenv from "dotenv";
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
// import Task from "./models/task";
// import Task from "./models/task";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: [process.env.CLIENT_BASE_URL!, "http://localhost:5173"],
  })
);

export const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_BASE_URL!, "http://localhost:5173"],
  },
});

export const onLineUsers: any = {};

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get("/api/health", (_, res) => {
  return res.status(200).json({ message: "OK" });
});

app.use("/api/users", usersRouter);

app.use("/api/conversations", conversationsRoute);

app.use("/api/publicchat", publicChatRoute);

app.use("/api/notifications", notificationRoute);

app.use("/api/tasks", taskRoute);

app.use("/api/songs", songRoute);

app.use("/api/frames", frameRoute);

app.use("/api/testimonials", testimonialRoute);

app.use("/api/coupons", couponRoute);

// app.get("/api/example", async (_, res) => {
//   try {

//     return res.status(200).json(response);
//   } catch (error) {
//     console.log(error);
//     return;
//   }
// });

app.get("/api/current-date", (_: Request, res: Response) => {
  const date = new Date();
  return res.status(200).json(date);
});

io.on("connection", (socet) => {
  const userId = socet.handshake.query.userId;
  if (userId !== undefined) {
    onLineUsers[userId as string] = socet.id;
  }
  io.emit("online-users", Object.keys(onLineUsers));

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

// app.use(express.static(path.join(__dirname, "../../client/dist")));

// app.get("*", (_: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
// });

server.listen(process.env.PORT, () => {
  connecteToMongodb();
  console.log(`success server Running on port: ${process.env.PORT}`);
});
