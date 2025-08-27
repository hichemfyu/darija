import { supabase } from './supabase';

export interface ResumeDestination {
  route: string;
  params?: Record<string, any>;
}

export const getResumeDestination = async (userId: string): Promise<ResumeDestination | null> => {
  try {
    // 1. Vérifier s'il y a une tentative d'exercice récente (dernières 24h)
    const { data: recentAttempt } = await supabase
      .from('user_exercise_attempts')
      .select('exercise_id, attempted_at')
      .eq('user_id', userId)
      .gte('attempted_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('attempted_at', { ascending: false })
      .limit(1)
      .single();

    if (recentAttempt) {
      return {
        route: '/exercise/random',
        params: { resumeExercise: recentAttempt.exercise_id }
      };
    }

    // 2. Vérifier s'il y a une leçon en cours
    const { data: lessonProgress } = await supabase
      .from('user_lesson_progress')
      .select('lesson_id, status')
      .eq('user_id', userId)
      .eq('status', 'in_progress')
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (lessonProgress) {
      return {
        route: `/lesson/${lessonProgress.lesson_id}`
      };
    }

    // 3. Fallback : première leçon disponible
    return {
      route: '/exercises'
    };
  } catch (error) {
    console.error('Error getting resume destination:', error);
    // Fallback en cas d'erreur
    return {
      route: '/exercises'
    };
  }
};