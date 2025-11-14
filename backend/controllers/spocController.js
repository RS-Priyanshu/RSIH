import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

// ✅ Register a team under SPOC
export const registerTeam = async (req, res) => {
  const { teamName, collegeId, leaderName, leaderEmail, leaderPassword } = req.body;
  try {
    // create team leader account
    const hashed = await bcrypt.hash(leaderPassword, 10);
    const leader = await pool.query(
      "INSERT INTO users (name, email, password, role, verified) VALUES ($1, $2, $3, 'TEAM_LEADER', true) RETURNING id",
      [leaderName, leaderEmail, hashed]
    );

    // create team
    const team = await pool.query(
      "INSERT INTO teams (name, college_id, leader_id) VALUES ($1, $2, $3) RETURNING *",
      [teamName, collegeId, leader.rows[0].id]
    );

    res.status(201).json({ message: "Team registered successfully.", team: team.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get SPOC's college info
export const getMyCollege = async (req, res) => {
  try {
    const spocId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM colleges WHERE spoc_id=$1",
      [spocId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "College not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all teams of a college
export const getTeamsByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const spocId = req.user.id;
    
    // Verify SPOC owns this college
    const collegeCheck = await pool.query(
      "SELECT id FROM colleges WHERE id=$1 AND spoc_id=$2",
      [collegeId, spocId]
    );
    if (collegeCheck.rows.length === 0) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const result = await pool.query(
      "SELECT t.*, u.name AS leader_name, u.email AS leader_email FROM teams t JOIN users u ON t.leader_id = u.id WHERE college_id=$1",
      [collegeId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get SPOC's teams (helper that gets college first)
export const getMyTeams = async (req, res) => {
  try {
    const spocId = req.user.id;
    const college = await pool.query(
      "SELECT id FROM colleges WHERE spoc_id=$1",
      [spocId]
    );
    if (college.rows.length === 0) {
      return res.json([]);
    }
    const collegeId = college.rows[0].id;
    const result = await pool.query(
      "SELECT t.*, u.name AS leader_name, u.email AS leader_email FROM teams t JOIN users u ON t.leader_id = u.id WHERE college_id=$1",
      [collegeId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Check if a team has submitted an idea
export const checkTeamSubmission = async (req, res) => {
  const { teamId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM submissions WHERE team_id=$1", [teamId]);
    if (result.rows.length === 0)
      return res.json({ submitted: false });
    res.json({ submitted: true, submission: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
