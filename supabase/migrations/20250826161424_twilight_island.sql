/*
  # Création des tables pour les exercices

  1. Nouvelles Tables
    - `exercise_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `emoji` (text)
      - `color` (text)
      - `created_at` (timestamp)
    - `exercises`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key)
      - `level` (text)
      - `question` (text)
      - `options` (jsonb array)
      - `correct_answer` (integer)
      - `explanation` (text)
      - `xp_reward` (integer)
      - `created_at` (timestamp)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Policies pour lecture publique et écriture authentifiée
*/

-- Créer la table des catégories d'exercices
CREATE TABLE IF NOT EXISTS exercise_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text NOT NULL,
  color text NOT NULL DEFAULT '#e11d48',
  created_at timestamptz DEFAULT now()
);

-- Créer la table des exercices
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES exercise_categories(id) ON DELETE CASCADE,
  level text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  explanation text NOT NULL,
  xp_reward integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE exercise_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Policies pour lecture publique
CREATE POLICY "Anyone can read exercise categories"
  ON exercise_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read exercises"
  ON exercises
  FOR SELECT
  TO public
  USING (true);

-- Policies pour écriture authentifiée (pour les admins)
CREATE POLICY "Authenticated users can insert exercise categories"
  ON exercise_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update exercise categories"
  ON exercise_categories
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete exercise categories"
  ON exercise_categories
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert exercises"
  ON exercises
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update exercises"
  ON exercises
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete exercises"
  ON exercises
  FOR DELETE
  TO authenticated
  USING (true);

-- Insérer les catégories par défaut
INSERT INTO exercise_categories (name, emoji, color) VALUES
  ('Salutations', '👋', '#e11d48'),
  ('Politesse', '🎗️', '#3b82f6'),
  ('Nourriture', '🍽️', '#10b981'),
  ('Famille', '🏠', '#06b6d4'),
  ('Transport', '🚗', '#f59e0b'),
  ('Nombres', '🔢', '#8b5cf6'),
  ('Temps', '⏰', '#ef4444'),
  ('Couleurs', '🎨', '#84cc16')
ON CONFLICT DO NOTHING;

-- Insérer quelques exercices d'exemple
DO $$
DECLARE
  salutations_id uuid;
  famille_id uuid;
  nourriture_id uuid;
BEGIN
  -- Récupérer les IDs des catégories
  SELECT id INTO salutations_id FROM exercise_categories WHERE name = 'Salutations';
  SELECT id INTO famille_id FROM exercise_categories WHERE name = 'Famille';
  SELECT id INTO nourriture_id FROM exercise_categories WHERE name = 'Nourriture';

  -- Exercices Salutations
  INSERT INTO exercises (category_id, level, question, options, correct_answer, explanation, xp_reward) VALUES
    (salutations_id, 'beginner', 'Comment dit-on "Bonjour (matin)" en darija ?', '["Salam", "Sbah lkhir", "Msa lkhir", "Lila sa3ida"]', 1, '« Sbah lkhir » signifie bonjour le matin.', 10),
    (salutations_id, 'beginner', 'Que signifie "Salam" ?', '["Bonsoir", "Salut / Bonjour", "Bonne nuit", "Au revoir"]', 1, '« Salam » est une salutation générale qui signifie Salut ou Bonjour.', 10),
    (salutations_id, 'beginner', 'Comment se présenter en darija ?', '["Smiti...", "Baba", "Kho", "Ma"]', 0, '« Smiti » signifie "Je m''appelle" pour se présenter.', 10);

  -- Exercices Famille
  INSERT INTO exercises (category_id, level, question, options, correct_answer, explanation, xp_reward) VALUES
    (famille_id, 'beginner', 'Comment dit-on "Papa" en darija ?', '["Mama", "Baba", "Kho", "Okhti"]', 1, '« Baba » signifie Papa en darija.', 10),
    (famille_id, 'beginner', 'Que signifie "Okhti" ?', '["Mon frère", "Ma sœur", "Mes parents", "Mon père"]', 1, '« Okhti » signifie "Ma sœur".', 10),
    (famille_id, 'beginner', 'Comment dit-on "Parents" en darija ?', '["Walidin", "Baba", "Mama", "Kho"]', 0, '« Walidin » signifie Parents.', 10);

  -- Exercices Nourriture
  INSERT INTO exercises (category_id, level, question, options, correct_answer, explanation, xp_reward) VALUES
    (nourriture_id, 'beginner', 'Comment dit-on "Pain" en darija ?', '["Ma", "Atay", "Khobz", "Laham"]', 2, '« Khobz » signifie Pain.', 10),
    (nourriture_id, 'beginner', 'Que signifie "Atay" ?', '["Eau", "Thé", "Pain", "Viande"]', 1, '« Atay » signifie Thé, très populaire au Maroc.', 10),
    (nourriture_id, 'beginner', 'Que signifie "Laham" ?', '["Pain", "Eau", "Viande", "Légumes"]', 2, '« Laham » signifie Viande.', 10);
END $$;