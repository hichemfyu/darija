import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Trophy, Target, CreditCard as Edit, Clock, BookOpen, Award, Settings, Bell, Palette } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useUserStore } from '@/stores/userStore';
import { mockAchievements } from '@/data/mockData';

export default function ProfileScreen() {
  const { profile, achievements } = useUserStore();
  const [isEditingPseudo, setIsEditingPseudo] = useState(false);
  const [newPseudo, setNewPseudo] = useState(profile.pseudo);
  const [themePreference, setThemePreference] = useState('dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const updatePseudo = (newPseudo: string) => {
    useUserStore.setState((state) => ({
      profile: {
        ...state.profile,
        pseudo: newPseudo
      }
    }));
  };

  const handleThemeChange = (theme: string) => {
    setThemePreference(theme);
    Alert.alert('Thème mis à jour', `Le thème ${theme === 'dark' ? 'sombre' : theme === 'light' ? 'clair' : 'système'} a été appliqué.`);
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    Alert.alert(
      'Notifications', 
      enabled ? 'Notifications activées avec succès !' : 'Notifications désactivées.'
    );
  };

  // Calcul simple du niveau
  const currentLevel = Math.floor(profile.xp / 100) + 1;
  const xpForCurrentLevel = (currentLevel - 1) * 100;
  const xpForNextLevel = currentLevel * 100;
  const progressToNextLevel = (profile.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel);
  
  const studyHours = Math.floor(profile.studyTimeMinutes / 60);
  const studyMinutes = profile.studyTimeMinutes % 60;

  const stats = [
    {
      icon: Trophy,
      label: 'Niveau',
      value: currentLevel.toString(),
      color: '#f59e0b'
    },
    {
      icon: Target,
      label: 'Précision',
      value: `${profile.accuracy}%`,
      color: '#10b981'
    },
    {
      icon: Trophy,
      label: 'Série',
      value: `${profile.streak} jours`,
      color: '#e11d48'
    },
    {
      icon: Clock,
      label: 'Temps d\'étude',
      value: `${studyHours}h ${studyMinutes}m`,
      color: '#3b82f6'
    },
    {
      icon: BookOpen,
      label: 'Leçons',
      value: `${profile.completedLessons}/${profile.totalLessons}`,
      color: '#8b5cf6'
    },
    {
      icon: Target,
      label: 'Exercices',
      value: `${profile.completedExercises}/${profile.totalExercises}`,
      color: '#06b6d4'
    }
  ];

  const themeOptions = [
    { key: 'dark', title: 'Sombre', description: 'Thème sombre' },
    { key: 'light', title: 'Clair', description: 'Thème clair' },
    { key: 'system', title: 'Système', description: 'Suit l\'appareil' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <User size={32} color="#ffffff" />
            </View>
            <View style={styles.profileInfo}>
              {isEditingPseudo ? (
                <TextInput
                  style={styles.profileNameInput}
                  value={newPseudo}
                  onChangeText={setNewPseudo}
                  onBlur={() => {
                    updatePseudo(newPseudo);
                    setIsEditingPseudo(false);
                  }}
                  autoFocus
                />
              ) : (
                <TouchableOpacity 
                  onPress={() => setIsEditingPseudo(true)}
                  style={styles.pseudoDisplay}
                >
                  <Text style={styles.profileName}>{profile.pseudo}</Text>
                  <Edit size={18} color="#a1a1aa" style={styles.editIcon} />
                </TouchableOpacity>
              )}
              <Text style={styles.profileLevel}>Niveau {currentLevel}</Text>
            </View>
          </View>
        </View>

        {/* XP Progress */}
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progression vers le niveau {currentLevel + 1}</Text>
            <Text style={styles.progressXP}>{profile.xp} XP</Text>
          </View>
          <ProgressBar progress={Math.min(1, Math.max(0, progressToNextLevel))} />
          <Text style={styles.progressText}>
            {Math.max(0, xpForNextLevel - profile.xp)} XP restants
          </Text>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <stat.icon size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={24} color="#e11d48" />
            <Text style={styles.sectionTitle}>Paramètres</Text>
          </View>
          
          {/* Theme Settings */}
          <Card style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Palette size={20} color="#8b5cf6" />
              <Text style={styles.settingTitle}>Thème</Text>
            </View>
            <View style={styles.themeOptions}>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => handleThemeChange(option.key)}
                  style={[
                    styles.themeOption,
                    themePreference === option.key && styles.selectedThemeOption
                  ]}
                >
                  <Text style={[
                    styles.themeOptionText,
                    themePreference === option.key && styles.selectedThemeOptionText
                  ]}>
                    {option.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Notifications Settings */}
          <Card style={styles.settingCard}>
            <View style={styles.settingContent}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <Bell size={20} color="#10b981" />
                  <Text style={styles.settingTitle}>Notifications</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Recevoir des rappels d'étude et des encouragements
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{ false: '#3f3f46', true: '#10b98180' }}
                thumbColor={notificationsEnabled ? '#10b981' : '#71717a'}
              />
            </View>
          </Card>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={24} color="#e11d48" />
            <Text style={styles.sectionTitle}>Succès</Text>
          </View>
          
          {(achievements || mockAchievements).map((achievement) => (
            <Card key={achievement.id} style={styles.achievementCard}>
              <View style={styles.achievementContent}>
                <View style={[
                  styles.achievementIcon,
                  achievement.unlocked ? styles.unlockedIcon : styles.lockedIcon
                ]}>
                  <Trophy 
                    size={20} 
                    color={achievement.unlocked ? '#f59e0b' : '#71717a'} 
                  />
                </View>
                
                <View style={styles.achievementInfo}>
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.lockedText
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    !achievement.unlocked && styles.lockedText
                  ]}>
                    {achievement.description}
                  </Text>
                  
                  {achievement.progress !== undefined && achievement.maxProgress && (
                    <View style={styles.achievementProgress}>
                      <ProgressBar 
                        progress={achievement.progress / achievement.maxProgress}
                        height={4}
                      />
                      <Text style={styles.achievementProgressText}>
                        {achievement.progress}/{achievement.maxProgress}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
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
    padding: 20,
    paddingBottom: 10,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e11d48',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
  },
  profileNameInput: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e11d48',
    paddingVertical: 0,
    marginBottom: 2,
  },
  profileLevel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 2,
  },
  pseudoDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    marginLeft: 8,
  },
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#ffffff',
    flex: 1,
  },
  progressXP: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#e11d48',
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 8,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    padding: 16,
  },
  statContent: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 12,
  },
  settingCard: {
    marginBottom: 12,
    padding: 16,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 4,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  themeOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#27272a',
    alignItems: 'center',
  },
  selectedThemeOption: {
    backgroundColor: '#8b5cf6',
  },
  themeOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#a1a1aa',
  },
  selectedThemeOptionText: {
    color: '#ffffff',
  },
  achievementCard: {
    marginBottom: 12,
    padding: 16,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  unlockedIcon: {
    backgroundColor: '#f59e0b20',
  },
  lockedIcon: {
    backgroundColor: '#3f3f46',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 2,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  achievementProgressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#a1a1aa',
    minWidth: 30,
  },
  lockedText: {
    color: '#52525b',
  },
});