import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      dictionary_categories: {
        Row: {
          id: string;
          name: string;
          emoji: string;
          color: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          emoji: string;
          color?: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          emoji?: string;
          color?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      dictionary_words: {
        Row: {
          id: string;
          category_id: string;
          word: string;
          darija: string;
          french: string;
          phonetic: string;
          audio_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          word: string;
          darija: string;
          french: string;
          phonetic: string;
          audio_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          word?: string;
          darija?: string;
          french?: string;
          phonetic?: string;
          audio_url?: string | null;
          created_at?: string;
        };
      };
      exercise_categories: {
        Row: {
          id: string;
          name: string;
          emoji: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          emoji: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          emoji?: string;
          color?: string;
          created_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          category_id: string;
          level: 'beginner' | 'intermediate' | 'advanced';
          question: string;
          options: string[];
          correct_answer: number;
          explanation: string;
          xp_reward: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          level: 'beginner' | 'intermediate' | 'advanced';
          question: string;
          options: string[];
          correct_answer: number;
          explanation: string;
          xp_reward?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          level?: 'beginner' | 'intermediate' | 'advanced';
          question?: string;
          options?: string[];
          correct_answer?: number;
          explanation?: string;
          xp_reward?: number;
          created_at?: string;
        };
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          word_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          word_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          word_id?: string;
          created_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          completed: boolean;
          correct: boolean;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          completed?: boolean;
          correct?: boolean;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exercise_id?: string;
          completed?: boolean;
          correct?: boolean;
          completed_at?: string;
        };
      };
    };
  };
};