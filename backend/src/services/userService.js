// User service handling user data and operations

import * as userDb from '../database/user.js';
import * as passwordHash from '../utils/passwordHash.js';

// Authenticate user with email and password
export async function authenticateUser(email, password) {
  const user = await userDb.getUserByEmail(email);
  if (user && await passwordHash.verifyPassword(password, user.password_hash)) {
    return user;
  }
  return null;
}

// Create a new user
export async function createUser(email, password) {
  const hashedPassword = await passwordHash.hashPassword(password);
  const newUser = await userDb.insertUser({ email, password_hash: hashedPassword });
  return newUser;
}
