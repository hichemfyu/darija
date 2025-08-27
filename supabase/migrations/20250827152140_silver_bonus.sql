/*
  # Ajout de nouveaux mots au dictionnaire

  1. Nouveaux mots
    - Ajout de mots supplémentaires dans différentes catégories
    - Mots avec phonétique et traductions

  2. Catégories concernées
    - Salutations, Politesse, Famille, Nourriture, etc.
*/

-- Ajouter des mots supplémentaires au dictionnaire
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

  -- Ajouter plus de mots Salutations
  INSERT INTO dictionary_words (category_id, word, darija, french, phonetic, audio_url) VALUES
    (salutations_id, 'Comment ça va', 'Kifash dayr', 'Comment ça va ?', 'ki-fash da-yr', NULL),
    (salutations_id, 'Ça va bien', 'Labas', 'Ça va bien', 'la-bas', NULL),
    (salutations_id, 'Au revoir', 'Bslama', 'Au revoir', 'b-sla-ma', NULL);

  -- Ajouter plus de mots Politesse
  INSERT INTO dictionary_words (category_id, word, darija, french, phonetic, audio_url) VALUES
    (politesse_id, 'Excuse-moi', 'Smahli', 'Excuse-moi', 'smah-li', NULL),
    (politesse_id, 'De rien', 'La shokran 3la wajib', 'De rien', 'la shok-ran 3la wa-jib', NULL),
    (politesse_id, 'Pardon', 'Samhini', 'Pardon', 'sam-hi-ni', NULL);

  -- Ajouter plus de mots Famille
  INSERT INTO dictionary_words (category_id, word, darija, french, phonetic, audio_url) VALUES
    (famille_id, 'Grand-père', 'Jedd', 'Grand-père', 'jedd', NULL),
    (famille_id, 'Grand-mère', 'Jidda', 'Grand-mère', 'jid-da', NULL),
    (famille_id, 'Oncle', '3amm', 'Oncle', '3amm', NULL),
    (famille_id, 'Tante', '3amma', 'Tante', '3am-ma', NULL);

  -- Ajouter plus de mots Nourriture
  INSERT INTO dictionary_words (category_id, word, darija, french, phonetic, audio_url) VALUES
    (nourriture_id, 'Lait', 'Hlib', 'Lait', 'h-lib', NULL),
    (nourriture_id, 'Sucre', 'Sukar', 'Sucre', 'su-kar', NULL),
    (nourriture_id, 'Sel', 'Melh', 'Sel', 'melh', NULL),
    (nourriture_id, 'Riz', 'Rouz', 'Riz', 'rouz', NULL),
    (nourriture_id, 'Poisson', 'Hout', 'Poisson', 'hout', NULL);

  -- Ajouter plus de mots Questions
  INSERT INTO dictionary_words (category_id, word, darija, french, phonetic, audio_url) VALUES
    (questions_id, 'Quoi', 'Ash', 'Quoi', 'ash', NULL),
    (questions_id, 'Qui', 'Shkoun', 'Qui', 'shk-oun', NULL),
    (questions_id, 'Quand', 'Imta', 'Quand', 'im-ta', NULL),
    (questions_id, 'Comment', 'Kifash', 'Comment', 'ki-fash', NULL),
    (questions_id, 'Pourquoi', '3lash', 'Pourquoi', '3lash', NULL);

  -- Ajouter plus de nombres
  INSERT INTO dictionary_words (category_id, word, darija, french, phonetic, audio_url) VALUES
    (nombres_id, 'Six', 'Stta', 'Six', 'st-ta', NULL),
    (nombres_id, 'Sept', 'Sb3a', 'Sept', 'sb-3a', NULL),
    (nombres_id, 'Huit', 'Tmnya', 'Huit', 'tm-nya', NULL),
    (nombres_id, 'Neuf', 'Ts3oud', 'Neuf', 'ts-3oud', NULL),
    (nombres_id, 'Dix', '3ashra', 'Dix', '3ash-ra', NULL);

END $$;