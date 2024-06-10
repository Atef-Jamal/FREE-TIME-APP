import express, { Router } from "express";
import authRouter from "../authRoutes";
import usersRouter from "../usersRoutes";
import conversationsRoute from "../privateChatRoutes";
import notificationRoute from "../notificationRoutes";
import publicChatRoute from "../publicChatRoutes";
import songRoute from "../songRoutes";
import taskRoute from "../appsRoutes";
import frameRoute from "../frameRoutes";
import testimonialRoute from "../testimonialRoutes";
import couponRoute from "../couponRoutes";
import searchRoute from "../searchRoute";
import rewardsRoutes from "../rewardsRoutes";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/users", usersRouter);

router.use("/conversations", conversationsRoute);

router.use("/publicchat", publicChatRoute);

router.use("/notifications", notificationRoute);

router.use("/tasks", taskRoute);

router.use("/songs", songRoute);

router.use("/frames", frameRoute);

router.use("/testimonials", testimonialRoute);

router.use("/coupons", couponRoute);

router.use("/search", searchRoute);

router.use("/rewards", rewardsRoutes);

export default Router().use("/api", router);
