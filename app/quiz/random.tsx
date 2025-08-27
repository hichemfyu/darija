import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { ArrowLeft, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { XPGain } from '@/components/ui/XPGain';
import { supabase } from '@/lib/supabase';
import { awardXPForExercise } from '@/lib/userLevel';

interface Exercise {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  xp_reward: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface SessionStats {
  totalQuestions: number;
  correctAnswers: number;
  totalXP: number;
  timeSpent: number;
}

export default function RandomQuizScreen() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showXPGain, setShowXPGain] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    totalXP: 0,
    timeSpent: 0
  });
  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());
  const [showSessionSummary, setShowSessionSummary] = useState(false);

  const fetchRandomExercises = async () => {
    try {
      // Utiliser la fonction RPC pour récupérer des exercices aléatoires
      const { data, error } = await supabase.rpc('get_random_quiz', {
        p_limit: 10,
        p_category_slug: null
      });

      if (error) {
        console.error('Error fetching exercises:', error);
        return;
      }

      // Convertir les données RPC au format attendu
      const exerciseData = (data || []).map((item: any) => ({
        id: item.exercise_id,
        question: item.question,
        options: Array.isArray(item.options) ? item.options : [],
        correct_answer: 0, // Sera déterminé côté serveur
        explanation: 'Bonne réponse !',
        xp_reward: 10,
        level: 'beginner' as const
      }));
      
      setExercises(exerciseData);
      if (exerciseData.length > 0) {
        setCurrentExercise(exerciseData[0]);
        setCurrentQuestionIndex(1);
      }
    } catch (error) {
      console.error('Error in fetchRandomExercises:', error);
    }
  };
      
  const optionScale = useSharedValue(1);
  const animatedOptionStyle = useAnimatedStyle(() => ({
    transform: [{ scale: optionScale.value }]
  }));
  
  // Simuler un utilisateur pour les tests
  const mockUserId = 'mock-user-id';

  React.useEffect(() => {
    const initializeExercises = async () => {
      try {
        await fetchRandomExercises();
      } catch (error) {
        console.error('Error initializing exercises:', error);
        // Fallback vers des exercices par défaut
        const fallbackExercises = [
          {
            id: 'ex1',
            question: 'Comment dit-on "Bonjour" en darija ?',
            options: ['Salam', 'Bslama', 'Shokran', 'Afak'],
            correct_answer: 0,
            explanation: 'Salam signifie bonjour en darija.',
            xp_reward: 10,
            level: 'beginner' as const
          },
          {
            id: 'ex2',
            question: 'Que signifie "Shokran" ?',
            options: ['Bonjour', 'Au revoir', 'Merci', 'S\'il te plaît'],
            correct_answer: 2,
            explanation: 'Shokran signifie merci.',
            xp_reward: 10,
            level: 'beginner' as const
          }
        ];
        setExercises(fallbackExercises);
        if (fallbackExercises.length > 0) {
          setCurrentExercise(fallbackExercises[0]);
          setCurrentQuestionIndex(1);
        }
      }
    };
    
    initializeExercises();
    setSessionStartTime(new Date());
  }, []);

  const submitAnswer = async (answerIndex: number) => {
    if (!currentExercise || showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === currentExercise.correct_answer;
    
    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      totalXP: prev.totalXP + (isCorrect ? 10 : 0)
    }));
    
    if (isCorrect) {
      // Attribuer XP via Supabase
      try {
        await awardXPForExercise(mockUserId, currentExercise.id);
      } catch (error) {
        console.error('Error awarding XP:', error);
      }
      setShowXPGain(true);
    }

    optionScale.value = withSequence(
      withTiming(1.05, { duration: 100 }),
      withSpring(1)
    );
  };

  const nextExercise = () => {
    if (currentQuestionIndex >= exercises.length) {
      // No more exercises, show session summary
      const timeSpent = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000);
      setSessionStats(prev => ({ ...prev, timeSpent }));
      setShowSessionSummary(true);
      return;
    }
    
    const newExercise = exercises[currentQuestionIndex];
    setCurrentExercise(newExercise);
    setCurrentQuestionIndex(prev => prev + 1);
    
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const restartSession = () => {
    setCurrentQuestionIndex(1);
    setCurrentExercise(exercises[0]);
    setSessionStats({
      totalQuestions: 0,
      correctAnswers: 0,
      totalXP: 0,
      timeSpent: 0
    });
    setSessionStartTime(new Date());
    setShowSessionSummary(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (!currentExercise || exercises.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Aucun exercice disponible</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (showSessionSummary) {
    const accuracy = sessionStats.totalQuestions > 0 
      ? Math.round((sessionStats.correctAnswers / sessionStats.totalQuestions) * 100) 
      : 0;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>🎉 Session terminée !</Text>
            
            <View style={styles.summaryStats}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Questions répondues</Text>
                <Text style={styles.statValue}>{sessionStats.totalQuestions}</Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Bonnes réponses</Text>
                <Text style={[styles.statValue, { color: '#10b981' }]}>
                  {sessionStats.correctAnswers}
                </Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Précision</Text>
                <Text style={[
                  styles.statValue,
                  { color: accuracy >= 70 ? '#10b981' : accuracy >= 50 ? '#f59e0b' : '#ef4444' }
                ]}>
                  {accuracy}%
                </Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>XP gagnés</Text>
                <Text style={[styles.statValue, { color: '#e11d48' }]}>
                  +{sessionStats.totalXP}
                </Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Temps passé</Text>
                <Text style={styles.statValue}>
                  {formatTime(sessionStats.timeSpent)}
                </Text>
              </View>
            </View>
            
            <View style={styles.summaryActions}>
              <Button
                title="Recommencer"
                onPress={restartSession}
                style={styles.summaryButton}
              />
              <Button
                title="Retour au menu"
                onPress={() => router.back()}
                variant="outline"
                style={styles.summaryButton}
              />
            </View>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.exerciseContainer}>
        <View style={styles.exerciseHeader}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseCategory}>Quiz aléatoire</Text>
          </View>
          <View style={styles.questionCounter}>
            <Text style={styles.questionCounterText}>
              {currentQuestionIndex} / {exercises.length}
            </Text>
          </View>
        </View>

        <Card style={styles.questionCard}>
          <Text style={styles.question}>{currentExercise.question}</Text>
          
          <View style={styles.optionsContainer}>
            {currentExercise.options.map((option: string, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => submitAnswer(index)}
                disabled={showResult}
                activeOpacity={0.8}
              >
                <Animated.View style={[
                  styles.option,
                  selectedAnswer === index && styles.selectedOption,
                  showResult && index === currentExercise.correct_answer && styles.correctOption,
                  showResult && selectedAnswer === index && index !== currentExercise.correct_answer && styles.wrongOption,
                  selectedAnswer === index && animatedOptionStyle
                ]}>
                  <Text style={[
                    styles.optionText,
                    selectedAnswer === index && styles.selectedOptionText,
                    showResult && index === currentExercise.correct_answer && styles.correctOptionText,
                    showResult && selectedAnswer === index && index !== currentExercise.correct_answer && styles.wrongOptionText
                  ]}>
                    {option}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>

          {showResult && (
            <View style={styles.resultContainer}>
              <View style={[
                styles.resultHeader,
                selectedAnswer === currentExercise.correct_answer ? styles.correctResult : styles.wrongResult
              ]}>
                <CheckCircle 
                  size={20} 
                  color={selectedAnswer === currentExercise.correct_answer ? '#10b981' : '#ef4444'} 
                />
                <Text style={[
                  styles.resultText,
                  selectedAnswer === currentExercise.correct_answer ? styles.correctResultText : styles.wrongResultText
                ]}>
                  {selectedAnswer === currentExercise.correct_answer ? 'Correct !' : 'Incorrect'}
                </Text>
              </View>
              <Text style={styles.explanation}>
                {currentExercise.explanation}
              </Text>
            </View>
          )}
        </Card>

        <View style={styles.actionsContainer}>
          {showResult && (
            <Button
              title={currentQuestionIndex < exercises.length ? "Question suivante" : "Voir le résumé"}
              onPress={nextExercise}
              style={styles.actionButton}
            />
          )}
        </View>
      </View>

      <XPGain
        amount={10}
        visible={showXPGain}
        onAnimationComplete={() => setShowXPGain(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  exerciseContainer: {
    flex: 1,
    padding: 20,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseCategory: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#e11d48',
  },
  questionCounter: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  questionCounterText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#e11d48',
  },
  questionCard: {
    flex: 1,
    padding: 24,
  },
  question: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3f3f46',
    backgroundColor: '#1f1f23',
  },
  selectedOption: {
    borderColor: '#e11d48',
    backgroundColor: '#e11d4820',
  },
  correctOption: {
    borderColor: '#10b981',
    backgroundColor: '#10b98120',
  },
  wrongOption: {
    borderColor: '#ef4444',
    backgroundColor: '#ef444420',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#ffffff',
  },
  correctOptionText: {
    color: '#ffffff',
  },
  wrongOptionText: {
    color: '#ffffff',
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1f1f23',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  correctResult: {},
  wrongResult: {},
  resultText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    marginLeft: 8,
  },
  correctResultText: {
    color: '#10b981',
  },
  wrongResultText: {
    color: '#ef4444',
  },
  explanation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    lineHeight: 20,
  },
  actionsContainer: {
    paddingTop: 20,
  },
  actionButton: {
    width: '100%',
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  summaryContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  summaryCard: {
    padding: 32,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  summaryStats: {
    width: '100%',
    marginBottom: 32,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3f3f46',
  },
  statLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
  },
  summaryActions: {
    width: '100%',
    gap: 12,
  },
  summaryButton: {
    width: '100%',
  },
});