import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface ExerciseCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface Exercise {
  id: string;
  category_id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  xp_reward: number;
}

export default function AdminExercisesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<ExerciseCategory[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [xpReward, setXpReward] = useState('10');

  const levels = [
    { key: 'beginner' as const, title: 'Débutant', color: '#10b981' },
    { key: 'intermediate' as const, title: 'Intermédiaire', color: '#f59e0b' },
    { key: 'advanced' as const, title: 'Avancé', color: '#ef4444' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('exercise_categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch exercises
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')
        .order('created_at', { ascending: false });

      if (exercisesError) throw exercisesError;
      setExercises(exercisesData || []);

      if (categoriesData && categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const resetForm = () => {
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
    setExplanation('');
    setXpReward('10');
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !question.trim() || options.some(opt => !opt.trim()) || !explanation.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      const { error } = await supabase
        .from('exercises')
        .insert({
          category_id: selectedCategory,
          level: selectedLevel,
          question: question.trim(),
          options: options.map(opt => opt.trim()),
          correct_answer: correctAnswer,
          explanation: explanation.trim(),
          xp_reward: parseInt(xpReward) || 10
        });

      if (error) throw error;

      Alert.alert('Succès', 'QCM ajouté avec succès !');
      resetForm();
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error adding exercise:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter le QCM');
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce QCM ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('exercises')
                .delete()
                .eq('id', exerciseId);

              if (error) throw error;
              fetchData(); // Refresh the list
            } catch (error) {
              console.error('Error deleting exercise:', error);
              Alert.alert('Erreur', 'Impossible de supprimer le QCM');
            }
          }
        }
      ]
    );
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? `${category.emoji} ${category.name}` : 'Catégorie inconnue';
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Gestion des QCM</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Add Exercise Form */}
        <Card style={styles.formCard}>
          <View style={styles.formHeader}>
            <Plus size={20} color="#e11d48" />
            <Text style={styles.formTitle}>Ajouter un nouveau QCM</Text>
          </View>

          {/* Category Selection */}
          <Text style={styles.label}>Catégorie</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.selectedCategoryChip
                ]}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.id && styles.selectedCategoryName
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Level Selection */}
          <Text style={styles.label}>Niveau</Text>
          <View style={styles.levelContainer}>
            {levels.map((level) => (
              <TouchableOpacity
                key={level.key}
                onPress={() => setSelectedLevel(level.key)}
                style={[
                  styles.levelChip,
                  selectedLevel === level.key && { backgroundColor: level.color }
                ]}
              >
                <Text style={[
                  styles.levelText,
                  selectedLevel === level.key && styles.selectedLevelText
                ]}>
                  {level.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Question */}
          <Text style={styles.label}>Question</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Entrez votre question..."
            placeholderTextColor="#71717a"
            value={question}
            onChangeText={setQuestion}
            multiline
          />

          {/* Options */}
          <Text style={styles.label}>Options de réponse</Text>
          {options.map((option, index) => (
            <View key={index} style={styles.optionContainer}>
              <TouchableOpacity
                onPress={() => setCorrectAnswer(index)}
                style={[
                  styles.correctButton,
                  correctAnswer === index && styles.correctButtonSelected
                ]}
              >
                <Text style={[
                  styles.correctButtonText,
                  correctAnswer === index && styles.correctButtonTextSelected
                ]}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.textInput, styles.optionInput]}
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                placeholderTextColor="#71717a"
                value={option}
                onChangeText={(value) => handleOptionChange(index, value)}
              />
            </View>
          ))}
          <Text style={styles.helperText}>Cliquez sur la lettre pour marquer la bonne réponse</Text>

          {/* Explanation */}
          <Text style={styles.label}>Explication</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Expliquez pourquoi cette réponse est correcte..."
            placeholderTextColor="#71717a"
            value={explanation}
            onChangeText={setExplanation}
            multiline
          />

          {/* XP Reward */}
          <Text style={styles.label}>Récompense XP</Text>
          <TextInput
            style={styles.textInput}
            placeholder="10"
            placeholderTextColor="#71717a"
            value={xpReward}
            onChangeText={setXpReward}
            keyboardType="numeric"
          />

          <Button
            title="Ajouter le QCM"
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </Card>

        {/* Existing Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QCM existants ({exercises.length})</Text>
          {exercises.map((exercise) => (
            <Card key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseCategory}>
                    {getCategoryName(exercise.category_id)}
                  </Text>
                  <Text style={[
                    styles.exerciseLevel,
                    { color: levels.find(l => l.key === exercise.level)?.color }
                  ]}>
                    {levels.find(l => l.key === exercise.level)?.title}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteExercise(exercise.id)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
              <Text style={styles.exerciseQuestion}>{exercise.question}</Text>
              <View style={styles.exerciseOptions}>
                {exercise.options.map((option, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.exerciseOption,
                      index === exercise.correct_answer && styles.correctOption
                    ]}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </Text>
                ))}
              </View>
              <Text style={styles.exerciseExplanation}>{exercise.explanation}</Text>
            </Card>
          ))}
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
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  formCard: {
    padding: 20,
    marginBottom: 24,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#3f3f46',
    minHeight: 44,
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  selectedCategoryChip: {
    backgroundColor: '#e11d48',
    borderColor: '#e11d48',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#a1a1aa',
  },
  selectedCategoryName: {
    color: '#ffffff',
  },
  levelContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  levelChip: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  levelText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#a1a1aa',
  },
  selectedLevelText: {
    color: '#ffffff',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  correctButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#3f3f46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctButtonSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  correctButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#a1a1aa',
  },
  correctButtonTextSelected: {
    color: '#ffffff',
  },
  optionInput: {
    flex: 1,
    marginTop: 0,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#71717a',
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  exerciseCard: {
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#e11d48',
  },
  exerciseLevel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  exerciseQuestion: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
  },
  exerciseOptions: {
    marginBottom: 8,
  },
  exerciseOption: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginBottom: 2,
  },
  correctOption: {
    color: '#10b981',
    fontWeight: '500',
  },
  exerciseExplanation: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#71717a',
    fontStyle: 'italic',
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