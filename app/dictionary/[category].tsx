import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Search, Heart, Volume2 } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/stores/userStore';

interface DictionaryWord {
  id: string;
  word: string;
  darija: string;
  french: string;
  phonetic: string;
  audio_url?: string;
}

export default function CategoryDictionaryScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const [words, setWords] = useState<DictionaryWord[]>([]);
  const [filteredWords, setFilteredWords] = useState<DictionaryWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { favoriteWords, toggleFavoriteWord } = useUserStore();

  useEffect(() => {
    if (category) {
      fetchWords();
    }
  }, [category]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredWords(words);
    } else {
      const filtered = words.filter(word =>
        word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.darija.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.french.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWords(filtered);
    }
  }, [searchQuery, words]);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dictionary_words')
        .select('*')
        .eq('category_id', category);

      if (error) throw error;
      setWords(data || []);
      setFilteredWords(data || []);
    } catch (error) {
      console.error('Error fetching words:', error);
      // Fallback avec des mots par défaut
      const fallbackWords = [
        { id: '1', word: 'Salam', darija: 'Salam', french: 'Salut / Bonjour', phonetic: 'sa-lam' },
        { id: '2', word: 'Shokran', darija: 'Shokran', french: 'Merci', phonetic: 'shok-ran' },
        { id: '3', word: 'Afak', darija: 'Afak', french: 'S\'il te plaît', phonetic: 'a-fak' }
      ];
      setWords(fallbackWords);
      setFilteredWords(fallbackWords);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      console.log('Playing audio:', audioUrl);
      // Ici on pourrait implémenter la lecture audio
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Dictionnaire</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#71717a" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un mot..."
            placeholderTextColor="#71717a"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Words List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.wordsList}>
        {loading ? (
          <Card style={styles.loadingCard}>
            <Text style={styles.loadingText}>Chargement des mots...</Text>
          </Card>
        ) : filteredWords.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Aucun mot trouvé' : 'Aucun mot dans cette catégorie'}
            </Text>
          </Card>
        ) : (
          filteredWords.map((word) => {
            const isFavorite = favoriteWords.includes(word.id);
            
            return (
              <Card key={word.id} style={styles.wordCard}>
                <View style={styles.wordHeader}>
                  <View style={styles.wordInfo}>
                    <Text style={styles.wordDarija}>{word.darija}</Text>
                    <Text style={styles.wordPhonetic}>[{word.phonetic}]</Text>
                  </View>
                  <View style={styles.wordActions}>
                    {word.audio_url && (
                      <TouchableOpacity
                        onPress={() => playAudio(word.audio_url)}
                        style={styles.audioButton}
                      >
                        <Volume2 size={20} color="#8b5cf6" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => toggleFavoriteWord(word.id)}
                      style={styles.favoriteButton}
                    >
                      <Heart 
                        size={20} 
                        color={isFavorite ? "#e11d48" : "#71717a"}
                        fill={isFavorite ? "#e11d48" : "transparent"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.wordFrench}>{word.french}</Text>
              </Card>
            );
          })
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
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    marginLeft: 12,
  },
  wordsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingCard: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  emptyCard: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  wordCard: {
    padding: 16,
    marginBottom: 12,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  wordInfo: {
    flex: 1,
  },
  wordDarija: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  wordPhonetic: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8b5cf6',
    fontStyle: 'italic',
  },
  wordActions: {
    flexDirection: 'row',
    gap: 8,
  },
  audioButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  wordFrench: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
});