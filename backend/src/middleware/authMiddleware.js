// Middleware to verify JWT tokens and protect routes
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { verifyToken } = require('../utils/jwt');

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
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
