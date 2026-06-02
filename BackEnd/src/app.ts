import path from "path";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import initializeSocket from "./socketIo";
import routes from "./routes/routes";
import { IUser } from "./models/user";
import { connectToRedis } from "./lib/redis";
import passport from "./lib/passport";
import { connecteToMongodb } from "./lib/db";

declare module "express" {
  interface Request {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: IUser | any;
  }
}

declare module "socket.io" {
  interface Socket {
    isAuthenticated: boolean;
    userId?: string;
  }
}

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_BASE_URL, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

connecteToMongodb();
connectToRedis();

const server = http.createServer(app);

export const io = initializeSocket(server);

app.set("io", io);

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
