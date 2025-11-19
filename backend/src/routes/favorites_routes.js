import express from 'express';
const router = express.Router();
import db from "../database/db.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {BadRequestError,UnauthorizedError,InternalServerError,NotFoundError} from '../middleware/errorHandlingExpress.js';
import {validateFavoriteData} from '../middleware/validateRequest.js';

// GET /favorites - Get all favorites of a user
// Nota bene : Might need to cut it in multiple slices if too big and thus add a page number like github API in the returned data
router.get("/favorites", authMiddleware, async (req, res, next) => {
    try {
        console.log("GET /favorites - Get all favorites of a user");
        const userId = req.user.id;
        console.log("User ID from token:", userId);
        if (!userId) throw new UnauthorizedError("Need to be logged in");
        const query = 'SELECT id, movie_id, type, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC';
        const [results] = await db.execute(query, [userId]);
        return res.status(200).json(results);
    } catch (error) {
        console.error('Error while getting current user favorites:', error);
        next(error);
    }
});

router.post("/favorites", authMiddleware, async (req, res, next) => {
    try {
        console.log("POST /favorites - Create a favorite for the user");
        // GET RELEVANT DATA FROM PAGE
        const userId = req.user.id;
        if (!userId) throw new UnauthorizedError("Need to be logged in");
        const { movie_id, type } = req.body;
        // VALIDATION
        // Validate input data
        const validation = validateFavoriteData({ movie_id, type });
        if (!validation.isValid) {
            throw new BadRequestError('Données d\'entrée invalides: ' + validation.errors.join(', '));
        }
        // CHECK DUPLICATE
        // Check if favorite already exists (unique constraint on user_id + movie_id)
        const checkQuery = 'SELECT id FROM favorites WHERE user_id = ? AND movie_id = ?';
        const [checkResults] = await db.execute(checkQuery, [userId, movie_id]);

        if (checkResults && checkResults.length > 0) {
            const error = new Error('Le favori existe déjà');
            error.status = 409;
            return next(error);
        }
        // MAKE AND FILL THE QUERY AND SEND IT
        const insertQuery = 'INSERT INTO favorites (user_id, movie_id, type) VALUES (?, ?, ?)';
        const insertParams = [userId, movie_id, type.toLowerCase()];
        const [insertResults] = await db.execute(insertQuery, insertParams);

        const createdFavorite = {
            id: insertResults.insertId,
            user_id: userId,
            movie_id: movie_id,
            type: type.toLowerCase(),
            created_at: new Date().toISOString()
        };
        return res.status(201).json(createdFavorite);
    } catch (error) {
        console.error('Error while creating favorite:', error);
        next(error);
    }
});

router.delete("/favorites/:id", authMiddleware, async (req, res, next) => {
    try {
        console.log("DELETE /favorites/:id - Delete a favorite");
        const userId = req.user.id;
        if (!userId) throw new UnauthorizedError("Need to be logged in");
        const favoriteId = req.params.id;
        if (!favoriteId || isNaN(parseInt(favoriteId))) {
            throw new BadRequestError("ID de favori invalide");
        }
        const selectQuery = 'SELECT id, user_id FROM favorites WHERE id = ?';
        const [selectResults] = await db.execute(selectQuery, [favoriteId]);

        if (!selectResults || selectResults.length === 0) {
            return next(new NotFoundError("Favori non trouvé"));
        }
        const favorite = selectResults[0];
        if (favorite.user_id !== userId) {
            return next(new UnauthorizedError("Vous n'avez pas accès à ce favori"));
        }
        const deleteQuery = 'DELETE FROM favorites WHERE id = ?';
        await db.execute(deleteQuery, [favoriteId]);

        return res.status(204).send();
    } catch (error) {
        console.error('Error while deleting favorite:', error);
        next(error);
    }
});

export default router;
