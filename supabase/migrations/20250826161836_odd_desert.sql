/*
  # Création de la base de données complète pour l'app Darija

  1. Nouvelles Tables
    - `dictionary_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `emoji` (text)
      - `color` (text)
      - `description` (text)
      - `created_at` (timestamp)
    - `dictionary_words`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key)
      - `word` (text)
      - `darija` (text)
      - `french` (text)
      - `phonetic` (text)
      - `audio_url` (text, optional)
      - `created_at` (timestamp)
    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `word_id` (uuid, foreign key)
      - `created_at` (timestamp)
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `exercise_id` (uuid, foreign key)
      - `completed` (boolean)
      - `correct` (boolean)
      - `completed_at` (timestamp)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Policies pour lecture publique et gestion utilisateur
*/

-- Créer la table des catégories du dictionnaire
CREATE TABLE IF NOT EXISTS dictionary_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text NOT NULL,
  color text NOT NULL DEFAULT '#e11d48',
  description text,
  created_at timestamptz DEFAULT now()
);

-- Créer la table des mots du dictionnaire
CREATE TABLE IF NOT EXISTS dictionary_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES dictionary_categories(id) ON DELETE CASCADE,
  word text NOT NULL,
  darija text NOT NULL,
  french text NOT NULL,
  phonetic text NOT NULL,
  audio_url text,
  created_at timestamptz DEFAULT now()
);

-- Créer la table des favoris utilisateur
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id uuid REFERENCES dictionary_words(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, word_id)
);

-- Créer la table de progression utilisateur
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  correct boolean DEFAULT false,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, exercise_id)
);

-- Enable RLS sur toutes les tables
ALTER TABLE dictionary_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dictionary_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies pour les catégories du dictionnaire (lecture publique)
CREATE POLICY "Anyone can read dictionary categories"
  ON dictionary_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage dictionary categories"
  ON dictionary_categories
  FOR ALL
  TO authenticated
  USING (true);

-- Policies pour les mots du dictionnaire (lecture publique)
CREATE POLICY "Anyone can read dictionary words"
  ON dictionary_words
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage dictionary words"
  ON dictionary_words
  FOR ALL
  TO authenticated
  USING (true);

-- Policies pour les favoris (utilisateur propriétaire uniquement)
CREATE POLICY "Users can read their own favorites"
  ON user_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
  ON user_favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies pour la progression (utilisateur propriétaire uniquement)
CREATE POLICY "Users can read their own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Insérer les catégories du dictionnaire
INSERT INTO dictionary_categories (name, emoji, color, description) VALUES
  ('Salutations', '👋', '#e11d48', 'Dire bonjour et se présenter'),
  ('Politesse', '🎗️', '#3b82f6', 'Formules de politesse'),
  ('Nourriture', '🍽️', '#10b981', 'Aliments et boissons'),
  ('Famille', '🏠', '#06b6d4', 'Membres de la famille'),
  ('Météo', '🌤️', '#f59e0b', 'Temps et climat'),
  ('Expressions', '👥', '#8b5cf6', 'Expressions courantes'),
  ('Questions', '❓', '#ef4444', 'Mots interrogatifs'),
  ('Nombres', '🔢', '#84cc16', 'Chiffres et nombres')
ON CONFLICT DO NOTHING;

-- Insérer les mots du dictionnaire
DO $$
DECLARE
  salutations_id uuid;
  politesse_id uuid;
  famille_id uuid;
  nourriture_id uuid;
  meteo_id uuid;
  expressions_id uuid;
  questions_id uuid;
  nombres_id uuid;
