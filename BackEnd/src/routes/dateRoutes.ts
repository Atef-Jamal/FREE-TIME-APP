import express from "express";
import { getDate } from "../controllers/dateController.js";

const router = express.Router();

router.get("/", getDate);

export default router;
