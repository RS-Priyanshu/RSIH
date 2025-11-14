import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import fs from "fs";
import path from "path";

// ✅ SPOC Registration (with PDF upload)
export const registerSpoc = async (req, res) => {
  try {
    const { name, age, email, phone, institution, password } = req.body;
    const file = req.file;

    console.log("Received registration data:", { name, email, institution, hasFile: !!file });

    if (!file) {
      return res.status(400).json({ message: "Nomination PDF is required." });
    }

    // Validate required fields
    if (!name || !email || !phone || !institution || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user with email already exists
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "A user with this email already exists." });
    }

    // Check if SPOC already exists for institution
    const collegeCheck = await pool.query(
      "SELECT * FROM colleges WHERE LOWER(name)=LOWER($1)",
      [institution]
    );
    if (collegeCheck.rows.length > 0) {
      return res.status(400).json({ message: "A SPOC already exists for this institution." });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Create user with phone included
    const userRes = await pool.query(
      `INSERT INTO users (name, email, password, role, verified, phone)
       VALUES ($1, $2, $3, 'SPOC', false, $4) RETURNING id`,
      [name, email, hashed, phone]
    );

    const spocId = userRes.rows[0].id;

    // Create college
    await pool.query(
      `INSERT INTO colleges (name, spoc_id) VALUES ($1, $2)`,
      [institution, spocId]
    );

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "uploads", "spoc_pdfs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Sanitize filename for storage
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Move PDF to permanent storage
    const newPath = path.join(uploadDir, `${spocId}_${sanitizedName}`);
    
    // Check if source file exists
    if (!fs.existsSync(file.path)) {
      throw new Error("Uploaded file not found");
    }
    
    fs.renameSync(file.path, newPath);

    res.status(201).json({
      message: "SPOC registered successfully. Awaiting admin verification.",
    });
  } catch (err) {
    console.error("SPOC Registration Error:", err);
    res.status(500).json({ 
      error: err.message,
      message: "Failed to register SPOC. Please try again." 
    });
  }
};

// ✅ Login for all users
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (result.rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    if (user.role === "SPOC" && !user.verified)
      return res.status(403).json({ message: "SPOC not yet verified by Admin." });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Register for all other users
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Check if user already exists
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );
    if (userCheck.rows.length > 0)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, verified)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, role || "TEAM_LEADER"]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

