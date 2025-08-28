import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Play, Trophy } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface Exercise {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  level: string;
  xp_reward: number;
}

export default function CategoryExercisesScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const levels = [
    { key: 'beginner' as const, title: 'Débutant', color: '#10b981' },
    { key: 'intermediate' as const, title: 'Intermédiaire', color: '#f59e0b' },
    { key: 'advanced' as const, title: 'Avancé', color: '#e11d48' }
  ];

  useEffect(() => {
    if (category) {
      fetchExercises();
    }
  }, [category, selectedLevel]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('category_id', category)
        .eq('level', selectedLevel)
        .limit(10);

      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      // Fallback avec des exercices par défaut
      setExercises([
        {
          id: '1',
          question: 'Comment dit-on "Bonjour" en darija ?',
          options: ['Salam', 'Bslama', 'Shokran', 'Afak'],
          correct_answer: 0,
          explanation: 'Salam signifie bonjour en darija.',
          level: selectedLevel,
          xp_reward: 10
        },
        {
          id: '2',
          question: 'Que signifie "Shokran" ?',
          options: ['Bonjour', 'Au revoir', 'Merci', 'S\'il te plaît'],
          correct_answer: 2,
          explanation: 'Shokran signifie merci.',
          level: selectedLevel,
          xp_reward: 10
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    if (exercises.length > 0) {
      router.push(`/quiz/${category}?level=${selectedLevel}` as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Exercices</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Level Selection */}
        <View style={styles.levelSelection}>
          <Text style={styles.sectionTitle}>Choisir le niveau</Text>
          <View style={styles.levelButtons}>
            {levels.map((level) => (
              <TouchableOpacity
                key={level.key}
                onPress={() => setSelectedLevel(level.key)}
                style={[
                  styles.levelButton,
                  selectedLevel === level.key && { backgroundColor: level.color }
                ]}
              >
                <Text style={[
                  styles.levelButtonText,
                  selectedLevel === level.key && styles.selectedLevelText
                ]}>
                  {level.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Exercises Preview */}
        <View style={styles.exercisesPreview}>
          <Text style={styles.sectionTitle}>
            {exercises.length} exercice{exercises.length > 1 ? 's' : ''} disponible{exercises.length > 1 ? 's' : ''}
          </Text>
          
          {loading ? (
            <Card style={styles.loadingCard}>
              <Text style={styles.loadingText}>Chargement des exercices...</Text>
            </Card>
          ) : (
            <>
              {exercises.slice(0, 3).map((exercise, index) => (
                <Card key={exercise.id} style={styles.exercisePreviewCard}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseNumber}>Question {index + 1}</Text>
                    <View style={styles.xpBadge}>
                      <Trophy size={12} color="#f59e0b" />
                      <Text style={styles.xpText}>+{exercise.xp_reward} XP</Text>
                    </View>
                  </View>
                  <Text style={styles.exerciseQuestion}>{exercise.question}</Text>
                  <Text style={styles.exerciseOptions}>
                    {exercise.options.length} options de réponse
                  </Text>
                </Card>
              ))}
              
              {exercises.length > 3 && (
                <Text style={styles.moreExercises}>
                  +{exercises.length - 3} exercice{exercises.length - 3 > 1 ? 's' : ''} de plus...
                </Text>
              )}
            </>
          )}
        </View>

        {/* Start Button */}
        <View style={styles.startContainer}>
          <Button
            title={`Commencer le quiz (${exercises.length} questions)`}
            onPress={startQuiz}
            disabled={exercises.length === 0 || loading}
            style={styles.startButton}
          />
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
  levelSelection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  levelButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#3f3f46',
    alignItems: 'center',
  },
  levelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#a1a1aa',
  },
  selectedLevelText: {
    color: '#ffffff',
  },
  exercisesPreview: {
    padding: 20,
    paddingTop: 0,
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
  exercisePreviewCard: {
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseNumber: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#8b5cf6',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  xpText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#f59e0b',
  },
  exerciseQuestion: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
  },
  exerciseOptions: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  moreExercises: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8b5cf6',
    textAlign: 'center',
    marginTop: 8,
  },
  startContainer: {
    padding: 20,
  },
  startButton: {
    backgroundColor: '#e11d48',
  },
});