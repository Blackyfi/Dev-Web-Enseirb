// jwt creation and verification utilities (jsonwebtoken)
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// Create an access token (courte durée)
export function createAccessToken(payload) {
  return jwt.sign(payload, config.secret, {
    expiresIn: config.jwtExpiration || '15m'
  });
}

// Create a refresh token (longue durée)
export function createRefreshToken(payload) {
  return jwt.sign(payload, config.refreshSecret || config.secret, {
    expiresIn: config.jwtRefreshExpiration || '7d'
  });
}

// Verify an access token
export function verifyToken(token) {
  try {
    return jwt.verify(token, config.secret);
  } catch (err) {
    return null;
  }
}

// Verify a refresh token
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, config.refreshSecret || config.secret);
  } catch (err) {
    return null;
  }
}

// Legacy: Keep for backward compatibility
export function createToken(payload) {
  return createAccessToken(payload);
}
