import express from "express";
import multer from "multer";
import { registerSpoc, loginUser, registerUser } from "../controllers/authController.js";

const router = express.Router();

// Multer setup for file upload
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const tmpDir = path.join(process.cwd(), "uploads", "tmp");
const spocDir = path.join(process.cwd(), "uploads", "spoc_pdfs");

[tmpDir, spocDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, Date.now() + "_" + sanitizedName);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Routes
router.post("/register-spoc", upload.single("pdf"), registerSpoc);
router.post("/login", loginUser);
router.post("/register", registerUser)

export default router;
