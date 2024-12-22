import express from "express";
import {
  changePassword,
  getCurrentUser,
  login,
  register,
  sendEmailVerificationCode,
  verifyEmailCode,
  changeName,
  signInWithGoogle,
} from "../controllers/authController";
import protectedRoute from "../middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/login-with-google", signInWithGoogle);
router.get("/currentuser", protectedRoute, getCurrentUser);
router.get(
  "/send-verification-email-code",
  protectedRoute,
  sendEmailVerificationCode
);
router.post("/verifiyemail", protectedRoute, verifyEmailCode);
router.post("/changepassword", protectedRoute, changePassword);
router.post("/changename", protectedRoute, changeName);

export default router;
