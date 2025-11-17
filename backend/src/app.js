import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
// AJOUTER ICI LES AUTRES IMPORTS DE ROUTES

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(morgan('common'));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});