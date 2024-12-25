import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { connecteToMongodb } from "./db/connectToMongodb";
import routes from "./routes/bigRoutes/routes";
import http from "http";
import { Server } from "socket.io";
import socketOperations from "./socketIo/socketIo";

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

connecteToMongodb();
socketOperations(io);

app.use(routes);
app.use("/uploads", express.static(path.join("uploads")));

app.use((_: Request, res: Response) => {
  return res.status(500).json({
    error: "Internal server error",
  });
});

server.listen(process.env.PORT, () => {
  console.log(`success server Running on port: ${process.env.PORT}`);
});
