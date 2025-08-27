import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';

interface DictionaryCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export default function DictionaryScreen() {
  const router = useRouter();
  const [dictionaryCategories, setDictionaryCategories] = useState<DictionaryCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('dictionary_categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setDictionaryCategories(data || []);
    } catch (error) {
      console.error('Error fetching dictionary categories:', error);
      // Fallback vers des catégories par défaut
      setDictionaryCategories([
        { id: '1', name: 'Salutations', emoji: '👋', color: '#e11d48', description: 'Dire bonjour et se présenter' },
        { id: '2', name: 'Famille', emoji: '👪', color: '#10b981', description: 'Membres de la famille' },
        { id: '3', name: 'Nourriture', emoji: '🍽️', color: '#3b82f6', description: 'Aliments et boissons' },
        { id: '4', name: 'Nombres', emoji: '🔢', color: '#f59e0b', description: 'Chiffres et nombres' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: DictionaryCategory) => {
    router.push(`/dictionary/${category.id}` as any);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dictionnaire</Text>
          <Text style={styles.subtitle}>Français ↔ Darija</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement des catégories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dictionnaire</Text>
        <Text style={styles.subtitle}>Français ↔ Darija</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.categoriesList}>
          {dictionaryCategories.map((category) => {
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.8}
                style={styles.categoryButton}
              >
                <Card style={styles.categoryCard}>
                  <View style={styles.categoryContent}>
                    <View style={styles.categoryHeader}>
                      <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                        <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                      </View>
                      <View style={styles.categoryInfo}>
                        <Text style={styles.categoryTitle}>{category.name}</Text>
                        <Text style={styles.categoryDescription}>{category.description}</Text>
                      </View>
                      <ChevronRight size={24} color="#71717a" />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {dictionaryCategories.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucune catégorie trouvée</Text>
            <Text style={styles.emptySubtext}>Les catégories apparaîtront ici une fois ajoutées</Text>
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
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  categoriesList: {
    gap: 12,
  },
  categoryButton: {
    width: '100%',
  },
  categoryCard: {
    padding: 0,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  categoryContent: {
    padding: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
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
    textAlign: 'center',
  },
});