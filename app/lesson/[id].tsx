import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Volume2, Play, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { playSound } from '@/services/audioService';
import { XPGain } from '@/components/ui/XPGain';
import { mockLessons } from '@/data/mockData';
import { useUserStore } from '@/stores/userStore';

export default function LessonDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addXP, completeLesson, completedLessons } = useUserStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showXPGain, setShowXPGain] = useState(false);
  
  const lesson = mockLessons.find(l => l.id === id);
  
  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Leçon introuvable</Text>
          <Button title="Retour" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = completedLessons.includes(lesson.id);
  const totalSteps = lesson.vocabulary.length;
  const progress = (currentStep + 1) / totalSteps;

  const completeCurrentLesson = () => {
    if (!isCompleted) {
      addXP(lesson.xpReward);
      completeLesson(lesson.id);
      setShowXPGain(true);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeCurrentLesson();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentWord = lesson.vocabulary[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.progressText}>
            {currentStep + 1} / {totalSteps}
          </Text>
        </View>
        
        {isCompleted && (
          <CheckCircle size={24} color="#10b981" />
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vocabulary Card */}
        <Card style={styles.vocabularyCard}>
          <View style={styles.wordContainer}>
            <View style={styles.wordHeader}>
              <Text style={styles.wordDarija}>{currentWord.darija}</Text>
              <TouchableOpacity 
                style={styles.audioButton}
                onPress={() => currentWord.audio && playSound(currentWord.audio)}
                disabled={!currentWord.audio}
              >
                <Volume2 size={20} color="#e11d48" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.wordPhonetic}>[{currentWord.phonetic}]</Text>
            <Text style={styles.wordFrench}>{currentWord.fr}</Text>
          </View>
        </Card>

        {/* Lesson Description */}
        <Card style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>À propos de cette leçon</Text>
          <Text style={styles.descriptionText}>{lesson.description}</Text>
          
          <View style={styles.lessonStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{lesson.vocabulary.length}</Text>
              <Text style={styles.statLabel}>Mots</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{lesson.exercises.length}</Text>
              <Text style={styles.statLabel}>Exercices</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>+{lesson.xpReward}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
          </View>
        </Card>

        {/* All Vocabulary Preview */}
        <Card style={styles.vocabularyListCard}>
          <Text style={styles.vocabularyListTitle}>Vocabulaire de la leçon</Text>
          {lesson.vocabulary.map((word, index) => (
            <View key={index} style={[
              styles.vocabularyItem,
              index === currentStep && styles.currentVocabularyItem
            ]}>
              <View style={styles.vocabularyItemContent}>
                <Text style={[
                  styles.vocabularyItemDarija,
                  index === currentStep && styles.currentVocabularyText
                ]}>
                  {word.darija}
                </Text>
                <Text style={[
                  styles.vocabularyItemFrench,
                  index === currentStep && styles.currentVocabularyText
                ]}>
                  {word.fr}
                </Text>
              </View>
              {index === currentStep && (
                <Play size={16} color="#e11d48" />
              )}
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <View style={styles.navigationButtons}>
          <Button
            title="Précédent"
            onPress={prevStep}
            variant="outline"
            disabled={currentStep === 0}
            style={styles.navButton}
          />
          
          <Button
            title={currentStep === totalSteps - 1 ? 'Terminer' : 'Suivant'}
            onPress={nextStep}
            style={styles.navButton}
          />
        </View>
        
        {currentStep === totalSteps - 1 && !isCompleted && (
          <Button
            title="Commencer les exercices"
            onPress={() => router.push('/exercises')}
            variant="secondary"
            style={styles.exerciseButton}
          />
        )}
      </View>

      <XPGain
        amount={lesson.xpReward}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 2,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  vocabularyCard: {
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  wordContainer: {
    alignItems: 'center',
    width: '100%',
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wordDarija: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
    marginRight: 16,
  },
  audioButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#3f3f46',
  },
  wordPhonetic: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#e11d48',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  wordFrench: {
    fontSize: 20,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#a1a1aa',
  },
  descriptionCard: {
    padding: 20,
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    lineHeight: 24,
    marginBottom: 16,
  },
  lessonStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#3f3f46',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 2,
  },
  vocabularyListCard: {
    padding: 20,
    marginBottom: 16,
  },
  vocabularyListTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  vocabularyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  currentVocabularyItem: {
    backgroundColor: '#e11d4820',
  },
  vocabularyItemContent: {
    flex: 1,
  },
  vocabularyItemDarija: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#ffffff',
  },
  vocabularyItemFrench: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 2,
  },
  currentVocabularyText: {
    color: '#e11d48',
  },
  navigation: {
    padding: 20,
    paddingBottom: 10,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  navButton: {
    flex: 1,
  },
  exerciseButton: {
    width: '100%',
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
    marginBottom: 20,
  },
});