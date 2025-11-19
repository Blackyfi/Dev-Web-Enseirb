import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import { errorHandler } from './middleware/errorHandlingExpress.js';
// AJOUTER ICI LES AUTRES IMPORTS DE ROUTES

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan('common'));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Error handling middleware - DOIT ÊTRE APRÈS TOUTES LES ROUTES
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});