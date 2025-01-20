/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import Task from "../models/task";
import User from "../models/user";
import Notification from "../models/notification";
import PublicMessage from "../models/publicMessage";
import { io } from "../app";
import AppsReview from "../models/appsReview";
import { onLineUsers } from "../socketIo/socketIo";

type IFilterByPopularity = "ALL" | "POPULAR" | "REWARD" | "RAITING";
type IFilterByDevice = "ALL" | "DESKTOP" | "ANDROID" | "MAC";

export const getAllTasks = async (req: Request, res: Response) => {
  const filterByPopularity = (req.query.filterByPopularity as IFilterByPopularity) || "ALL";
  const filterByDevice = (req.query.filterByDevice as IFilterByDevice) || "ALL";
  const pageParam = parseInt(req.query.pageParam as string) || 1;
  const limitedPerPage = parseInt(req.query.limitedPerPage as string) || 20;
  const skip = (pageParam - 1) * limitedPerPage;

  try {
    const query: {
      completedBy?: any;
      prize?: any;
      rating?: any;
      devices: IFilterByDevice;
    } = {
      devices: filterByDevice,
    };

    if (filterByPopularity === "POPULAR") {
      query.completedBy = { $not: { $size: 0 } };
    }
    if (filterByPopularity === "REWARD") {
      query.prize = { $gt: 150 };
    }
    if (filterByPopularity === "RAITING") {
      query.rating = { $gt: 4 };
    }

    const tasks = await Task.find(query).skip(skip).limit(limitedPerPage);
    const numAllDocuments = await Task.countDocuments(query);

    const hasMore = pageParam * limitedPerPage < numAllDocuments;
    return res.status(200).json({ tasks, hasMore });
  } catch (error) {
    return res.status(404).json({ error: "can't Load apps and offers" });
  }
};

export const getTaskDetails = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "offer not found" });
    }

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

    const task = await Task.findById(taskId)
      .populate("completedBy", "name _id profilePicture")
      .populate({
        path: "reviews",
        populate: { path: "user", select: "profilePicture name _id" },
      });

    if (!task) {
      return res.status(404).json({ error: "offer not found" });
    }

    return res.status(200).json(task);
  } catch (error) {
    return res.status(404).json({ error: "can't Load task, an Error occurred" });
  }
};

export const completingQuizApp = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser._id;
  const completedTasks = req.currentUser.completedTasks;
  const { quizappId } = req.params;
  const { answers } = req.body;
  try {
    const task = await Task.findById(quizappId);

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
    const createNotification = new Notification({
      belongsTo: currentUserId,
      isCollected: false,
      type: "QUIZ-APP",
      prize: savedTask.prize,
    });
    const createPublicMessage = new PublicMessage({
      type: "FREETIME",
      typeOfTask: "TASK",
      sender: currentUserId,
    });
    const savedNotification = await createNotification.save();
    const saveMessage = await createPublicMessage.save();
    const populatedMessage = await saveMessage.populate("sender", "-password");

    io.to(onLineUsers[currentUserId]).emit("new-notification", savedNotification);
    io.emit("public-message", populatedMessage);

    return res.status(200).json({ corrects, wrongs, message: "successfully completed" });
  } catch (error) {
    return res.status(404).json({ error: "can't complete task an error occurred" });
  }
};

export const completingGuessCard = async (req: Request, res: Response) => {
  const { guessCardAppId } = req.params;
  const currentUserId = req.currentUser._id;
  try {
    const task = await Task.findById(guessCardAppId);

    if (!task) {
      return res.status(404).json({ error: "Game Not Found" });
    }
    if (task.isAvailable === "UNAVAILABLE") {
      return res.status(404).json({ error: "sorry, this app is not available" });
    }

    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const isCompleted = user.completedTasks.includes(task._id) || task.completedBy.includes(user._id);

    if (isCompleted) {
      return res.status(404).json({ error: "Game is already completed, try another" });
    }

    task.completedBy.push(user._id);
    user.completedTasks.push(task._id);

    const createNotification = new Notification({
      belongsTo: user._id,
      type: "GUESS-CARD",
      isCollected: false,
      prize: 48,
    });
    const savedNotification = await createNotification.save();
    const createPublicMessage = new PublicMessage({
      sender: user._id,
      type: "FREETIME",
      typeOfTask: "TASK",
    });
    const savePublicMessage = await createPublicMessage.save();
    const populatedPublicMessage = await savePublicMessage.populate("sender", "-password");
    io.to(onLineUsers[user._id.toString()]).emit("new-notification", savedNotification);

    io.emit("public-message", populatedPublicMessage);
    await user.save();
    await task.save();
    return res.status(200).json({ message: "passed sucessfully" });
  } catch (error) {
    return res.status(404).json({ error: "an error occurred" });
  }
};

export const handleAddReview = async (req: Request, res: Response) => {
  const { appId } = req.params;
  const currentUserId = req.currentUser._id;
  const { comment } = req.body;

  try {
    const task = await Task.findById(appId);
    if (!task) {
      return res.status(404).json({ error: "app Not Found" });
    }
    const newReview = new AppsReview({ appId, user: currentUserId, comment });
    const savedReview = await newReview.save();
    const populated = await savedReview.populate("user");
    task.reviews.push(savedReview._id);
    await task.save();
    return res.status(200).json(populated);
  } catch (error) {
    return res.status(404).json({ error: "can not add review" });
  }
};
