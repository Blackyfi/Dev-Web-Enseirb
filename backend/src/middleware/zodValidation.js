// Middleware de validation Zod
import { ZodError } from 'zod';
import { BadRequestError } from './errorHandlingExpress.js';

/**
 * Middleware de validation Zod
 * @param {ZodSchema} schema - Schéma Zod à valider
 * @returns {Function} Middleware Express
 */
export function validateRequest(schema) {
  return async (req, res, next) => {
    try {
      // Valider la requête avec le schéma Zod
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Remplacer les valeurs validées dans la requête
      // Utiliser Object.assign pour éviter l'erreur de réassignation
      if (validated.body) {
        Object.assign(req.body, validated.body);
      }
      if (validated.query) {
        Object.keys(validated.query).forEach(key => {
          req.query[key] = validated.query[key];
        });
      }
      if (validated.params) {
        Object.keys(validated.params).forEach(key => {
          req.params[key] = validated.params[key];
        });
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formater les erreurs Zod pour une réponse claire
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        next(new BadRequestError('Validation failed', formattedErrors));
      } else {
        next(error);
      }
    }
  };
}

export default validateRequest;
