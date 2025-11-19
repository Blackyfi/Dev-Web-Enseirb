import * as jwtutil from '../utils/jwt.js';
import * as userService from '../services/userService.js';

// User login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticateUser(email, password);
    if (user) {
      const token = jwtutil.createToken({ id: user.id, email: user.email });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// User registration
export async function register(req, res) {
  const { email, password } = req.body;
  const user = await userService.createUser(email, password);
  if (user) {
    res.status(201).json({ message: 'User created successfully' });
  } else {
    res.status(400).json({ message: 'User creation failed' });
  }
}

// User logout
export async function logout(req, res) {
  // TODO: Implement token blacklist or revocation
  res.json({ message: 'Logged out successfully' });
}

// Token refresh
export async function refreshToken(req, res) {
  const { token } = req.body;
  const decoded = jwtutil.verifyToken(token);
  if (decoded) {
    const newToken = jwtutil.createToken({ id: decoded.id, email: decoded.email });
    res.json({ token: newToken });
  } else {
    res.status(401).json({ message: 'Invalid token' });
  }
}
