import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';

// Charger les variables d'environnement
// En dev : charge .env | En prod : Docker injecte directement les variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '../../.env.local' });
}

const app = express();
const BACKEND_PORT = process.env.BACKEND_PORT;

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.LOG_LEVEL));
  

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
