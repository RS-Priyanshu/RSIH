import express from "express";
import {
  registerTeam,
  getTeamsByCollege,
  checkTeamSubmission,
  getMyCollege,
  getMyTeams,
} from "../controllers/spocController.js";
import { verifyToken, isSpoc } from "../middleware/authMiddleware.js";

const router = express.Router();

// All SPOC routes are protected
router.use(verifyToken, isSpoc);

// SPOC Operations
router.get("/college", getMyCollege);
router.get("/teams", getMyTeams);
router.post("/team", registerTeam);
router.get("/college/:collegeId/teams", getTeamsByCollege);
router.get("/team/:teamId/submission", checkTeamSubmission);

export default router;
