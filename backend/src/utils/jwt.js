// jwt creation and verification utilities (jsonwebtoken)
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Create a JWT token
export function createToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify a JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
}
