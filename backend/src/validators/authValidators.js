// Schémas de validation Zod pour l'authentification
import { z } from 'zod';

// Schéma pour l'inscription
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
});

// Schéma pour la connexion
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Le mot de passe est requis'),
  }),
});

// Schéma pour le refresh token
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Le refresh token est requis'),
  }),
});
