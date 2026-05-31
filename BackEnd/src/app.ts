import path from "path";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connecteToMongodb } from "./db/connectToMongodb";
import initializeSocket from "./socketIo";
import routes from "./routes/routes";
import passport from "./services/passport";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());

connecteToMongodb();

const server = http.createServer(app);

initializeSocket(server);

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
