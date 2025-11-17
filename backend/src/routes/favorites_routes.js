const express = require('express');
const router = express.Router();
const db = require('../database/db');
import {authMiddleware} from "../middleware/authMiddleware"

// GET /me/favorites - Gets all favorites of a user
// Nota bene : Might need to cut it in multiple slices if too big and thus add a page number like github API in the returned data
router.get("/me/favorites", authMiddleware, async (req, res) => {
    try {
        console.log("GET /me/favorites - récupérer tous les favoris d'un user");
        const userId = req.user.id;
        const query = 'SELECT id, film_id, type, created_at FROM seenflix.favorites WHERE user_id = ? ORDER BY created_at DESC'; // The movies should appear by descending order
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Erreur lors de la récupération des favoris:', err);
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            return res.status(200).json(results);
        });
    } catch (error) {
        console.error('Erreur dans GET /me/favorites:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;