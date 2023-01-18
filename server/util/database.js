import dotenv from "dotenv";
import mariadb from "mariadb";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const pool = mariadb.createPool({
  hostname: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

try {
  const conn = await pool.getConnection();
  console.log("Connected to database.");
  conn.release();
} catch (err) {
  console.error("Error connecting to database:", err.message);
  await pool.end();
  process.exit(1);
}

export default pool;
