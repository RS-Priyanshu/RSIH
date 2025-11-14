import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import { getAllPS } from "./controllers/adminController.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import spocRoutes from "./routes/spocRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Database connection check
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Database connection error:", err.message));

// Public routes (no authentication required)
app.get("/api/public/ps", getAllPS); // Public route for problem statements

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/spoc", spocRoutes);
app.use("/api/team", teamRoutes);

app.get("/", (req, res) => res.send("SIH Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
