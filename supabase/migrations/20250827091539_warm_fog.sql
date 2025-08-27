/*
  # Nettoyage des données d'exercices

  1. Suppression
    - Supprime tous les exercices existants
    - Supprime toutes les catégories d'exercices existantes
    - Repart avec une base propre

  2. Recréation des catégories
    - Recrée uniquement les catégories demandées
    - Pas de données d'exemple
    - Prêt pour vos propres QCM
*/

-- Supprimer tous les exercices existants
DELETE FROM public.exercises;

-- Supprimer toutes les catégories d'exercices existantes
DELETE FROM public.exercise_categories;

-- Recréer les catégories proprement (sans doublons)
INSERT INTO public.exercise_categories (name, emoji, color) VALUES
  ('Salutations', '👋', '#e11d48'),
  ('Politesse', '🎗️', '#3b82f6'),
  ('Nourriture', '🍽️', '#10b981'),
  ('Famille', '🏠', '#06b6d4'),
  ('Météo', '🌤️', '#f59e0b'),
  ('Expressions', '👥', '#8b5cf6'),
  ('Questions', '❓', '#ef4444'),
  ('Nombres', '🔢', '#84cc16'),
  ('Vêtements', '👕', '#8b5cf6'),
  ('Corps', '👤', '#ef4444'),
  ('Animaux', '🐾', '#10b981'),
  ('École', '🎓', '#3b82f6'),
  ('Maison', '🏠', '#06b6d4'),
  ('Ville', '🏙️', '#6b7280'),
  ('Verbes', '⚡', '#f97316'),
  ('Émotions', '😊', '#ec4899'),
  ('Objets', '📦', '#84cc16');