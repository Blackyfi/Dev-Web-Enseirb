// User service handling user data and operations

import * as db from '../database/db.js';
import * as passwordHash from '../utils/passwordHash.js';

// Authenticate user with username and password
export async function authenticateUser(username, password) {
  const user = await db.getUserByUsername(username);
  if (user && await passwordHash.verifyPassword(password, user.password)) {
    return user;
  }
  return null;
}

// Create a new user
export async function createUser(username, password) {
  const hashedPassword = await passwordHash.hashPassword(password);
  const newUser = await db.insertUser({ username, password: hashedPassword });
  return newUser;
}
