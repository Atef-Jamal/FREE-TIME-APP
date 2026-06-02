/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import Task from "../models/task";
import User from "../models/user";
import PublicMessage from "../models/publicMessage";
import { io } from "../app";
import AppsReview from "../models/appsReview";
import { onLineUsers } from "../socketIo";
import Notification from "../models/notification";
import { userExcludedFields } from "../constants";
import { redisClient } from "../lib/redis";

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
    const allTasksCountCacheKey = `tasks:list:count:${JSON.stringify(query)}`;

    const cachedTasks = await redisClient.get(tasksCacheKey);
    const cachedAllTasksCount = await redisClient.get(allTasksCountCacheKey);

    if (cachedTasks && cachedAllTasksCount) {
      const hasMore = pageParam * limitedPerPage < JSON.parse(cachedAllTasksCount);

      return res.status(200).json({ tasks: JSON.parse(cachedTasks), hasMore });
    }

    const tasks = await Task.find(query).skip(skip).limit(limitedPerPage);
    const allTasksCount = await Task.countDocuments(query);

    await redisClient.set(tasksCacheKey, JSON.stringify(tasks));
    await redisClient.set(allTasksCountCacheKey, JSON.stringify(allTasksCount));

    const hasMore = pageParam * limitedPerPage < allTasksCount;
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

    if (cachedTask) {
      return res.status(200).json(JSON.parse(cachedTask));
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "offer not found" });
    }

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
  const currentUserId = req.user._id;
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

    if (!task) {
      return res.status(404).json({ error: "App Not Found" });
    }

    if (task.isAvailable === "UNAVAILABLE") {
      return res.status(404).json({ error: "sorry, this app is not available" });
    }

    const isCompletedBefore = task.completedBy.includes(currentUserId) || completedTasks.includes(quizappId);

    if (isCompletedBefore) {
      return res.status(404).json({ error: "sorry, offer already completed, try another" });
    }

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

    task.completedBy.push(currentUserId);
    const savedTask = await task.save();
    await User.findByIdAndUpdate(currentUserId, { $push: { completedTasks: quizappId } }, { new: true });
    const notification = new Notification({
      type: "QUIZ-APP",
      belongsTo: currentUserId,
      metadata: {
        isCollected: false,
        prize: savedTask.prize,
      },
    });
    const newPublicMessage = new PublicMessage({
      type: "FREETIME",
      typeOfTask: "TASK",
      sender: currentUserId,
    });
    await notification.save();
    await redisClient.del(`notifications:list:${currentUserId}`);
    const savedMessage = await newPublicMessage.save();
    const publicMessage = await savedMessage.populate("sender", userExcludedFields);
    io.to(onLineUsers[currentUserId]).emit("new-notification", notification);
    io.emit("public-message", publicMessage);

    return res.status(200).json({ corrects, wrongs, message: "successfully completed" });
  } catch (error) {
    return res.status(404).json({ error: "can't complete task an error occurred" });
  }
};

export const completingGuessCard = async (req: Request, res: Response) => {
  const { guessCardAppId } = req.params;
  const completedTasks = req.user.completedTasks;
  const currentUserId = req.user._id;
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

    if (!task) {
      return res.status(404).json({ error: "Game Not Found" });
    }

    if (task.isAvailable === "UNAVAILABLE") {
      return res.status(404).json({ error: "sorry, this app is not available" });
    }

    const isCompletedBefore =
      task.completedBy.includes(currentUserId) || completedTasks.includes(guessCardAppId);

    if (isCompletedBefore) {
      return res.status(404).json({ error: "sorry, offer already completed, try another" });
    }

    task.completedBy.push(currentUserId);
    await task.save();
    await User.findByIdAndUpdate(currentUserId, { $push: { completedTasks: guessCardAppId } }, { new: true });

    const notification = new Notification({
      type: "GUESS-CARD",
      belongsTo: currentUserId,
      metadata: {
        isCollected: false,
        prize: task.prize,
      },
    });
    await notification.save();
    await redisClient.del(`notifications:list:${currentUserId}`);
    const newPublicMessage = new PublicMessage({
      type: "FREETIME",
      sender: currentUserId,
      typeOfTask: "TASK",
    });

    const savedMessage = await newPublicMessage.save();
    const publicMessage = await savedMessage.populate("sender", userExcludedFields);

    io.to(onLineUsers[currentUserId]).emit("new-notification", notification);
    io.emit("public-message", publicMessage);

    return res.status(200).json({ message: "passed sucessfully" });
  } catch (error) {
    return res.status(404).json({ error: "an error occurred" });
  }
};

export const handleAddReview = async (req: Request, res: Response) => {
  const { appId } = req.params;
  const currentUserId = req.user._id;
  const { comment } = req.body;

  try {
    const taskCacheKey = `tasks:details:${appId}`;

    let task;

    const cachedTask = await redisClient.get(taskCacheKey);

    if (cachedTask) {
      task = JSON.parse(cachedTask);
    } else {
      task = await Task.findById(appId);
      if (task) await redisClient.set(taskCacheKey, JSON.stringify(task));
    }

    if (!task) {
      return res.status(404).json({ error: "offer Not Found" });
    }

    const newReview = new AppsReview({ appId, user: currentUserId, comment });

    const savedReview = await newReview.save();
    const populated = await savedReview.populate("user");
    task.reviews.push(savedReview.id);
    await task.save();
    return res.status(200).json(populated);
  } catch (error) {
    return res.status(404).json({ error: "can not add review" });
  }
};
