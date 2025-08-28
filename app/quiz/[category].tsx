import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle, XCircle, Trophy } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { XPGain } from '@/components/ui/XPGain';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/stores/userStore';

interface Exercise {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  xp_reward: number;
}

export default function QuizScreen() {
  const router = useRouter();
  const { category, level = 'beginner' } = useLocalSearchParams();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showXPGain, setShowXPGain] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addXP, completeExercise } = useUserStore();

  useEffect(() => {
    fetchExercises();
  }, [category, level]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('category_id', category)
        .eq('level', level)
        .limit(10);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setExercises(data);
      } else {
        // Fallback avec des exercices par défaut
        setExercises([
          {
            id: '1',
            question: 'Comment dit-on "Bonjour" en darija ?',
            options: ['Salam', 'Bslama', 'Shokran', 'Afak'],
            correct_answer: 0,
            explanation: 'Salam signifie bonjour en darija.',
            xp_reward: 10
          },
          {
            id: '2',
            question: 'Que signifie "Shokran" ?',
            options: ['Bonjour', 'Au revoir', 'Merci', 'S\'il te plaît'],
            correct_answer: 2,
            explanation: 'Shokran signifie merci.',
            xp_reward: 10
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
      Alert.alert('Erreur', 'Impossible de charger les exercices');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentExercise = exercises[currentIndex];
    const isCorrect = selectedAnswer === currentExercise.correct_answer;
    
    if (isCorrect) {
      setScore(score + 1);
      addXP(currentExercise.xp_reward);
      setShowXPGain(true);
    }
    
    completeExercise(currentExercise.id, isCorrect);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz terminé
      const percentage = Math.round((score / exercises.length) * 100);
      Alert.alert(
        'Quiz terminé !',
        `Score: ${score}/${exercises.length} (${percentage}%)`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement du quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (exercises.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>Quiz</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun exercice disponible</Text>
          <Button title="Retour" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = exercises[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <XPGain 
        amount={currentExercise.xp_reward}
        visible={showXPGain}
        onAnimationComplete={() => setShowXPGain(false)}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Quiz</Text>
        <Text style={styles.progress}>
          {currentIndex + 1}/{exercises.length}
        </Text>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Card style={styles.questionCard}>
          <Text style={styles.questionText}>{currentExercise.question}</Text>
          <View style={styles.xpBadge}>
            <Trophy size={16} color="#f59e0b" />
            <Text style={styles.xpText}>+{currentExercise.xp_reward} XP</Text>
          </View>
        </Card>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {currentExercise.options.map((option, index) => {
          let optionStyle = styles.optionCard;
          let textStyle = styles.optionText;
          
          if (showResult) {
            if (index === currentExercise.correct_answer) {
              optionStyle = styles.correctOption;
              textStyle = styles.correctOptionText;
            } else if (index === selectedAnswer && selectedAnswer !== currentExercise.correct_answer) {
              optionStyle = styles.incorrectOption;
              textStyle = styles.incorrectOptionText;
            }
          } else if (selectedAnswer === index) {
            optionStyle = styles.selectedOption;
            textStyle = styles.selectedOptionText;
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswerSelect(index)}
              disabled={showResult}
              style={styles.optionButton}
            >
              <Card style={optionStyle}>
                <View style={styles.optionContent}>
                  <Text style={textStyle}>{option}</Text>
                  {showResult && index === currentExercise.correct_answer && (
                    <CheckCircle size={20} color="#10b981" />
                  )}
                  {showResult && index === selectedAnswer && selectedAnswer !== currentExercise.correct_answer && (
                    <XCircle size={20} color="#ef4444" />
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Explanation */}
      {showResult && (
        <Card style={styles.explanationCard}>
          <Text style={styles.explanationTitle}>Explication</Text>
          <Text style={styles.explanationText}>{currentExercise.explanation}</Text>
        </Card>
      )}

      {/* Action Button */}
      <View style={styles.actionContainer}>
        {showResult ? (
          <Button
            title={currentIndex < exercises.length - 1 ? "Question suivante" : "Terminer le quiz"}
            onPress={handleNextQuestion}
          />
        ) : (
          <Button
            title="Valider"
            onPress={handleSubmitAnswer}
            disabled={selectedAnswer === null}
          />
        )}
      </View>
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
    justifyContent: 'space-between',
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
    flex: 1,
  },
  progress: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#8b5cf6',
  },
  questionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  questionCard: {
    padding: 20,
  },
  questionText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 28,
    marginBottom: 12,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f59e0b20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  xpText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#f59e0b',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    width: '100%',
  },
  optionCard: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  selectedOption: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  correctOption: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  incorrectOption: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#ffffff',
    flex: 1,
  },
  selectedOptionText: {
    color: '#ffffff',
  },
  correctOptionText: {
    color: '#ffffff',
  },
  incorrectOptionText: {
    color: '#ffffff',
  },
  explanationCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#8b5cf620',
    borderColor: '#8b5cf6',
    marginBottom: 24,
  },
  explanationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#8b5cf6',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    lineHeight: 20,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
});