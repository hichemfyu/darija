import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'dark' | 'light' | 'system';

export interface UserSettings {
  user_id: string;
  theme_preference: ThemePreference;
  notifications_enabled: boolean;
  push_token?: string | null;
  created_at: string;
  updated_at: string;
}

const SETTINGS_STORAGE_KEY = 'userSettings';

export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    // Essayer d'abord depuis Supabase
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (data) {
      // Sauvegarder en cache local
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
      return data;
    }

    // Fallback vers le cache local
    const cachedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    return cachedSettings ? JSON.parse(cachedSettings) : null;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    
    // Fallback vers le cache local en cas d'erreur
    try {
      const cachedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      return cachedSettings ? JSON.parse(cachedSettings) : null;
    } catch {
      return null;
    }
  }
};

export const updateUserSettings = async (
  userId: string, 
  settings: Partial<Omit<UserSettings, 'user_id' | 'created_at' | 'updated_at'>>
): Promise<UserSettings> => {
  try {
    // Mettre à jour dans Supabase
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Sauvegarder en cache local
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    
    // Fallback : sauvegarder seulement en local
    const fallbackSettings = {
      user_id: userId,
      ...settings,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as UserSettings;
    
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(fallbackSettings));
    return fallbackSettings;
  }
};

export const initializeUserSettings = async (userId: string): Promise<UserSettings> => {
  const defaultSettings = {
    user_id: userId,
    theme_preference: 'dark' as ThemePreference,
    notifications_enabled: false,
    push_token: null
  };

  return updateUserSettings(userId, defaultSettings);
};