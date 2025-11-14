import { pool } from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaSQL = fs.readFileSync(
  path.join(__dirname, "../models/tables.sql"),
  "utf8"
);

async function initDatabase() {
  try {
    console.log("🔄 Creating database tables...");
    
    // Split SQL by semicolons and execute each statement
    const statements = schemaSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      await pool.query(statement);
    }

    console.log("✅ Database tables created successfully!");
    
    // Create a default admin user
    const bcrypt = (await import("bcrypt")).default;
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    try {
      await pool.query(
        `INSERT INTO users (name, email, password, role, verified)
         VALUES ('Admin User', 'admin@sih.com', $1, 'ADMIN', true)
         ON CONFLICT (email) DO NOTHING`,
        [hashedPassword]
      );
      console.log("✅ Default admin user created!");
      console.log("   Email: admin@sih.com");
      console.log("   Password: admin123");
    } catch (err) {
      console.log("ℹ️  Admin user already exists or error:", err.message);
    }
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error initializing database:", err.message);
    console.error(err);
    process.exit(1);
  }
}

initDatabase();

