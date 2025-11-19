import pool from './db.js';

// Get user by email
export async function getUserByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

// Insert new user
export async function insertUser(userData) {
  const { email, password_hash } = userData;
  const [result] = await pool.execute(
    'INSERT INTO users (email, password_hash) VALUES (?, ?)',
    [email, password_hash]
  );
  return { id: result.insertId, email };
}