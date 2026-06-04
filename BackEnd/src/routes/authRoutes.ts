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
  refreshToken,
  logOut,
} from "../controllers/authController.js";
import passport from "passport";

import protectedRoute from "../middleware/index.js";
import { uploadCloud } from "../lib/multer.js";

const router = express.Router();

router.post("/register", uploadCloud.single("profilePicture"), register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logOut);

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
    failureRedirect: `${process.env.CLIENT_BASE_URL}`,
    session: false,
    prompt: "select_account",
  }),
  signInWithProvider,
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.CLIENT_BASE_URL}`,
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
