import db from './db.js';

// Get user by email
export async function getUserByEmail(email) {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

// Insert new user
export async function insertUser(userData) {
  const { email, password_hash } = userData;
  try {
    const [result] = await db.execute(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, password_hash]
    );
    return { id: result.insertId, email };
  } catch (error) {
    // Erreur de doublon MySQL (code 1062 ou ER_DUP_ENTRY)
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      const duplicateError = new Error('Cet email est déjà utilisé');
      duplicateError.code = 'DUPLICATE_ENTRY';
      throw duplicateError;
    }
    throw error;
  }
}