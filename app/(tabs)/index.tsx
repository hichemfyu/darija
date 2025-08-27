import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Target, BookOpen, Trophy, Play, ChevronDown } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useUserStore } from '@/stores/userStore';
import { getResumeDestination } from '@/lib/resumeLogic';
import { calcLevel, getXPForLevel, getProgressToNextLevel } from '@/lib/userLevel';

const { height: screenHeight } = Dimensions.get('window');
const AUTO_CONTINUE_ON_LAUNCH = true;

export default function HomeScreen() {
  const router = useRouter();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const { profile, userStats, loadUserData } = useUserStore();
  const [loading, setLoading] = React.useState(false);

  // Simuler un utilisateur pour les tests
  const mockUserId = 'mock-user-id';

  React.useEffect(() => {
    loadUserData(mockUserId);
    if (AUTO_CONTINUE_ON_LAUNCH) {
      handleAutoResume();
    }
  }, []);

  const handleAutoResume = async () => {
    try {
      setLoading(true);
      const destination = await getResumeDestination(mockUserId);
      if (destination) {
        router.push(destination.route as any);
      } else {
        router.push('/exercises');
      }
    } catch (error) {
      console.error('Error in auto resume:', error);
      router.push('/exercises');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueLesson = async () => {
    try {
      const destination = await getResumeDestination(mockUserId);
      if (destination) {
        router.push(destination.route as any);
      } else {
        router.push('/lesson');
      }
    } catch (error) {
      router.push('/lesson');
    }
  };

  const handleQuickExercise = () => {
    router.push('/exercises');
  };

  const scrollToProgression = () => {
    scrollViewRef.current?.scrollTo({
      y: screenHeight * 0.8,
      animated: true
    });
  };

  // Simple level calculation
  const currentXP = userStats?.xp_total || profile.xp;
  const currentLevel = userStats?.level || calcLevel(currentXP);
  const xpForCurrentLevel = getXPForLevel(currentLevel);
  const xpForNextLevel = getXPForLevel(currentLevel + 1);
  const progressToNextLevel = getProgressToNextLevel(currentXP, currentLevel);

  const challenges = [
    {
      id: 1,
      title: 'Complète 3 exercices',
      description: 'Gagne 30 XP supplémentaires',
      progress: 1,
      max: 3,
      xp: 30,
      icon: Target
    },
    {
      id: 2,
      title: 'Complète 1 leçon',
      description: 'Gagne 50 XP supplémentaires',
      progress: 0,
      max: 1,
      xp: 50,
      icon: BookOpen
    },
    {
      id: 3,
      title: 'Apprends 10 nouveaux mots',
      description: 'Explore le dictionnaire',
      progress: 5,
      max: 10,
      xp: 25,
      icon: BookOpen
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Ahlan! 👋</Text>
          <Text style={styles.subtitle}>Prêt à apprendre le darija ?</Text>
        </View>

        {/* Main Action Buttons */}
        <View style={styles.mainActions}>
          {/* Premium Continue Button */}
          <TouchableOpacity
            onPress={handleContinueLesson}
            activeOpacity={0.8}
            style={styles.continueButton}
          >
            <View style={styles.continueButtonContent}>
              <Play size={24} color="#10b981" />
              <Text style={styles.continueButtonText}>Continuez la leçon</Text>
            </View>
          </TouchableOpacity>

          {/* Quick Exercise Button */}
          <TouchableOpacity
            onPress={handleQuickExercise}
            activeOpacity={0.8}
            style={styles.quickExerciseButton}
          >
            <Text style={styles.quickExerciseText}>Exercice rapide</Text>
          </TouchableOpacity>
        </View>

        {/* Progression Scroll Hint */}
        <TouchableOpacity
          onPress={scrollToProgression}
          style={styles.scrollHint}
          activeOpacity={0.7}
        >
          <Text style={styles.scrollHintText}>progression</Text>
          <ChevronDown size={16} color="#71717a" />
        </TouchableOpacity>

        {/* Spacer for scroll */}
        <View style={styles.spacer} />

        {/* Progression & Défis Section */}
        <View style={styles.progressionSection}>
          <Text style={styles.sectionTitle}>Progression & Défis du jour</Text>
          
          {/* Level Progress */}
          <Card style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <View style={styles.levelInfo}>
                <Text style={styles.levelTitle}>Niveau {currentLevel}</Text>
                <Text style={styles.levelXP}>{currentXP} XP</Text>
              </View>
              <View style={styles.levelBadge}>
                <Trophy size={16} color="#f59e0b" />
              </View>
            </View>
            <ProgressBar 
              progress={Math.min(1, Math.max(0, progressToNextLevel))} 
              progressColor="#10b981" 
            />
            <Text style={styles.levelProgressText}>
              {Math.max(0, xpForNextLevel - currentXP)} XP pour le niveau {currentLevel + 1}
            </Text>
          </Card>

          {/* Daily Challenges */}
          <View style={styles.challengesContainer}>
            {challenges.map((challenge) => (
              <Card key={challenge.id} style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                  <View style={[styles.challengeIcon, { backgroundColor: '#8b5cf620' }]}>
                    <challenge.icon size={18} color="#8b5cf6" />
                  </View>
                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <Text style={styles.challengeDescription}>{challenge.description}</Text>
                  </View>
                  <View style={styles.xpBadge}>
                    <Text style={styles.challengeXP}>+{challenge.xp}</Text>
                  </View>
                </View>
                <View style={styles.challengeProgress}>
                  <ProgressBar 
                    progress={challenge.progress / challenge.max} 
                    height={6}
                    progressColor="#8b5cf6"
                  />
                  <Text style={styles.challengeProgressText}>
                    {challenge.progress}/{challenge.max}
                  </Text>
                </View>
              </Card>
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
  header: {
    padding: 32,
    paddingBottom: 24,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    textAlign: 'center',
  },
  mainActions: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 40,
  },
  continueButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#10b981',
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 32,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  continueButtonText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#10b981',
  },
  quickExerciseButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10b981',
    backgroundColor: 'transparent',
  },
  quickExerciseText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#10b981',
    textAlign: 'center',
  },
  scrollHint: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 40,
  },
  scrollHintText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#71717a',
    marginBottom: 4,
  },
  spacer: {
    height: screenHeight * 0.3,
  },
  progressionSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  levelCard: {
    padding: 24,
    marginBottom: 24,
    backgroundColor: '#1a1a1a',
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
  },
  levelXP: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#10b981',
    marginTop: 2,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f59e0b20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f59e0b40',
  },
  levelProgressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 12,
    textAlign: 'center',
  },
  challengesContainer: {
    gap: 12,
  },
  challengeCard: {
    padding: 18,
    backgroundColor: '#1a1a1a',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#ffffff',
  },
  challengeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 2,
  },
  xpBadge: {
    backgroundColor: '#10b98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  challengeXP: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#10b981',
  },
  challengeProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  challengeProgressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#a1a1aa',
    minWidth: 30,
  },
});