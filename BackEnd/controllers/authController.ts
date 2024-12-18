import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { io } from "../app";
import Notification from "../models/notification";
import PublicMessage from "../models/publicMessage";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { onLineUsers } from "../socketIo/socketIo";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword, profilePicture } = req.body;
  const referrerUser = req.query.referrerUser;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(404).json({ error: "all field required" });
  }
  try {
    const userExisted = await User.findOne({ email });

    if (userExisted) {
      return res
        .status(404)
        .json({ error: "User already existed, Try Log in" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePicture:
        profilePicture || `${process.env.SERVER_BASE_URL}/uploads/avatar.jpeg`,
    });

    const savedUser = await newUser.save();

    if (!process.env.JWT_SECRET_KEY) {
      return res
        .status(404)
        .json({ error: "an Error occurred, try again later" });
    }

    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET_KEY
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
        io.to(onLineUsers[referrerUser.toString()]).emit(
          "new-notification",
          savedNotification
        );
      }
    }
    io.emit("new-user-joined", savedUser);
    return res.status(201).json({ ...savedUser, token });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "an Error occurred, Try again Later" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(404).json({ error: "Invalid Password" });
    }

    if (!process.env.JWT_SECRET_KEY) {
      return res
        .status(404)
        .json({ error: "an Error occurred, Try again later" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

    return res.status(200).json({ ...user, token });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "an Error occurred, Try again later" });
  }
};

export const signInWithGoogle = async (req: Request, res: Response) => {
  try {
    const { name, email, profilePicture, accessToken } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY!);
      return res.status(200).json({ ...user, token });
    } else {
      const newUser = new User({
        name,
        email,
        password: accessToken,
        emailVerified: true,
        profilePicture,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign(
        { userId: savedUser._id },
        process.env.JWT_SECRET_KEY!
      );

      return res.status(200).json({ ...savedUser, token });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "failed to sign in with google" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!authHeader || !token) {
    return res.json({ error: "unauthorized Request, Try to Log in " });
  }

  try {
    const user: any = jwt.verify(token, process.env.JWT_SECRET_KEY || "");

    const getUser = await User.findById(user.userId).select("-password");

    if (!getUser) {
      return res.status(404).json({ error: "User Not found" });
    }
    const populateedUser = await getUser.populate("myFrames");

    return res.status(200).json(populateedUser);
  } catch (error) {
    return res.status(404).json({ error: "An unexpected behaviour occurred" });
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
      return res.status(404).json({ error: "server - user not found" });
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
      text: `Verification code : ${generateCode}`,
    };

    await transporter.sendMail(options);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(404).json({
      error: "Failed to send verification code, an error occurred",
    });
  }
};

export const verifyEmailCode = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const enteredCode = req.body.enteredCode;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const isVerifiedBefore = user.emailVerified;

    if (isVerifiedBefore) {
      return res.status(404).json({ error: "Sorry, Email Already Verified" });
    }

    const storedCode = user.emailVerificationCode?.code.toString();

    if (enteredCode.toString() !== storedCode) {
      return res.status(404).json({ message: "Incorrect verification code" });
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
    return res.status(404).json({
      message: "Can't verify your email, an error occurred",
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const { enterdOldPass, newPass } = req.body;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }
    const oldPassword = user.password;

    const isCorrect = await bcrypt.compare(enterdOldPass, oldPassword);

    if (!isCorrect) {
      return res.status(404).json({ error: "Old Password is not correct" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfullty" });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "Can't change password, an error occurred" });
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
        .json({ error: "Can't change name because user not found" });
    }
    if (newName === "") {
      return res.status(404).json({ error: "please Enter Name" });
    }
    user.name = newName.toString();
    const savedUser = await user.save();
    return res.status(200).json({ name: savedUser.name });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "Can't change name, an error occurred" });
  }
};
