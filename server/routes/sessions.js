import express from "express";
import { createSession, getMySessions, updateSession } from "../controllers/sessionController.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();

router.post("/", protect, createSession);
router.get("/", protect, getMySessions);
router.patch("/:id", protect, updateSession);

export default router;
