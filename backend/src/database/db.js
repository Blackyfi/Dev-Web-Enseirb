// database connection setup using mysql
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "seenflix",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log("Database connected!");
    connection.release();
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });

// Helper functions
export async function getUserByUsername(username) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}

export async function insertUser(userData) {
  const { username, password } = userData;
  const [result] = await pool.execute(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password]
  );
  return { id: result.insertId, username };
}

export default pool;
