import bcrypt from 'bcrypt';
import config from '../config/config.js';

export async function hashPassword(plainPassword) {
  const hash = await bcrypt.hash(plainPassword, config.saltRounds);
  return hash;
}

export async function comparePassword(plainPassword, hash) {
  const match = await bcrypt.compare(plainPassword, hash);
  return match;
}

// Also export verifyPassword as an alias for comparePassword
export const verifyPassword = comparePassword;
