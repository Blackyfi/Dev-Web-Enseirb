import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

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

// Middleware de gestion d'erreurs (à développer plus tard)
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
app.listen(PORT, () => {
  console.log(`Serveur SeenFlix démarré sur http://localhost:${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
