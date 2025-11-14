import { pool } from "../config/db.js";

// ✅ Get all SPOCs
export const getAllSPOCs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE role='SPOC'");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Verify a SPOC
export const verifySPOC = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE users SET verified=true WHERE id=$1", [id]);
    res.json({ message: "SPOC verified successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create Problem Statement
export const createPS = async (req, res) => {
  const { title, description, type, category } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO problem_statements (title, description, type, category) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, type, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all Problem Statements
export const getAllPS = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM problem_statements ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Problem Statement
export const updatePS = async (req, res) => {
  const { id } = req.params;
  const { title, description, type, category } = req.body;
  try {
    const result = await pool.query(
      "UPDATE problem_statements SET title=$1, description=$2, type=$3, category=$4 WHERE id=$5 RETURNING *",
      [title, description, type, category, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Problem Statement
export const deletePS = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM problem_statements WHERE id=$1", [id]);
    res.json({ message: "Problem statement deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ View all submissions
export const getAllSubmissions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, t.name AS team_name, p.title AS ps_title
      FROM submissions s
      JOIN teams t ON s.team_id = t.id
      JOIN problem_statements p ON s.ps_id = p.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
