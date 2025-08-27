import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';

export default function CategoryLevelsScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();

  const levels = [
    {
      id: 'beginner',
      title: 'Débutant',
      color: '#10b981',
    },
    {
      id: 'intermediate',
      title: 'Intermédiaire',
      color: '#f59e0b',
    },
    {
      id: 'advanced',
      title: 'Avancé',
      color: '#ef4444',
    }
  ];

  const handleLevelPress = (levelId: string) => {
    router.push(`/exercise/quiz/${category}/${levelId}` as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.categoryTitle}>Choisis ton niveau</Text>
        </View>
      </View>

      {/* Levels */}
      <View style={styles.levelsContainer}>
        {levels.map((level) => (
          <TouchableOpacity
            key={level.id}
            onPress={() => handleLevelPress(level.id)}
            activeOpacity={0.8}
            style={styles.levelButton}
          >
            <Card style={[
              styles.levelCard,
              { backgroundColor: level.color }
            ]}>
              <Text style={[
                styles.levelTitle,
              ]}>
                {level.title}
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
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
  categoryTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
  },
  levelsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  levelButton: {
    width: '100%',
  },
  levelCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
});