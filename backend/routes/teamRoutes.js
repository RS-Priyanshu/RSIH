import express from "express";
import {
  getAllPS,
  submitIdea,
  getMySubmissions,
  getMyTeam,
} from "../controllers/teamController.js";
import { verifyToken, isTeamLeader } from "../middleware/authMiddleware.js";

const router = express.Router();

// All team leader routes require authentication
router.use(verifyToken, isTeamLeader);

// Team Leader Actions
router.get("/team", getMyTeam);
router.get("/ps", getAllPS);
router.post("/submit", submitIdea);
router.get("/submissions", getMySubmissions);

export default router;
