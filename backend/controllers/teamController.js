import { pool } from "../config/db.js";

// ✅ Get all open Problem Statements
export const getAllPS = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM problem_statements ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get team ID from leader ID
const getTeamIdFromLeader = async (leaderId) => {
  const result = await pool.query("SELECT id FROM teams WHERE leader_id=$1", [leaderId]);
  if (result.rows.length === 0) return null;
  return result.rows[0].id;
};

// ✅ Submit Idea for a PS
export const submitIdea = async (req, res) => {
  const { teamId, psId, title, abstract } = req.body;
  const leaderId = req.user.id;
  
  try {
    // If teamId not provided, get it from leader_id
    let finalTeamId = teamId;
    if (!finalTeamId) {
      finalTeamId = await getTeamIdFromLeader(leaderId);
      if (!finalTeamId) {
        return res.status(404).json({ message: "Team not found for this leader." });
      }
    }
    
    // Verify the team belongs to this leader
    const teamCheck = await pool.query("SELECT id FROM teams WHERE id=$1 AND leader_id=$2", [finalTeamId, leaderId]);
    if (teamCheck.rows.length === 0) {
      return res.status(403).json({ message: "Access denied. Team does not belong to you." });
    }

    const existing = await pool.query("SELECT * FROM submissions WHERE team_id=$1 AND ps_id=$2", [finalTeamId, psId]);
    if (existing.rows.length > 0)
      return res.status(400).json({ message: "Idea already submitted for this PS." });

    const result = await pool.query(
      "INSERT INTO submissions (team_id, ps_id, title, abstract, status) VALUES ($1, $2, $3, $4, 'SUBMITTED') RETURNING *",
      [finalTeamId, psId, title, abstract]
    );

    res.status(201).json({ message: "Idea submitted successfully.", submission: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all submissions for a team (by leader)
export const getMySubmissions = async (req, res) => {
  const leaderId = req.user.id;
  try {
    const teamId = await getTeamIdFromLeader(leaderId);
    if (!teamId) {
      return res.json([]);
    }
    const result = await pool.query(`
      SELECT s.*, p.title AS ps_title, p.description AS ps_description
      FROM submissions s
      JOIN problem_statements p ON s.ps_id = p.id
      WHERE s.team_id=$1
      ORDER BY s.id DESC
    `, [teamId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get my team info
export const getMyTeam = async (req, res) => {
  const leaderId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT t.*, c.name AS college_name
      FROM teams t
      JOIN colleges c ON t.college_id = c.id
      WHERE t.leader_id=$1
    `, [leaderId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
