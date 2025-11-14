import { pool } from "../config/db.js";

async function addPhoneColumn() {
  try {
    console.log("🔄 Adding phone column to users table...");
    
    // Check if column already exists
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='phone'
    `);
    
    if (checkColumn.rows.length === 0) {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN phone VARCHAR(20)
      `);
      console.log("✅ Phone column added successfully!");
    } else {
      console.log("ℹ️  Phone column already exists");
    }
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error adding phone column:", err.message);
    console.error(err);
    process.exit(1);
  }
}

addPhoneColumn();

