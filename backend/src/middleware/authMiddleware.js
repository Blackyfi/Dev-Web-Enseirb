// Middleware to verify JWT tokens and protect routes
import { verifyToken } from "../utils/jwt";

// Middleware d'authentification
export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Token invalide' });
    }

    req.user = decoded;
    next();
};
