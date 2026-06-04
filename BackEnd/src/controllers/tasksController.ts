import { Request, Response } from "express";
import Task, { IOffer } from "../models/offerModel.js";
import User from "../models/userModel.js";
import { io } from "../app.js";
import { onLineUsers } from "../socketIo/index.js";
import { userExcludedFields } from "../constants/index.js";
import { redisClient } from "../lib/redis.js";
import { Types } from "mongoose";
import NotificationModel from "../models/notificationModel.js";
import PublicMessageModel from "../models/publicMessageModel.js";
import OfferReviewModel from "../models/offerReviewModel.js";

type IFilterByPopularity = "ALL" | "POPULAR" | "REWARD" | "RAITING";
type IFilterByDevice = "ALL" | "DESKTOP" | "ANDROID" | "MAC";

export const getAllTasks = async (req: Request, res: Response) => {
  const filterByPopularity = (req.query.filterByPopularity as IFilterByPopularity) || "ALL";
  const filterByDevice = (req.query.filterByDevice as IFilterByDevice) || "ALL";
  const pageParam = parseInt(req.query.pageParam as string) || 1;
  const limitedPerPage = parseInt(req.query.limitedPerPage as string) || 20;
  const skip = (pageParam - 1) * limitedPerPage;

  try {
    const query = {
      ...(filterByPopularity === "POPULAR" && { completedBy: { $not: { $size: 0 } } }),
      ...(filterByPopularity === "REWARD" && { prize: { $gt: 150 } }),
      ...(filterByPopularity === "RAITING" && { rating: { $gt: 4 } }),
      devices: filterByDevice,
    };

    const tasksCacheKey = `tasks:list:${JSON.stringify({ query, skip, limitedPerPage })}`;
    const cachedTasks = await redisClient.get(tasksCacheKey);

    if (cachedTasks) {
      const hasMore = limitedPerPage === JSON.parse(cachedTasks).length;
      return res.status(200).json({ tasks: JSON.parse(cachedTasks), hasMore });
    }

    const tasks = await Task.find(query).skip(skip).limit(limitedPerPage);
    await redisClient.set(tasksCacheKey, JSON.stringify(tasks));

    const hasMore = limitedPerPage === tasks.length;
    return res.status(200).json({ tasks, hasMore });
  } catch (error) {
    return res.status(404).json({ error: "can't Load apps and offers" });
  }
};

export const getTaskDetails = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const taskDetailsCacheKey = `tasks:details:${taskId}`;

    const cachedTask = await redisClient.get(taskDetailsCacheKey);

    if (cachedTask) return res.status(200).json(JSON.parse(cachedTask));

    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ error: "Offer not found" });

    await redisClient.set(taskDetailsCacheKey, JSON.stringify(task));

    if (task.isAvailable === "UNAVAILABLE") {
      return res.status(404).json({ error: "This app is Not Available, try another app" });
    }
    return res.status(200).json(task);
  } catch (error) {
    return res.status(404).json({ error: "can't Load task, an Error occurred" });
  }
};

export const publicTaskDetails = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;

    const taskDetailsCacheKey = `tasks:details:${taskId}`;

    const cachedTask = await redisClient.get(taskDetailsCacheKey);

    if (cachedTask) {
      return res.status(200).json(JSON.parse(cachedTask));
    }

    const task = await Task.findById(taskId)
      .populate("completedBy", "name _id profilePicture")
      .populate({
        path: "reviews",
        populate: { path: "user", select: "profilePicture name _id" },
      });

    if (!task) {
      return res.status(404).json({ error: "offer not found" });
    }
    await redisClient.set(taskDetailsCacheKey, JSON.stringify(task));
    return res.status(200).json(task);
  } catch (error) {
    return res.status(404).json({ error: "can't Load task, an Error occurred" });
  }
};

