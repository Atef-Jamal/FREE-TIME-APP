import path from "path";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import initializeSocket from "./socketIo/index.js";
import routes from "./routes/routes.js";
import { connectToRedis } from "./lib/redis.js";
import passport from "./lib/passport.js";
import { connecteToMongodb } from "./lib/db.js";
dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_BASE_URL, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

await connecteToMongodb();
await connectToRedis();

// const g = async () => {
//   const numbers = Array.from({ length: 10000 }, (_, i) => i);

//   await User.create(
//     numbers.map((number) => ({
//       name: `Anonymous-${number + 1}`,
//       email: `anonymous-${number + 1}@gmail.com`,
//       password: "111111",
//       profilePicture: "https://res.cloudinary.com/dql5bc50n/image/upload/v1780306060/avatar_uogqav.jpg",
//     })),
//   );
//   console.log("Done");
// };

// g();
const server = http.createServer(app);

export const { io, onlineUsers, activeConversations } = initializeSocket(server);

app.use("/uploads", express.static(path.resolve("src/uploads")));

app.use(routes);

app.use((_, res) => {
  return res.status(500).json({
    error: "Internal server error",
  });
});

server.listen(process.env.PORT, () => {
  console.log(`success server Running on port: ${process.env.PORT}`);
});
