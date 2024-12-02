import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connecteToMongodb } from "./db/connectToMongodb";
import routes from "./routes/bigRoutes/routes";
import http from "http";
import { Server } from "socket.io";
import socketOperations from "./socketIo/socketIo";

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);

// app.use(
//   cors({
//     origin: [process.env.CLIENT_BASE_URL!],
//   })
// );

const allowedOrigins = process.env.CLIENT_BASE_URL!;

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORSSSSSS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

export const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_BASE_URL!],
  },
});

connecteToMongodb();
socketOperations(io);

app.use(routes);
app.use("/uploads", express.static(path.join("uploads")));

server.listen(process.env.PORT, () => {
  console.log(`success server Running on port: ${process.env.PORT}`);
});
