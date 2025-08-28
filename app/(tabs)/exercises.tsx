import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Play } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';

interface ExerciseCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export default function ExercisesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<ExerciseCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('exercise_categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomExercise = () => {
    router.push('/exercise/random' as any);
  };

  const handleCategoryPress = (category: ExerciseCategory) => {
    router.push(`/exercise/category/${category.id}` as any);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exercices</Text>
        <Text style={styles.subtitle}>Teste tes connaissances avec des QCM</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Bouton Commencer */}
        <TouchableOpacity onPress={handleRandomExercise} activeOpacity={0.8} style={styles.startButton}>
          <Card style={styles.startCard}>
            <View style={styles.startContent}>
              <View style={styles.startIconContainer}>
                <Play size={32} color="#ffffff" />
              </View>
              <View style={styles.startTextContainer}>
                <Text style={styles.startTitle}>Commencer</Text>
                <Text style={styles.startSubtitle}>catégories aléatoires</Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Catégories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catégories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.8}
                style={styles.categoryButton}
              >
                <Card style={styles.categoryCard}>
                  <View style={styles.categoryContent}>
                    <View style={styles.categoryEmojiContainer}>
                      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                    </View>
                    <Text style={styles.categoryTitle}>{category.name}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  startButton: {
    marginBottom: 32,
  },
  startCard: {
    padding: 0,
    backgroundColor: '#e11d48',
    borderColor: '#e11d48',
  },
  startContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  startIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  startTextContainer: {
    flex: 1,
  },
  startTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
  },
  startSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    marginBottom: 12,
  },
  categoryCard: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    height: 100,
  },
  categoryContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
});