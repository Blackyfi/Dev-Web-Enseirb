import express from 'express';

const LOG_LEVEL = process.env.LOG_LEVEL || 'dev';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import moviesRoutes from './routes/movies.js';
import favoritesRoutes from './routes/favorites_routes.js';

const app = express();
const BACKEND_PORT = process.env.BACKEND_PORT;

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(LOG_LEVEL));
  

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur SeenFlix API',
    version: '1.0.0',
    status: 'running'
  });
});

// Route de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/auth', authRoutes);
app.use('/movies', moviesRoutes); 
app.use('/me', favoritesRoutes); 

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: { 
      message: 'Une erreur est survenue',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    } 
  });
});

// Démarrage du serveur
app.listen(BACKEND_PORT, () => {
  console.log(`Serveur SeenFlix démarré sur http://localhost:${BACKEND_PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV}`);
});

export default app;