BEGIN
  -- Récupérer les IDs des catégories
  SELECT id INTO salutations_id FROM dictionary_categories WHERE name = 'Salutations';
  SELECT id INTO politesse_id FROM dictionary_categories WHERE name = 'Politesse';
  SELECT id INTO famille_id FROM dictionary_categories WHERE name = 'Famille';
  SELECT id INTO nourriture_id FROM dictionary_categories WHERE name = 'Nourriture';
  SELECT id INTO meteo_id FROM dictionary_categories WHERE name = 'Météo';
  SELECT id INTO expressions_id FROM dictionary_categories WHERE name = 'Expressions';
  SELECT id INTO questions_id FROM dictionary_categories WHERE name = 'Questions';
  SELECT id INTO nombres_id FROM dictionary_categories WHERE name = 'Nombres';

  -- Mots Salutations
  INSERT INTO dictionary_words (category_id, word, darija, french, phonetic, audio_url) VALUES
    (salutations_id, 'Salam', 'Salam', 'Salut / Bonjour', 'sa-lam', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
    (salutations_id, 'Sbah lkhir', 'Sbah lkhir', 'Bonjour (matin)', 'sbah l-khir', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'),
    (salutations_id, 'Msa lkhir', 'Msa lkhir', 'Bonsoir', 'msa l-khir', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'),
    (salutations_id, 'Lila sa3ida', 'Lila sa3ida', 'Bonne nuit', 'li-la sa-3i-da', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'),
    (salutations_id, 'Smiti...', 'Smiti...', 'Je m''appelle...', 'smi-ti', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3');

  -- Mots Politesse
  INSERT INTO dictionary_words (category_id, word, darija, french, phonetic, audio_url) VALUES
    (politesse_id, 'Shokran', 'Shokran', 'Merci', 'shok-ran', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3'),
    (politesse_id, 'Afak', 'Afak', 'S''il te plaît', 'a-fak', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3');

  -- Mots Famille
  INSERT INTO dictionary_words (category_id, word, darija, french, phonetic, audio_url) VALUES
    (famille_id, 'Baba', 'Baba', 'Papa', 'ba-ba', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'),
    (famille_id, 'Mama', 'Mama', 'Maman', 'ma-ma', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'),
    (famille_id, 'Kho', 'Kho', 'Frère', 'kho', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3'),
    (famille_id, 'Okhti', 'Okhti', 'Ma sœur', 'okh-ti', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3'),
    (famille_id, 'Walidin', 'Walidin', 'Parents', 'wa-li-din', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3');

  -- Mots Nourriture
  INSERT INTO dictionary_words (category_id, word, darija, french, phonetic, audio_url) VALUES
    (nourriture_id, 'Khobz', 'Khobz', 'Pain', 'khobz', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3'),
    (nourriture_id, 'Ma', 'Ma', 'Eau', 'ma', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3'),
    (nourriture_id, 'Atay', 'Atay', 'Thé', 'a-tay', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3'),
    (nourriture_id, 'Laham', 'Laham', 'Viande', 'la-ham', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3'),
    (nourriture_id, 'Khodar', 'Khodar', 'Légumes', 'kho-dar', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3');

  -- Mots Météo
  INSERT INTO dictionary_words (category_id, word, darija, french, phonetic, audio_url) VALUES
    (meteo_id, 'Shta', 'Shta', 'Pluie', 'sh-ta', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3'),
    (meteo_id, 'Shems', 'Shems', 'Soleil', 'shems', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3');

  -- Mots Expressions
  INSERT INTO dictionary_words (category_id, word, darija, french, phonetic, audio_url) VALUES
    (expressions_id, 'Baraka', 'Baraka', 'Assez / Stop', 'ba-ra-ka', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-22.mp3'),
    (expressions_id, 'Bghit', 'Bghit', 'Je veux', 'bghit', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-23.mp3');

  -- Mots Questions
  INSERT INTO dictionary_words (category_id, word, darija, french, phonetic, audio_url) VALUES
    (questions_id, 'Fin', 'Fin', 'Où', 'fin', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-24.mp3');

  -- Mots Nombres
  INSERT INTO dictionary_words (category_id, word, darija, french, phonetic, audio_url) VALUES
    (nombres_id, 'Wahad', 'Wahad', 'Un', 'wa-had', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'),
    (nombres_id, 'Jouj', 'Jouj', 'Deux', 'jouj', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'),
    (nombres_id, 'Tlata', 'Tlata', 'Trois', 'tla-ta', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-25.mp3'),
    (nombres_id, 'Arba', 'Arba', 'Quatre', 'ar-ba', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-26.mp3'),
    (nombres_id, 'Khamsa', 'Khamsa', 'Cinq', 'kham-sa', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-27.mp3');
END $$;