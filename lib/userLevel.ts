import { supabase } from './supabase';

export interface UserStats {
  user_id: string;
  xp_total: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export const calcLevel = (xpTotal: number): number => {
  // Formule : niveau = floor(sqrt(xp_total / 100)) + 1
  return Math.max(1, Math.floor(Math.sqrt(xpTotal / 100)) + 1);
};

export const getXPForLevel = (level: number): number => {
  // XP requis pour atteindre ce niveau
  return Math.pow(level - 1, 2) * 100;
};

export const getProgressToNextLevel = (currentXP: number, currentLevel: number) => {
  const xpForCurrentLevel = getXPForLevel(currentLevel);
  const xpForNextLevel = getXPForLevel(currentLevel + 1);
  const progress = (currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel);
  return Math.min(1, Math.max(0, progress));
};

export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
};

export const initializeUserStats = async (userId: string): Promise<UserStats> => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .insert({
        user_id: userId,
        xp_total: 0,
        level: 1
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error initializing user stats:', error);
    throw error;
  }
};

export const awardXP = async (userId: string, amount: number): Promise<void> => {
  try {
    const { error } = await supabase.rpc('award_xp', {
      p_user_id: userId,
      p_xp_amount: amount
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error awarding XP:', error);
    throw error;
  }
};

export const awardXPForExercise = async (userId: string, exerciseId: string) => {
  try {
    const { data, error } = await supabase.rpc('award_xp_for_exercise', {
      p_user_id: userId,
      p_exercise_id: exerciseId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error awarding XP for exercise:', error);
    throw error;
  }
};