/*
  # Mise à jour de l'ordre des catégories du dictionnaire

  1. Modifications
    - Mise à jour du champ sort_order pour organiser les catégories par ordre d'intérêt
    - Les catégories les plus utiles pour débuter en darija sont placées en premier

  2. Ordre d'intérêt
    - Salutations (base de toute conversation)
    - Famille (relations importantes)
    - Nourriture et Boissons (besoins quotidiens)
    - Chiffres (utiles partout)
    - Couleurs (descriptifs de base)
    - Corps humain (vocabulaire personnel)
    - Émotions (expression des sentiments)
    - Maison et Chambre (environnement quotidien)
    - Vêtements (besoins quotidiens)
    - Transport (déplacements)
    - Date / Heure (organisation temporelle)
    - Santé (besoins importants)
    - Professions (vie sociale)
    - Éducation (apprentissage)
    - Sport (loisirs)
    - Environnement (nature)
    - Animaux – Insectes (nature)
    - Remerciements (politesse)
    - Autre (divers)
*/

-- Mise à jour de l'ordre des catégories par intérêt pédagogique
UPDATE dictionary_categories SET sort_order = 1 WHERE name = 'Salutations';
UPDATE dictionary_categories SET sort_order = 2 WHERE name = 'Famille';
UPDATE dictionary_categories SET sort_order = 3 WHERE name = 'Nourriture et Boissons';
UPDATE dictionary_categories SET sort_order = 4 WHERE name = 'Chiffres';
UPDATE dictionary_categories SET sort_order = 5 WHERE name = 'Couleurs';
UPDATE dictionary_categories SET sort_order = 6 WHERE name = 'Corps humain';
UPDATE dictionary_categories SET sort_order = 7 WHERE name = 'Émotions';
UPDATE dictionary_categories SET sort_order = 8 WHERE name = 'Maison et Chambre';
UPDATE dictionary_categories SET sort_order = 9 WHERE name = 'Vêtements';
UPDATE dictionary_categories SET sort_order = 10 WHERE name = 'Transport';
UPDATE dictionary_categories SET sort_order = 11 WHERE name = 'Date / Heure';
UPDATE dictionary_categories SET sort_order = 12 WHERE name = 'Santé';
UPDATE dictionary_categories SET sort_order = 13 WHERE name = 'Professions';
UPDATE dictionary_categories SET sort_order = 14 WHERE name = 'Éducation';
UPDATE dictionary_categories SET sort_order = 15 WHERE name = 'Sport';
UPDATE dictionary_categories SET sort_order = 16 WHERE name = 'Environnement';
UPDATE dictionary_categories SET sort_order = 17 WHERE name = 'Animaux – Insectes';
UPDATE dictionary_categories SET sort_order = 18 WHERE name = 'Remerciements';
UPDATE dictionary_categories SET sort_order = 19 WHERE name = 'Autre';