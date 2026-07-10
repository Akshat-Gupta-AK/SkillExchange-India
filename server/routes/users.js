import express from "express";
import { getUsers, getUserById, updateProfile, getMatchSuggestions } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();

router.get("/", protect, getUsers);
router.get("/suggestions", protect, getMatchSuggestions);
router.get("/:id", protect, getUserById);
router.put("/profile", protect, updateProfile);

export default router;
