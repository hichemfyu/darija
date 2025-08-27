/*
  # Ajout des nouvelles catégories d'exercices

  1. Nouvelles catégories
    - Météo (🌤️)
    - Vêtements (👕)
    - Corps (👤)
    - Animaux (🐾)
    - École (🎓)
    - Maison (🏠)
    - Ville (🏙️)
    - Verbes (⚡)
    - Émotions (😊)
    - Objets (📦)

  2. Couleurs variées pour chaque catégorie
*/

-- Ajout des nouvelles catégories d'exercices
INSERT INTO exercise_categories (name, emoji, color) VALUES
  ('Météo', '🌤️', '#f59e0b'),
  ('Vêtements', '👕', '#8b5cf6'),
  ('Corps', '👤', '#ef4444'),
  ('Animaux', '🐾', '#10b981'),
  ('École', '🎓', '#3b82f6'),
  ('Maison', '🏠', '#06b6d4'),
  ('Ville', '🏙️', '#71717a'),
  ('Verbes', '⚡', '#f97316'),
  ('Émotions', '😊', '#ec4899'),
  ('Objets', '📦', '#84cc16');