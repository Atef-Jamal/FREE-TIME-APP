import express from "express";
import {
  changePassword,
  getCurrentUser,
  login,
  register,
  sendEmailVerificationCode,
  verifyEmailCode,
  changeName,
} from "../controllers/auth";
import protectedRoute from "../middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/currentuser", getCurrentUser);
router.post(
  "/sendverificationemailcode",
  protectedRoute,
  sendEmailVerificationCode
);
router.post("/verifiyemail", protectedRoute, verifyEmailCode);
router.post("/changepassword", protectedRoute, changePassword);
router.post("/changename", protectedRoute, changeName);

export default router;
