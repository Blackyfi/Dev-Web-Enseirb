// Toutes les valeurs sont chargées depuis les variables d'environnement
// Dev : .env.local | Prod : .env (via Docker)
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
}

export default {
  /**
   * La clé secrète pour signer les JWT d'accès.
   */
  secret: process.env.JWT_SECRET,

  /**
   * La clé secrète pour signer les JWT de refresh.
   */
  refreshSecret: process.env.JWT_REFRESH_SECRET,

  /**
   * La durée de vie d'un token d'accès.
   * Exemples : "15m", "1h", "1d"
   */
  jwtExpiration: process.env.JWT_ACCESS_EXPIRATION,

  /**
   * La durée de vie d'un token de refresh.
   * Exemples : "7d", "30d"
   */
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION,

  /**
   * Le "coût" du hachage pour bcrypt.
   * Un nombre plus élevé est plus sécurisé mais plus lent. 10 est un bon compromis.
   */
  saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS)
};
