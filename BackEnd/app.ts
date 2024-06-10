import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connecteToMongodb } from "./db/connectToMongodb";
// import authRouter from "./routes/authRoutes";
// import usersRouter from "./routes/usersRoutes";
// import conversationsRoute from "./routes/privateChatRoutes";
// import notificationRoute from "./routes/notificationRoutes";
// import publicChatRoute from "./routes/publicChatRoutes";
// import songRoute from "./routes/songRoutes";
// import taskRoute from "./routes/appsRoutes";
// import frameRoute from "./routes/frameRoutes";
// import testimonialRoute from "./routes/testimonialRoutes";
// import couponRoute from "./routes/couponRoutes";
// import searchRoute from "./routes/searchRoute";
// import rewardsRoutes from "./routes/rewardsRoutes";
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

server.listen(process.env.PORT, () => {
  console.log(`success server Running on port: ${process.env.PORT}`);
});
