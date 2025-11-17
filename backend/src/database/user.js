const db = require('./db');

// Get user by username
async function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]);
    });
  });
}








module.exports = {
  getUserByUsername,
};