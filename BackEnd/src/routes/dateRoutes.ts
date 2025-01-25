import express from "express";
import { getDate } from "../controllers/dateController";

const router = express.Router();

router.get("/", getDate);

export default router;
