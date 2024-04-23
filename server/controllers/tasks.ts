import { Request, Response } from "express";
import Task from "../models/task";
import User from "../models/user";
import Notification from "../models/notification";
import PublicMessage from "../models/publicMessage";
import { io, onLineUsers } from "../server";

export const getAllTasks = async (_: Request, res: Response) => {
  try {
    const allTasks = await Task.find();
    return res.status(200).json(allTasks);
  } catch (error) {
    return res.status(404).json({ error: "can't Load tasks and offere" });
  }
};

export const getSingaleTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "offer not found" });
    }
    return res.status(200).json(task);
  } catch (error) {
    return res
      .status(404)
      .json({ error: "can't Load task, an Error occurred" });
  }
};

export const completingTask = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const completedTasks = req.user.completedTasks;
  const { quizappId } = req.params;
  const { answers } = req.body;
  try {
    const findedTask = await Task.findById(quizappId);
    if (!findedTask) {
      return res.status(404).json({ error: "Task Not Found" });
    }
    const isCompletedBefore =
      findedTask.completedBy.includes(currentUserId) ||
      completedTasks.includes(quizappId);

    if (isCompletedBefore) {
      return res
        .status(404)
        .json({ error: "sorry, offer already completed, try another" });
    }

    let corrects = 0;
    let wrongs = 0;

    for (let index = 0; index < findedTask.quizes.length; index++) {
      if (answers[index] === findedTask.quizes[index].correctAnswer) {
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

    findedTask.completedBy.push(currentUserId);
    const savedTask = await findedTask.save();
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

export const completingGame = async (req: Request, res: Response) => {
  const { guessCardAppId } = req.params;
  const currentUserId = req.user._id;
  try {
    const game = await Task.findById(guessCardAppId);

    if (!game) {
      return res.status(404).json({ error: "Game Not Found" });
    }
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const isCompleted =
      user.completedTasks.includes(game._id) ||
      game.completedBy.includes(user._id);

    if (isCompleted) {
      return res
        .status(404)
        .json({ error: "Game is already completed, try another" });
    }

    game.completedBy.push(user._id);
    user.completedTasks.push(game._id);

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
    await game.save();
    return res.status(200).json({ message: "passed sucessfully" });
  } catch (error) {
    return res.status(404).json({ error: "an error occurred" });
  }
};
