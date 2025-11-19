// jwt creation and verification utilities (jsonwebtoken)
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// Create a JWT token
export function createToken(payload) {
  return jwt.sign(payload, config.secret, { expiresIn: config.jwtExpiration });
}

// Verify a JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, config.secret);
  } catch (err) {
    return null;
  }
}
