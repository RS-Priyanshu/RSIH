import express from "express";
import {
  getAllSPOCs,
  verifySPOC,
  createPS,
  getAllPS,
  updatePS,
  deletePS,
  getAllSubmissions,
} from "../controllers/adminController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require admin
router.use(verifyToken, isAdmin);

// SPOC Management
router.get("/spocs", getAllSPOCs);
router.put("/spoc/:id/verify", verifySPOC);

// Problem Statements
router.post("/ps", createPS);
router.get("/ps", getAllPS);
router.put("/ps/:id", updatePS);
router.delete("/ps/:id", deletePS);

// Submissions overview
router.get("/submissions", getAllSubmissions);

export default router;
