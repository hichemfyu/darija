import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Achievement } from '@/data/mockData';

interface UserState {
  profile: UserProfile;
  achievements: Achievement[];
  favoriteWords: string[];
  completedLessons: string[];
  completedExercises: string[];
  
  // Actions
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  completeExercise: (exerciseId: string, correct: boolean) => void;
  toggleFavoriteWord: (wordId: string) => void;
  updateStreak: () => void;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: {
    pseudo: 'Invité',
    xp: 180,
    level: 3,
    streak: 7,
    accuracy: 85,
    totalLessons: 3,
    completedLessons: 1,
    totalExercises: 10,
    completedExercises: 6,
    studyTimeMinutes: 145
  },
  achievements: [
    {
      id: 'a1',
      title: 'Premier Pas',
      description: 'Complète ta première leçon',
      icon: 'award',
      unlocked: true
    },
    {
      id: 'a2',
      title: 'Série de 7',
      description: 'Maintiens une série de 7 jours',
      icon: 'flame',
      unlocked: true
    },
    {
      id: 'a3',
      title: 'Expert QCM',
      description: 'Réussis 10 exercices consécutifs',
      icon: 'target',
      unlocked: false,
      progress: 6,
      maxProgress: 10
    }
  ],
  favoriteWords: [],
  completedLessons: ['l1'],
  completedExercises: [],

  addXP: (amount: number) => {
    set((state) => {
      const newXP = state.profile.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      return {
        profile: {
          ...state.profile,
          xp: newXP,
          level: newLevel
        }
      };
    });
    
    get().saveData();
  },

  completeLesson: (lessonId: string) => {
    set((state) => {
      if (state.completedLessons.includes(lessonId)) return state;
      
      const newCompletedLessons = [...state.completedLessons, lessonId];
      return {
        completedLessons: newCompletedLessons,
        profile: {
          ...state.profile,
          completedLessons: newCompletedLessons.length,
          studyTimeMinutes: state.profile.studyTimeMinutes + 15
        }
      };
    });
    get().saveData();
  },

  completeExercise: (exerciseId: string, correct: boolean) => {
    set((state) => {
      if (state.completedExercises.includes(exerciseId)) return state;
      
      const newCompletedExercises = [...state.completedExercises, exerciseId];
      const totalCompleted = newCompletedExercises.length;
      const correctAnswers = Math.floor(totalCompleted * (state.profile.accuracy / 100));
      const newCorrectAnswers = correctAnswers + (correct ? 1 : 0);
      const newAccuracy = Math.round((newCorrectAnswers / totalCompleted) * 100);
      
      return {
        completedExercises: newCompletedExercises,
        profile: {
          ...state.profile,
          completedExercises: totalCompleted,
          accuracy: newAccuracy,
          studyTimeMinutes: state.profile.studyTimeMinutes + 2
        }
      };
    });
    get().saveData();
  },

  toggleFavoriteWord: (wordId: string) => {
    set((state) => ({
      favoriteWords: state.favoriteWords.includes(wordId)
        ? state.favoriteWords.filter(id => id !== wordId)
        : [...state.favoriteWords, wordId]
    }));
    get().saveData();
  },

  updateStreak: () => {
    set((state) => ({
      profile: {
        ...state.profile,
        streak: state.profile.streak + 1
      }
    }));
    get().saveData();
  },

  loadData: async () => {
    try {
      const data = await AsyncStorage.getItem('userProfile');
      if (data) {
        const parsedData = JSON.parse(data);
        set(parsedData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  },

  saveData: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem('userProfile', JSON.stringify({
        profile: state.profile,
        achievements: state.achievements,
        favoriteWords: state.favoriteWords,
        completedLessons: state.completedLessons,
        completedExercises: state.completedExercises
      }));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }
}));