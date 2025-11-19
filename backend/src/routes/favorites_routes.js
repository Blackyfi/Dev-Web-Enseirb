import express from 'express';
import pool from '../database/db.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateFavoriteData } from '../utils/inputValidation.js';

const router = express.Router();

// GET /me/favorites - Get all favorites of a user
// Nota bene : Might need to cut it in multiple slices if too big and thus add a page number like github API in the returned data
router.get("/me/favorites", authMiddleware, async (req, res) => {
    try {
        console.log("GET /me/favorites - Get all favorites of a user");
        const userId = req.user.id;
        const query = 'SELECT id, film_id, type, created_at FROM seenflix.favorites WHERE user_id = ? ORDER BY created_at DESC'; // The movies should appear by descending order
        await pool.query(query, [userId], (err, results) => {
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

router.post("/me/favorites", authMiddleware, async (req, res) => {
    try {
        console.log("POST /me/favorites - Create a favorite for the user");
        // GET RELEVANT DATA FROM PAGE
        const userId = req.user.id;
        const { film_id, type, rating, comment } = req.body;
        // VALIDATION
        // Validate input data (required and optional fields)
        const validation = validateFavoriteData({ film_id, type, rating, comment });
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Invalid input data',
                details: validation.errors
            });
        }
        // CHECK DUPLICATE
        // Check if favorite already exists (no duplicate userId + film_id + type)
        const checkQuery = 'SELECT id FROM seenflix.favorites WHERE user_id = ? AND film_id = ? AND type = ?';
        pool.query(checkQuery, [userId, film_id, type.toLowerCase()], (checkErr, checkResults) => {
            if (checkErr) {
                console.error('Error while checking for duplicate favorite:', checkErr);
                return res.status(500).json({ error: 'Database error while checking for duplicates' });
            }
            if (checkResults && checkResults.length > 0) {
                return res.status(409).json({error: 'Favorite already exists'});
            }
            // MAKE AND FILL THE QUERY AND SEND IT
            const insertQuery = `
                INSERT INTO seenflix.favorites (user_id, film_id, type, rating, comment, created_at)
                VALUES (?, ?, ?, ?, ?, NOW())
            `;
            const insertParams = [
                userId,
                film_id,
                type.toLowerCase(),
                rating || null,
                comment || null
            ];
            pool.query(insertQuery, insertParams, (insertErr, insertResults) => {
                if (insertErr) {
                    console.error('Error while creating favorite:', insertErr);
                    return res.status(500).json({ error: 'Database error while creating favorite' });
                }
                const createdFavorite = {
                    id: insertResults.insertId,
                    user_id: userId,
                    film_id: film_id,
                    type: type.toLowerCase(),
                    rating: rating || null,
                    comment: comment || null,
                    created_at: new Date().toISOString()
                };
                return res.status(201).json(createdFavorite);
            });
        });
    } catch (error) {
        console.error('Error in POST /me/favorites:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;