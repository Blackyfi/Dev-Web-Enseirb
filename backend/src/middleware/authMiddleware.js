// Middleware to verify JWT tokens and protect routes
import { verifyToken } from '../utils/jwt.js';

// Middleware d'authentification
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Non authentifié' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Token invalide' });
    }

    req.user = decoded;
    next();
};
