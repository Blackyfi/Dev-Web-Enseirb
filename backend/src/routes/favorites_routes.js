const express = require('express');
const router = express.Router();
const db = require('../database/db');
import {authMiddleware} from "../middleware/authMiddleware.js"

// GET /me/favorites - Get all favorites of a user
// Nota bene : Might need to cut it in multiple slices if too big and thus add a page number like github API in the returned data
router.get("/me/favorites", authMiddleware, async (req, res) => {
    try {
        console.log("GET /me/favorites - Get all favorites of a user");
        const userId = req.user.id;
        const query = 'SELECT id, film_id, type, created_at FROM seenflix.favorites WHERE user_id = ? ORDER BY created_at DESC'; // The movies should appear by descending order
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error while getting current user favorites:', err);
                return res.status(500).json({ error: 'Error after query serveur /me/favorites' });
            }
            return res.status(200).json(results);
        });
    } catch (error) {
        console.error('Erreur dans GET /me/favorites:', error);
        return res.status(500).json({ error: 'Error before query serveur /me/favorites' });
    }
});

module.exports = router;