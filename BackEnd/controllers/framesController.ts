import { Request, Response } from "express";
import Frame from "../models/frame";
import User from "../models/user";
import Notification from "../models/notification";
import { io } from "../app";
import PublicMessage from "../models/publicMessage";
import { onLineUsers } from "../socketIo/socketIo";

export const getAllFrames = async (_: Request, res: Response) => {
  try {
    const allFrames = await Frame.find();
    return res.status(200).json(allFrames);
  } catch (error) {
    return res.status(404).json({ error: "can't get Load Frames" });
  }
};

export const buyFrame = async (req: Request, res: Response) => {
  const { points, myFrames, _id } = req.currentUser;
  const { frameId } = req.params;
  try {
    const getFrame = await Frame.findById(frameId);

    if (!getFrame || !getFrame.price) {
      return res.status(404).json("Frame not found");
    }
    const price = getFrame.price;

    if (points < price) {
      return res
        .status(404)
        .json({ error: "sorry, your points is not Enough" });
    }

    if (myFrames.includes(getFrame._id)) {
      return res
        .status(404)
        .json({ error: "Already buyed Before, try with another" });
    }
    const user = await User.findByIdAndUpdate(
      _id,
      {
        points: points - price,
        $push: { myFrames: getFrame._id },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "an error occurred, try again" });
    }

    getFrame.purshasedBy.push(_id);
    const savedFrame = await getFrame.save();

    const createNotification = new Notification({
      belongsTo: _id,
      type: "BUY-FRAME",
      frame: getFrame._id,
    });

    const saveNotification = await createNotification.save();
    const savedNotification = await saveNotification.populate("frame");

    io.to(onLineUsers[_id]).emit("new-notification", savedNotification);

    const createPublicMessage = new PublicMessage({
      type: "FREETIME",
      typeOfTask: "FRAME",
      sender: _id,
    });

    const savePublicMessage = await createPublicMessage.save();
    const savedPublicMessage = await savePublicMessage.populate(
      "sender",
      "-password"
    );

    io.emit("public-message", savedPublicMessage);

    return res.status(200).json({ points: user.points, savedFrame });
  } catch (error) {
    return res.status(404).json({ error: "can't buy Frame, an error occured" });
  }
};
