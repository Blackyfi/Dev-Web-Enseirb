// Schémas de validation Zod pour la recherche de films
import { z } from 'zod';

// Schéma pour la recherche de films
export const searchMoviesSchema = z.object({
  query: z.object({
    name: z.string().min(1, 'Le nom de recherche est requis').optional(),
    q: z.string().min(1, 'Le terme de recherche est requis').optional(),
  }).refine(data => data.name || data.q, {
    message: 'Un terme de recherche est requis (name ou q)',
  }),
});

// Schéma pour obtenir les détails d'un film
export const getMovieDetailsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'L\'ID doit être un nombre').transform(Number),
  }),
});
