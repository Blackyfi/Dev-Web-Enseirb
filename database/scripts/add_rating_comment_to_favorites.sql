-- Migration: Ajout des colonnes rating et comment à la table favorites
-- Date: 2025-12-03

USE seenflix;

-- Ajouter les colonnes rating et comment à la table favorites
ALTER TABLE favorites
ADD COLUMN rating INT DEFAULT NULL CHECK (rating >= 1 AND rating <= 5),
ADD COLUMN comment TEXT DEFAULT NULL;
