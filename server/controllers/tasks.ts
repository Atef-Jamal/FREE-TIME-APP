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
    console.log(error);
    return res.status(404).json({ error: "server - can not get all tasks" });
  }
};

export const getSingaleTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "task not found" });
    }
    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "server - can not get singale task" });
  }
};

export const completingTask = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const completedTasks = req.user.completedTasks;
  const { taskId } = req.params;
  const { answers } = req.body;
  try {
    const findedTask = await Task.findById(taskId);
    if (!findedTask) {
      return res.status(404).json({ error: "server - task not found" });
    }
    const isCompletedBefore =
      findedTask.completedBy.includes(currentUserId) ||
      completedTasks.includes(taskId);

    if (isCompletedBefore) {
      return res
        .status(404)
        .json({ error: "server - task completed Before, try another" });
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
        message: "failed to pass this task, try again",
      });
    }

    findedTask.completedBy.push(currentUserId);
    const savedTask = await findedTask.save();
    await User.findByIdAndUpdate(
      currentUserId,
      { $push: { completedTasks: taskId } },
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
    console.log(error);
    return res
      .status(404)
      .json({ error: "server - can not complete task an error occurred" });
  }
};

export const completingGame = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  try {
    const game = await Task.findById(gameId);

    if (!game) {
      return res.status(404).json({ error: "game not found" });
    }

    const isCompleted = req.user.completedTasks.includes(gameId);

    if (isCompleted) {
      return res
        .status(404)
        .json({ error: "game is completed before, try another" });
    }
    game.completedBy.push(req.user._id);
    await game.save();
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        completedTasks: gameId,
      },
    });

    const createNotification = new Notification({
      belongsTo: req.user._id,
      type: "GUESS-CARD",
      isCollected: false,
      prize: 48,
    });
    const savedNotification = await createNotification.save();
    const createPublicMessage = new PublicMessage({
      sender: req.user._id,
      type: "FREETIME",
      typeOfTask: "TASK",
    });
    const savePublicMessage = await createPublicMessage.save();
    const populatedPublicMessage = await savePublicMessage.populate(
      "sender",
      "-password"
    );

    io.to(onLineUsers[req.user._id]).emit(
      "new-notification",
      savedNotification
    );

    io.emit("public-message", populatedPublicMessage);

    return res.status(200).json({ message: "passed sucessfully" });
  } catch (error) {}
};
