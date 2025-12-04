import express from 'express';

const LOG_LEVEL = process.env.LOG_LEVEL || 'dev';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import moviesRoutes from './routes/movies.js';
import favoritesRoutes from './routes/favorites.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerDocument = YAML.load(join(__dirname, process.env.NODE_ENV === 'production' ? '../openapi.yaml' : '../../openapi.yaml'));

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

// Documentation Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/auth', authRoutes);
app.use('/movies', moviesRoutes);
app.use('/me', favoritesRoutes); 

// Import du middleware de gestion d'erreurs personnalisé
import { errorHandler } from './middleware/errorHandlingExpress.js';

// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorHandler);

// Démarrage du serveur
app.listen(BACKEND_PORT, () => {
  console.log(`Serveur SeenFlix démarré sur http://localhost:${BACKEND_PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV}`);
});

export default app;
