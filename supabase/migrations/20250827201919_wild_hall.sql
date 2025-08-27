/*
  # Système utilisateur complet pour l'app Darija

  1. Nouvelles Tables
    - `user_stats` - Statistiques utilisateur (XP, niveau)
    - `user_settings` - Préférences utilisateur (thème, notifications)
    - `user_lesson_progress` - Progression dans les leçons
    - `user_exercise_attempts` - Tentatives d'exercices

  2. Fonctions
    - `calc_level` - Calcul du niveau basé sur l'XP
    - `award_xp` - Attribution d'XP
    - `award_xp_for_exercise` - Attribution d'XP pour un exercice
    - `get_random_quiz` - Récupération d'un quiz aléatoire

  3. Sécurité
    - RLS activé sur toutes les tables
    - Policies pour les utilisateurs authentifiés
*/

-- Table des statistiques utilisateur
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  xp_total integer DEFAULT 0,
  level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des paramètres utilisateur
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme_preference text DEFAULT 'dark' CHECK (theme_preference IN ('dark', 'light', 'system')),
  notifications_enabled boolean DEFAULT false,
  push_token text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table de progression des leçons
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL,
  status text DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, lesson_id)
);

-- Table des tentatives d'exercices
CREATE TABLE IF NOT EXISTS user_exercise_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE,
  is_correct boolean NOT NULL,
  attempted_at timestamptz DEFAULT now(),
  xp_awarded integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_attempts ENABLE ROW LEVEL SECURITY;

-- Policies pour user_stats
CREATE POLICY "Users can read their own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON user_stats FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies pour user_settings
CREATE POLICY "Users can read their own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON user_settings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies pour user_lesson_progress
CREATE POLICY "Users can read their own lesson progress"
  ON user_lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress"
  ON user_lesson_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies pour user_exercise_attempts
CREATE POLICY "Users can read their own exercise attempts"
  ON user_exercise_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise attempts"
  ON user_exercise_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fonction pour calculer le niveau basé sur l'XP
CREATE OR REPLACE FUNCTION calc_level(xp_total integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  -- Formule : niveau = floor(sqrt(xp_total / 100)) + 1
  -- Niveau 1: 0-99 XP, Niveau 2: 100-399 XP, Niveau 3: 400-899 XP, etc.
  RETURN GREATEST(1, FLOOR(SQRT(xp_total::float / 100)) + 1);
END;
$$;

-- Fonction pour attribuer de l'XP
CREATE OR REPLACE FUNCTION award_xp(p_user_id uuid, p_xp_amount integer)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_xp integer;
  v_new_level integer;
BEGIN
  -- Insérer ou mettre à jour les stats utilisateur
  INSERT INTO user_stats (user_id, xp_total, level)
  VALUES (p_user_id, p_xp_amount, calc_level(p_xp_amount))
  ON CONFLICT (user_id) DO UPDATE SET
    xp_total = user_stats.xp_total + p_xp_amount,
    level = calc_level(user_stats.xp_total + p_xp_amount),
    updated_at = now()
  RETURNING xp_total, level INTO v_new_xp, v_new_level;
END;
$$;

-- Fonction pour attribuer de l'XP pour un exercice
CREATE OR REPLACE FUNCTION award_xp_for_exercise(p_user_id uuid, p_exercise_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_exercise_xp integer;
  v_old_stats record;
  v_new_stats record;
BEGIN
  -- Récupérer l'XP de l'exercice
  SELECT xp_reward INTO v_exercise_xp
  FROM exercises
  WHERE id = p_exercise_id;

  IF v_exercise_xp IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Exercise not found');
  END IF;

  -- Récupérer les anciennes stats
  SELECT xp_total, level INTO v_old_stats
  FROM user_stats
  WHERE user_id = p_user_id;

  -- Attribuer l'XP
  PERFORM award_xp(p_user_id, v_exercise_xp);

  -- Récupérer les nouvelles stats
  SELECT xp_total, level INTO v_new_stats
  FROM user_stats
  WHERE user_id = p_user_id;

  -- Enregistrer la tentative
  INSERT INTO user_exercise_attempts (user_id, exercise_id, is_correct, xp_awarded)
  VALUES (p_user_id, p_exercise_id, true, v_exercise_xp);

  RETURN jsonb_build_object(
    'success', true,
    'xp_awarded', v_exercise_xp,
    'old_xp', COALESCE(v_old_stats.xp_total, 0),
    'new_xp', v_new_stats.xp_total,
    'old_level', COALESCE(v_old_stats.level, 1),
    'new_level', v_new_stats.level,
    'level_up', v_new_stats.level > COALESCE(v_old_stats.level, 1)
  );
END;
$$;

-- Fonction pour récupérer un quiz aléatoire
CREATE OR REPLACE FUNCTION get_random_quiz(p_limit integer DEFAULT 10, p_category_slug text DEFAULT NULL)
RETURNS TABLE (
  exercise_id uuid,
  question text,
  media jsonb,
  options jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id as exercise_id,
    e.question,
    NULL::jsonb as media,
    e.options
  FROM exercises e
  LEFT JOIN exercise_categories ec ON e.category_id = ec.id
  WHERE (p_category_slug IS NULL OR ec.name ILIKE '%' || p_category_slug || '%')
  ORDER BY RANDOM()
  LIMIT p_limit;
END;
$$;

-- Fonction pour initialiser les stats utilisateur
CREATE OR REPLACE FUNCTION init_user_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Créer les stats utilisateur
  INSERT INTO user_stats (user_id, xp_total, level)
  VALUES (NEW.id, 0, 1)
  ON CONFLICT (user_id) DO NOTHING;

  -- Créer les paramètres utilisateur
  INSERT INTO user_settings (user_id, theme_preference, notifications_enabled)
  VALUES (NEW.id, 'dark', false)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger pour initialiser les données utilisateur à l'inscription
CREATE OR REPLACE TRIGGER init_user_data_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION init_user_stats();