import express from "express";
import { sendMatchRequest, getMyMatches, updateMatchStatus } from "../controllers/matchController.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();

router.post("/", protect, sendMatchRequest);
router.get("/", protect, getMyMatches);
router.patch("/:id", protect, updateMatchStatus);

export default router;
