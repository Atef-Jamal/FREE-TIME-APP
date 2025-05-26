import express from "express";
import {
  changePassword,
  getCurrentUser,
  login,
  register,
  sendEmailVerificationCode,
  verifyEmailCode,
  changeName,
  signInWithProvider,
} from "../controllers/authController";
import passport from "passport";

import protectedRoute from "../middleware";
import { upload } from "../utils";

const router = express.Router();

router.post("/register", upload.single("profilePicture"), register);
router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false, prompt: "select_account" }),
);
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    prompt: "select_account",
  }),
  signInWithProvider,
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    prompt: "select_account",
  }),
  signInWithProvider,
);

router.get("/currentuser", protectedRoute, getCurrentUser);
router.get("/send-verification-email-code", protectedRoute, sendEmailVerificationCode);
router.post("/verifiyemail", protectedRoute, verifyEmailCode);
router.post("/changepassword", protectedRoute, changePassword);
router.post("/changename", protectedRoute, changeName);

export default router;
