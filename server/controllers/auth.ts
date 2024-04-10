import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { io, onLineUsers } from "../server";
import Notification from "../models/notification";
import PublicMessage from "../models/publicMessage";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword, profilePicture } = req.body;
  const referrerUser = req.query.ref;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(408).json({ error: "all field required" });
  }
  try {
    const userExisted = await User.findOne({ email });

    if (userExisted) {
      return res.status(404).json({ error: "user already existed in db" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePicture,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { userId: savedUser._id },
      "a8908f02766c63417f00659f49549eaff1e043e87b7f84c5abac96c142c9896a"
    );

    if (referrerUser) {
      const existedUser = await User.findById(referrerUser);
      if (existedUser) {
        const createNotification = new Notification({
          belongsTo: referrerUser,
          type: "REFERRER",
          isCollected: false,
          referredUser: savedUser._id,
          prize: 100,
        });
        const saveNotification = await createNotification.save();
        const savedNotification = await saveNotification.populate(
          "referredUser",
          "-password"
        );
        const createPublicMessage = new PublicMessage({
          type: "FREETIME",
          typeOfTask: "REFERRER",
          sender: referrerUser,
          newUserReferred: savedUser._id,
        });
        const saveMessage = await createPublicMessage.save();
        const savedMessage = await saveMessage.populate([
          { path: "sender", select: "-password" },
          { path: "newUserReferred", select: "-password" },
        ]);
        io.emit("public-message", savedMessage);
        io.to(onLineUsers[referrerUser as string]).emit(
          "new-notification",
          savedNotification
        );
      }
    }
    io.emit("new-user-register", savedUser);
    return res.status(201).json({ ...savedUser, token });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(404).json({ error: "invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      "a8908f02766c63417f00659f49549eaff1e043e87b7f84c5abac96c142c9896a"
    );

    return res.status(200).json({ ...user, token });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "internal server error" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!authHeader || !token) {
    return res.json({ error: "server error token must be exist" });
  }

  try {
    const user: any = jwt.verify(
      token,
      "a8908f02766c63417f00659f49549eaff1e043e87b7f84c5abac96c142c9896a"
    );

    const getUser = await User.findById(user.userId).select("-password");

    if (!getUser) {
      return res.status(404).json({ error: "user not found" });
    }
    const populateedUser = await getUser.populate("myFrames");

    return res.status(200).json(populateedUser);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "server - from currentuser route" });
  }
};

export const sendEmailVerificationCode = async (
  req: Request,
  res: Response
) => {
  const currentUserId = req.user._id;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "server -user not found" });
    }

    const isVerifiedBefore = user.emailVerified;

    if (isVerifiedBefore) {
      return res.status(404).json({ error: "Sorry, Email Already Verified" });
    }

    const generateCode = Math.floor(Math.random() * 9000) + 1000;

    user.emailVerificationCode = {
      code: generateCode.toString(),
      date: new Date(Date.now()),
    };

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "atefgmal778@gmail.com",
        pass: "vdeb nlom zols lrvp",
      },
    });

    const options: Mail.Options = {
      from: "atefgmal778@gmail.com",
      to: user.email,
      subject: "Verify Your Email Adress",
      text: `verification code : ${generateCode}`,
    };

    await transporter.sendMail(options);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      error: "server - fail to send verification code, an error occurred",
    });
  }
};

export const verifyEmailCode = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const enteredCode = req.body.enteredCode;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "server -user not found" });
    }

    const isVerifiedBefore = user.emailVerified;

    if (isVerifiedBefore) {
      return res.status(404).json({ error: "Sorry, Email Already Verified" });
    }

    const storedCode = user.emailVerificationCode?.code.toString();

    if (enteredCode.toString() !== storedCode) {
      return res.status(404).json({ message: "incorrect verification code" });
    }
    user.emailVerified = true;
    await user.save();

    const createNotification = new Notification({
      belongsTo: currentUserId,
      type: "EMAIL-VERIFIED",
      prize: 100,
    });
    const savedNotification = await createNotification.save();
    const createPublicMessage = new PublicMessage({
      sender: currentUserId,
      typeOfTask: "EMAIL-VERIFIED",
      type: "FREETIME",
    });
    const savePublicMessage = await createPublicMessage.save();
    const populatedMessage = await savePublicMessage.populate(
      "sender",
      "-password"
    );

    io.to(onLineUsers[currentUserId]).emit(
      "new-notification",
      savedNotification
    );
    io.emit("public-message", populatedMessage);

    return res.status(200).json({ message: "successfully verified" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      message: "server - can not verify your email, an error occurred",
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const { enterdOldPass, newPass } = req.body;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const oldPassword = user.password;

    const isCorrect = await bcrypt.compare(enterdOldPass, oldPassword);

    if (!isCorrect) {
      return res.status(404).json({ error: "old password is not correct" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "password changed successfullty" });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ error: "server - can not change password, an error occurred" });
  }
};

export const changeName = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const { newName } = req.body;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res
        .status(404)
        .json({ error: "can not change name because user not found" });
    }
    if (newName === "") {
      return res.status(404).json({ error: "please Enter Name" });
    }
    user.name = newName.toString();
    const savedUser = await user.save();
    return res.status(200).json(savedUser);
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ error: "can not change name, an error occurred" });
  }
};
