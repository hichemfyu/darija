import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BookOpen, CircleCheck as CheckCircle, Lock, Play } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockLessons } from '@/data/mockData';
import { useUserStore } from '@/stores/userStore';

export default function LessonsScreen() {
  const router = useRouter();
  const { completedLessons } = useUserStore();

  const levels = [
    { key: 'beginner', title: 'Débutant', color: '#10b981' },
    { key: 'intermediate', title: 'Intermédiaire', color: '#f59e0b' },
    { key: 'advanced', title: 'Avancé', color: '#e11d48' }
  ];

  const getLessonsByLevel = (level: string) => {
    return mockLessons.filter(lesson => lesson.level === level);
  };

  const isLessonUnlocked = (lessonId: string, index: number) => {
    if (index === 0) return true;
    const previousLessons = mockLessons.slice(0, mockLessons.findIndex(l => l.id === lessonId));
    return previousLessons.every(lesson => completedLessons.includes(lesson.id));
  };

  const handleLessonPress = (lesson: any, index: number) => {
    if (!isLessonUnlocked(lesson.id, index)) return;
    
    // Navigate to lesson detail (we'll implement this as a modal or new screen)
    router.push(`/lesson/${lesson.id}` as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cours de Darija</Text>
        <Text style={styles.subtitle}>Choisis ton niveau et commence à apprendre</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {levels.map((level) => {
          const levelLessons = getLessonsByLevel(level.key);
          const completedCount = levelLessons.filter(lesson => 
            completedLessons.includes(lesson.id)
          ).length;
          const progress = levelLessons.length > 0 ? completedCount / levelLessons.length : 0;

          return (
            <View key={level.key} style={styles.levelSection}>
              <View style={styles.levelHeader}>
                <View style={styles.levelTitleContainer}>
                  <View style={[styles.levelIndicator, { backgroundColor: level.color }]} />
                  <Text style={styles.levelTitle}>{level.title}</Text>
                </View>
                <Text style={styles.levelProgress}>
                  {completedCount}/{levelLessons.length}
                </Text>
              </View>
              
              <ProgressBar progress={progress} progressColor={level.color} />
              
              <View style={styles.lessonsGrid}>
                {levelLessons.map((lesson, index) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isUnlocked = isLessonUnlocked(lesson.id, index);
                  
                  return (
                    <TouchableOpacity
                      key={lesson.id}
                      onPress={() => handleLessonPress(lesson, index)}
                      disabled={!isUnlocked}
                      activeOpacity={0.8}
                    >
                      <Card style={[
                        styles.lessonCard,
                        !isUnlocked && styles.lockedCard
                      ]}>
                        <View style={styles.lessonHeader}>
                          <View style={styles.lessonIconContainer}>
                            {isCompleted ? (
                              <CheckCircle size={24} color="#10b981" />
                            ) : isUnlocked ? (
                              <BookOpen size={24} color="#e11d48" />
                            ) : (
                              <Lock size={24} color="#71717a" />
                            )}
                          </View>
                          <Text style={styles.lessonXP}>+{lesson.xpReward} XP</Text>
                        </View>
                        
                        <Text style={[
                          styles.lessonTitle,
                          !isUnlocked && styles.lockedText
                        ]}>
                          {lesson.title}
                        </Text>
                        
                        <Text style={[
                          styles.lessonDescription,
                          !isUnlocked && styles.lockedText
                        ]}>
                          {lesson.description}
                        </Text>
                        
                        <View style={styles.lessonFooter}>
                          <Text style={styles.vocabularyCount}>
                            {lesson.vocabulary.length} mots
                          </Text>
                          <Text style={styles.exerciseCount}>
                            {lesson.exercises.length} exercices
                          </Text>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
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
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  levelSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  levelTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
  },
  levelProgress: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#a1a1aa',
  },
  lessonsGrid: {
    gap: 12,
    marginTop: 16,
  },
  lessonCard: {
    padding: 16,
  },
  lockedCard: {
    opacity: 0.6,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lessonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3f3f46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonXP: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#10b981',
  },
  lessonTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginBottom: 12,
    lineHeight: 20,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vocabularyCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#71717a',
  },
  exerciseCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#71717a',
  },
  lockedText: {
    color: '#52525b',
  },
});