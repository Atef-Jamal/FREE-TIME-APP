import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { connecteToMongodb } from "./db/connectToMongodb";
import routes from "./routes/routes";
import http from "http";
import { Server } from "socket.io";
import socketOperations from "./socketIo/socketIo";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);

app.use(cors({ origin: "*" }));

export const io = new Server(server, { cors: { origin: "*" } });

connecteToMongodb();
socketOperations(io);

app.use(routes);

app.use("/uploads", express.static(path.resolve("src/uploads")));

app.use((_, res) => {
  return res.status(500).json({
    error: "Internal server error",
  });
});

server.listen(process.env.PORT, () => {
  console.log(`success server Running on port: ${process.env.PORT}`);
});
