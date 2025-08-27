/*
  # Suppression de la catégorie Objets

  1. Suppression des exercices liés à la catégorie Objets
  2. Suppression de la catégorie Objets elle-même
*/

-- Supprimer tous les exercices de la catégorie "Objets"
DELETE FROM public.exercises 
WHERE category_id IN (
  SELECT id FROM public.exercise_categories 
  WHERE name = 'Objets'
);

-- Supprimer la catégorie "Objets"
DELETE FROM public.exercise_categories 
WHERE name = 'Objets';