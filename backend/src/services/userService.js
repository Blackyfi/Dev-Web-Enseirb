// User service handling user data and operations

const db = require('../database/db');
const passwordHash = require('../utils/passwordHash');

// Authenticate user with username and password
async function authenticateUser(username, password) {
  const user = await db.getUserByUsername(username);
  if (user && passwordHash.verifyPassword(password, user.password)) {
    return user;
  }
  return null;
}

// Create a new user
async function createUser(username, password) {
  const hashedPassword = await passwordHash.hashPassword(password);
  const newUser = await db.insertUser({ username, password: hashedPassword });
  return newUser;
}

module.exports = {
  authenticateUser,
  createUser,
};