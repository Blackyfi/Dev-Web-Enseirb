// Schémas de validation Zod pour les favoris
import { z } from 'zod';

// Schéma pour créer un favori
export const createFavoriteSchema = z.object({
  body: z.object({
    tmdbId: z.number().int().positive('L\'ID TMDB doit être un nombre positif').or(
      z.string().regex(/^\d+$/, 'L\'ID TMDB doit être un nombre').transform(Number)
    ),
    type: z.enum(['movie', 'tv'], {
      errorMap: () => ({ message: 'Le type doit être "movie" ou "tv"' })
    }),
    rating: z.number().min(0).max(5).optional(),
    comment: z.string().max(500, 'Le commentaire ne peut pas dépasser 500 caractères').optional(),
  }),
});

// Schéma pour supprimer un favori
export const deleteFavoriteSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'L\'ID doit être un nombre').transform(Number),
  }),
});
