/*
  # Ajout des catégories manquantes au dictionnaire

  1. Nouvelles catégories
    - Ajout de toutes les catégories manquantes avec leurs emojis
    - Remplacement des catégories existantes si nécessaire
    - Organisation cohérente des catégories

  2. Catégories ajoutées
    - Famille, Animaux – Insectes, Autre, Chiffres
    - Corps humain, Couleurs, Date / Heure, Éducation
    - Émotions, Environnement, Maison et Chambre
    - Nourriture et Boissons, Professions, Remerciements
    - Salutations, Santé, Sport, Transport, Vêtements
*/

-- Supprimer les anciennes catégories pour éviter les doublons
DELETE FROM dictionary_categories;

-- Ajouter toutes les nouvelles catégories
INSERT INTO dictionary_categories (name, emoji, color, description) VALUES
  ('Famille', '👪', '#e11d48', 'Membres de la famille et relations'),
  ('Animaux – Insectes', '🐾', '#10b981', 'Animaux et insectes'),
  ('Autre', '🌀', '#71717a', 'Mots divers et variés'),
  ('Chiffres', '🔢', '#84cc16', 'Nombres et chiffres'),
  ('Corps humain', '🧍', '#ef4444', 'Parties du corps humain'),
  ('Couleurs', '🎨', '#8b5cf6', 'Couleurs et nuances'),
  ('Date / Heure', '⏰', '#f59e0b', 'Temps, dates et heures'),
  ('Éducation', '📚', '#3b82f6', 'École et apprentissage'),
  ('Émotions', '😊', '#ec4899', 'Sentiments et émotions'),
  ('Environnement', '🌍', '#10b981', 'Nature et environnement'),
  ('Maison et Chambre', '🛏️', '#06b6d4', 'Maison et mobilier'),
  ('Nourriture et Boissons', '🍽️', '#10b981', 'Aliments et boissons'),
  ('Professions', '👷', '#f97316', 'Métiers et professions'),
  ('Remerciements', '🙏', '#8b5cf6', 'Expressions de gratitude'),
  ('Salutations', '👋', '#e11d48', 'Dire bonjour et se présenter'),
  ('Santé', '🏥', '#ef4444', 'Santé et médecine'),
  ('Sport', '⚽', '#10b981', 'Sports et activités physiques'),
  ('Transport', '🚗', '#f59e0b', 'Moyens de transport'),
  ('Vêtements', '👕', '#8b5cf6', 'Habits et accessoires');

-- Mettre à jour les mots existants avec les nouvelles catégories
DO $$
DECLARE
  famille_id uuid;
  salutations_id uuid;
  nourriture_id uuid;
  chiffres_id uuid;
  remerciements_id uuid;
BEGIN
  -- Récupérer les nouveaux IDs des catégories
  SELECT id INTO famille_id FROM dictionary_categories WHERE name = 'Famille';
  SELECT id INTO salutations_id FROM dictionary_categories WHERE name = 'Salutations';
  SELECT id INTO nourriture_id FROM dictionary_categories WHERE name = 'Nourriture et Boissons';
  SELECT id INTO chiffres_id FROM dictionary_categories WHERE name = 'Chiffres';
  SELECT id INTO remerciements_id FROM dictionary_categories WHERE name = 'Remerciements';

  -- Mettre à jour les mots existants pour qu'ils pointent vers les nouvelles catégories
  UPDATE dictionary_words SET category_id = famille_id WHERE darija IN ('Baba', 'Mama', 'Kho', 'Okhti', 'Walidin', 'Jedd', 'Jidda', '3amm', '3amma');
  UPDATE dictionary_words SET category_id = salutations_id WHERE darija IN ('Salam', 'Sbah lkhir', 'Msa lkhir', 'Lila sa3ida', 'Smiti...', 'Kifash dayr', 'Labas', 'Bslama');
  UPDATE dictionary_words SET category_id = nourriture_id WHERE darija IN ('Khobz', 'Ma', 'Atay', 'Laham', 'Khodar', 'Hlib', 'Sukar', 'Melh', 'Rouz', 'Hout');
  UPDATE dictionary_words SET category_id = chiffres_id WHERE darija IN ('Wahad', 'Jouj', 'Tlata', 'Arba', 'Khamsa', 'Stta', 'Sb3a', 'Tmnya', 'Ts3oud', '3ashra');
  UPDATE dictionary_words SET category_id = remerciements_id WHERE darija IN ('Shokran', 'La shokran 3la wajib');

  -- Supprimer les mots qui n'ont plus de catégorie valide
  DELETE FROM dictionary_words WHERE category_id NOT IN (SELECT id FROM dictionary_categories);
END $$;