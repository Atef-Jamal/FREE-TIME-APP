import { Request, Response } from "express";
import Task from "../models/task";
import User from "../models/user";
import Notification from "../models/notification";
import PublicMessage from "../models/publicMessage";
import { io, onLineUsers } from "../app";

export const getAllApps = async (req: Request, res: Response) => {
  const filter = req.query.filter || "ALL";
  const page = parseInt(req.query.page as string) || 1;
  const limitedPerPage = parseInt(req.query.limitedPerPage as string) || 20;
  const skip = (page - 1) * limitedPerPage;

  try {
    let allApps;
    if (filter === "POPULAR") {
      allApps = await Task.find({ completedBy: { $not: { $size: 0 } } })
        .skip(skip)
        .limit(limitedPerPage)
        .populate("completedBy", "name _id profilePicture");
      allApps.sort((a, b) => {
        if (a.completedBy.length > b.completedBy.length) return -1;
        if (a.completedBy.length < b.completedBy.length) return 1;
        return 0;
        // return b.prize - a.prize;
      });
    } else if (filter === "REWARD") {
      allApps = await Task.find({ prize: { $gt: 150 } })
        .skip(skip)
        .limit(limitedPerPage)
        .populate("completedBy", "name _id profilePicture");
      allApps.sort((a, b) => {
        return b.prize - a.prize;
      });
    } else if (filter === "RAITING") {
      allApps = await Task.find({ rating: { $gt: 4 } })
        .skip(skip)
        .limit(limitedPerPage)
        .populate("completedBy", "name _id profilePicture");
      allApps.sort((a, b) => {
        return b.rating - a.rating;
      });
    } else if (filter === "DESKTOP") {
      allApps = await Task.find({ devices: "DESKTOP" })
        .skip(skip)
        .limit(limitedPerPage)
        .populate("completedBy", "name _id profilePicture");
    } else if (filter === "ANDROID") {
      allApps = await Task.find({ devices: "ANDROID" })
        .skip(skip)
        .limit(limitedPerPage)
        .populate("completedBy", "name _id profilePicture");
    } else if (filter === "MAC") {
      allApps = await Task.find({ devices: "MAC" })
        .skip(skip)
        .limit(limitedPerPage)
        .populate("completedBy", "name _id profilePicture");
    } else {
      allApps = await Task.find()
        .skip(skip)
        .limit(limitedPerPage)
        .populate("completedBy", "name _id profilePicture");
    }

    return res.status(200).json(allApps);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "can't Load apps and offers" });
  }
};

export const getAppDetails = async (req: Request, res: Response) => {
  try {
    const appId = req.params.id;
    const app = await Task.findById(appId);

    if (!app) {
      return res.status(404).json({ error: "offer not found" });
    }

    if (app.isAvailable === "UNAVAILABLE") {
      return res
        .status(404)
        .json({ error: "This app is Not Available, try another app" });
    }
    return res.status(200).json(app);
  } catch (error) {
    return res
      .status(404)
      .json({ error: "can't Load task, an Error occurred" });
  }
};

export const completingQuizApp = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const completedTasks = req.user.completedTasks;
  const { quizappId } = req.params;
  const { answers } = req.body;
  try {
    const app = await Task.findById(quizappId);

    if (!app) {
      return res.status(404).json({ error: "App Not Found" });
    }

    if (app.isAvailable === "UNAVAILABLE") {
      return res
        .status(404)
        .json({ error: "sorry, this app is not available" });
    }

    const isCompletedBefore =
      app.completedBy.includes(currentUserId) ||
      completedTasks.includes(quizappId);

    if (isCompletedBefore) {
      return res
        .status(404)
        .json({ error: "sorry, offer already completed, try another" });
    }

    let corrects = 0;
    let wrongs = 0;

    for (let index = 0; index < app.quizes.length; index++) {
      if (answers[index] === app.quizes[index].correctAnswer) {
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

    app.completedBy.push(currentUserId);
    const savedTask = await app.save();
    await User.findByIdAndUpdate(
      currentUserId,
      { $push: { completedTasks: quizappId } },
      { new: true }
    );
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

    io.to(onLineUsers[currentUserId]).emit(
      "new-notification",
      savedNotification
    );
    io.emit("public-message", populatedMessage);

    return res
      .status(200)
      .json({ corrects, wrongs, message: "successfully completed" });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "can't complete task an error occurred" });
  }
};

export const completingGuessCard = async (req: Request, res: Response) => {
  const { guessCardAppId } = req.params;
  const currentUserId = req.user._id;
  try {
    const app = await Task.findById(guessCardAppId);

    if (!app) {
      return res.status(404).json({ error: "Game Not Found" });
    }
    if (app.isAvailable === "UNAVAILABLE") {
      return res
        .status(404)
        .json({ error: "sorry, this app is not available" });
    }

    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const isCompleted =
      user.completedTasks.includes(app._id) ||
      app.completedBy.includes(user._id);

    if (isCompleted) {
      return res
        .status(404)
        .json({ error: "Game is already completed, try another" });
    }

    app.completedBy.push(user._id);
    user.completedTasks.push(app._id);

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
    const populatedPublicMessage = await savePublicMessage.populate(
      "sender",
      "-password"
    );
    io.to(onLineUsers[user._id.toString()]).emit(
      "new-notification",
      savedNotification
    );

    io.emit("public-message", populatedPublicMessage);
    await user.save();
    await app.save();
    return res.status(200).json({ message: "passed sucessfully" });
  } catch (error) {
    return res.status(404).json({ error: "an error occurred" });
  }
};
