import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Search, Heart, Volume2 } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { playSound } from '@/services/audioService';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/stores/userStore';

interface DictionaryWord {
  id: string;
  word: string;
  darija: string;
  french: string;
  phonetic: string;
  audio_url: string | null;
  category_id: string;
}

interface DictionaryCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export default function CategoryWordsScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [words, setWords] = useState<DictionaryWord[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<DictionaryCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const { favoriteWords, toggleFavoriteWord } = useUserStore();

  useEffect(() => {
    fetchCategoryAndWords();
  }, [category]);

  const fetchCategoryAndWords = async () => {
    try {
      // Récupérer les informations de la catégorie
      const { data: categoryData, error: categoryError } = await supabase
        .from('dictionary_categories')
        .select('*')
        .eq('id', category)
        .single();

      if (categoryError && categoryError.code !== 'PGRST116') throw categoryError;
      setCategoryInfo(categoryData);

      // Récupérer les mots de cette catégorie
      const { data: wordsData, error: wordsError } = await supabase
        .from('dictionary_words')
        .select('*')
        .eq('category_id', category)
        .order('darija', { ascending: true });

      if (wordsError && wordsError.code !== 'PGRST116') throw wordsError;
      setWords(wordsData || []);
    } catch (error) {
      console.error('Error fetching category and words:', error);
      // Fallback si pas de données
      if (!categoryInfo) {
        setCategoryInfo({
          id: category as string,
          name: 'Catégorie',
          emoji: '📚',
          color: '#e11d48',
          description: 'Mots de vocabulaire'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredWords = useMemo(() => {
    let filteredWords = words;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredWords = filteredWords.filter(word =>
        word.darija.toLowerCase().includes(query) ||
        word.french.toLowerCase().includes(query) ||
        word.phonetic.toLowerCase().includes(query)
      );
    }

    return filteredWords;
  }, [words, searchQuery]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!categoryInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Catégorie introuvable</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={styles.categoryHeader}>
            <View style={[styles.categoryIcon, { backgroundColor: `${categoryInfo.color}20` }]}>
              <Text style={styles.categoryEmoji}>{categoryInfo.emoji}</Text>
            </View>
            <View style={styles.categoryTitleContainer}>
              <Text style={styles.categoryTitle}>{categoryInfo.name}</Text>
              <Text style={styles.wordCount}>{filteredWords.length} mots</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#71717a" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher dans cette catégorie..."
            placeholderTextColor="#71717a"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Words List */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.wordsContainer}
        contentContainerStyle={styles.wordsContent}
      >
        {filteredWords.map((word) => (
          <Card key={word.id} style={styles.wordCard}>
            <View style={styles.wordHeader}>
              <View style={styles.wordMainInfo}>
                <Text style={styles.wordDarija}>{word.darija}</Text>
                <Text style={styles.wordPhonetic}>[{word.phonetic}]</Text>
              </View>
              
              <View style={styles.wordActions}>
                <TouchableOpacity
                  onPress={() => toggleFavoriteWord(word.id)}
                  style={styles.actionButton}
                >
                  <Heart 
                    size={18} 
                    color={favoriteWords.includes(word.id) ? '#e11d48' : '#71717a'}
                    fill={favoriteWords.includes(word.id) ? '#e11d48' : 'none'}
                  />
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => word.audio_url && playSound(word.audio_url)}
                  disabled={!word.audio_url}
                  style={styles.actionButton}
                >
                  <Volume2 size={18} color="#e11d48" />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={styles.wordFrench}>{word.french}</Text>
          </Card>
        ))}
        
        {filteredWords.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucun mot trouvé</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Essaie une autre recherche' : 'Cette catégorie est vide'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
  },
  wordCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
  },
  wordsContainer: {
    flex: 1,
  },
  wordsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  wordCard: {
    marginBottom: 12,
    padding: 18,
    backgroundColor: '#1a1a1a',
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  wordMainInfo: {
    flex: 1,
  },
  wordDarija: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
  },
  wordPhonetic: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6366f1',
    marginTop: 2,
    fontStyle: 'italic',
  },
  wordActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#27272a',
  },
  wordFrench: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#e11d48',
  },
});