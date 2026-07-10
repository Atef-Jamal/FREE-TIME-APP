import express, { Router } from "express";
import authRouter from "./authRoutes.js";
import usersRouter from "./usersRoutes.js";
import conversationsRoute from "./privateChatRoutes.js";
import notificationRoute from "./notificationRoutes.js";
import publicChatRoute from "./publicChatRoutes.js";
import musicsRoutes from "./musicsRoutes.js";
import taskRoute from "./offersRoutes.js";
import frameRoute from "./frameRoutes.js";
import testimonialRoute from "./testimonialRoutes.js";
import couponRoute from "./couponRoutes.js";
import searchRoute from "./searchRoute.js";
import rewardsRoutes from "./rewardsRoutes.js";
import dateRoutes from "./dateRoutes.js";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/users", usersRouter);

router.use("/conversations", conversationsRoute);

router.use("/publicchat", publicChatRoute);

router.use("/notifications", notificationRoute);

router.use("/offers", taskRoute);

router.use("/musics", musicsRoutes);

router.use("/frames", frameRoute);

router.use("/testimonials", testimonialRoute);

router.use("/coupons", couponRoute);

router.use("/search", searchRoute);

router.use("/rewards", rewardsRoutes);

router.use("/date", dateRoutes);

export default Router().use("/api", router);
