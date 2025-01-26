import { Request, Response } from "express";
import Frame from "../models/frame";
import User from "../models/user";
import PublicMessage from "../models/publicMessage";
import { io, onLineUsers } from "../socketIo/socketIo";
import BuyFrame from "../models/notifications/buyFrame";

export const getAllFrames = async (_: Request, res: Response) => {
  try {
    const allFrames = await Frame.find();
    return res.status(200).json(allFrames);
  } catch (error) {
    return res.status(404).json({ error: "can't get Load Frames" });
  }
};

export const buyFrame = async (req: Request, res: Response) => {
  const { points, myFrames, _id } = req.currentUser ? req.currentUser : null;
  const { frameId } = req.params;

  try {
    const frame = await Frame.findById(frameId);

    if (!frame) {
      return res.status(404).json("Frame not found");
    }

    const price = frame.price;

    if (points < price) {
      return res.status(404).json({ error: "sorry, your points is not Enough" });
    }

    if (myFrames.includes(frame._id)) {
      return res.status(404).json({ error: "Already buyed Before, try with another" });
    }

    const user = await User.findByIdAndUpdate(
      _id,
      {
        points: points - price,
        $push: { myFrames: frame._id },
      },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: "an error occurred, try again" });
    }

    frame.purshasedBy.push(_id);
    const savedFrame = await frame.save();

    const createNotification = new BuyFrame({
      type: "BUY-FRAME",
      belongsTo: _id,
      frame: frame._id,
      price: frame.price,
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
    const savedPublicMessage = await savePublicMessage.populate("sender", "-password");

    io.emit("public-message", savedPublicMessage);

    return res.status(200).json({ points: user.points, savedFrame });
  } catch (error) {
    return res.status(404).json({ error: "can't buy Frame, an error occured" });
  }
};