export const completingQuizApp = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const completedTasks = req.user.completedTasks;
  const { quizappId } = req.params;
  const { answers } = req.body;
  try {
    const taskCacheKey = `tasks:details:${quizappId}`;

    let task;

    const cachedTask = await redisClient.get(taskCacheKey);

    if (cachedTask) {
      task = JSON.parse(cachedTask);
    } else {
      task = await Task.findById(quizappId);
      if (task) await redisClient.set(taskCacheKey, JSON.stringify(task));
    }

    if (!task) return res.status(404).json({ error: "App Not Found" });

    if (task.isAvailable === "UNAVAILABLE") {
      return res.status(404).json({ error: "sorry, this app is not available" });
    }

    const isAlreadyCompleted =
      task.completedBy.includes(req.user._id) || completedTasks.includes(new Types.ObjectId(quizappId));

    if (isAlreadyCompleted)
      return res.status(404).json({ error: "sorry, offer already completed, try another" });

    let corrects = 0;
    let wrongs = 0;

    for (let index = 0; index < task.quizes.length; index++) {
      if (answers[index] === task.quizes[index].correctAnswer) {
        corrects++;
      } else {
        wrongs++;
      }
    }

    if (wrongs >= corrects) {
      return res.status(200).json({
        corrects,
        wrongs,
        message: "Failed to pass this task, try again",
      });
    }

    task.completedBy.push(req.user._id);
    const savedTask = await task.save();

    await User.findByIdAndUpdate(req.user._id, { $push: { completedTasks: quizappId } }, { new: true });

    const newNotification = await NotificationModel.create({
      type: "QUIZ-APP",
      belongsTo: req.user._id,
      metadata: {
        isCollected: false,
        prize: savedTask.prize,
      },
    });
    const newMessage = await PublicMessageModel.create({
      type: "FREETIME",
      typeOfTask: "TASK",
      sender: req.user._id,
    });

    const populatedMessage = PublicMessageModel.findById(newMessage._id).populate(
      "sender",
      userExcludedFields,
    );

    await redisClient.del(`notifications:list:${req.user._id}`);

    io.to(onLineUsers[req.user._id.toString()]).emit("new-notification", newNotification);
    io.emit("public-message", populatedMessage);

    return res.status(200).json({ corrects, wrongs, message: "successfully completed" });
  } catch (error) {
    return res.status(404).json({ error: "can't complete task an error occurred" });
  }
};

export const completingGuessCard = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { guessCardAppId } = req.params;
  const completedTasks = req.user.completedTasks;

  try {
    const taskCacheKey = `tasks:details:${guessCardAppId}`;

    let task;

    const cachedTask = await redisClient.get(taskCacheKey);

    if (cachedTask) {
      task = JSON.parse(cachedTask);
    } else {
      task = await Task.findById(guessCardAppId);
      if (task) await redisClient.set(taskCacheKey, JSON.stringify(task));
    }

    if (!task) return res.status(404).json({ error: "Game Not Found" });

    if (task.isAvailable === "UNAVAILABLE") {
      return res.status(404).json({ error: "sorry, this app is not available" });
    }

    const isCompletedBefore =
      task.completedBy.includes(req.user._id) || completedTasks.includes(new Types.ObjectId(guessCardAppId));

    if (isCompletedBefore) {
      return res.status(404).json({ error: "sorry, offer already completed, try another" });
    }

    task.completedBy.push(req.user._id);
    await task.save();

    await User.findByIdAndUpdate(req.user._id, { $push: { completedTasks: guessCardAppId } }, { new: true });

    const newNotification = await NotificationModel.create({
      type: "GUESS-CARD",
      belongsTo: req.user._id,
      metadata: {
        isCollected: false,
        prize: task.prize,
      },
    });
    const newMessage = await PublicMessageModel.create({
      type: "FREETIME",
      typeOfTask: "TASK",
      sender: req.user._id,
    });

    const populatedMessage = PublicMessageModel.findById(newMessage._id).populate(
      "sender",
      userExcludedFields,
    );

    await redisClient.del(`notifications:list:${req.user._id}`);

    io.to(onLineUsers[req.user._id.toString()]).emit("new-notification", newNotification);
    io.emit("public-message", populatedMessage);

    return res.status(200).json({ message: "passed sucessfully" });
  } catch (error) {
    return res.status(404).json({ error: "an error occurred" });
  }
};

export const handleAddReview = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { appId } = req.params;
  const { comment } = req.body;

  try {
    const taskCacheKey = `tasks:details:${appId}`;

    let task: IOffer | null;

    const cachedTask = await redisClient.get(taskCacheKey);

    if (cachedTask) {
      task = JSON.parse(cachedTask);
    } else {
      task = await Task.findById(appId);
      if (task) await redisClient.set(taskCacheKey, JSON.stringify(task));
    }

    if (!task) return res.status(404).json({ error: "offer Not Found" });

    const newOfferReview = await OfferReviewModel.create({ offer: task._id, user: req.user._id, comment });
    const populatedOfferReview = await OfferReviewModel.findById(newOfferReview._id).populate(
      "user",
      userExcludedFields,
    );

    if (!populatedOfferReview) return res.status(404).json({ error: "an error occurred" });

    task.reviews.push(populatedOfferReview._id);
    await task.save();

    return res.status(200).json(populatedOfferReview);
  } catch (error) {
    return res.status(404).json({ error: "can not add review" });
  }
};
