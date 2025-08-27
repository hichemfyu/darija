export interface Lesson {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  description: string;
  vocabulary: VocabularyItem[];
  exercises: string[];
  xpReward: number;
  completed?: boolean;
}

export interface VocabularyItem {
  darija: string;
  phonetic: string;
  fr: string; // French translation
  audio?: string;
  audio?: string;
}

export interface Exercise {
  id: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  xpReward: number;
}

export interface DictionaryWord {
  id: string;
  word: string;
  darija: string;
  fr: string;
  phonetic: string; // Phonetic transcription
  audio?: string; // Optional audio URL
  audio?: string; // Optional audio URL
  category: string;
  isFavorite?: boolean;
}

export interface UserProfile {
  pseudo: string;
  xp: number;
  level: number;
  streak: number;
  accuracy: number;
  totalLessons: number;
  completedLessons: number;
  totalExercises: number;
  completedExercises: number;
  studyTimeMinutes: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  showPhonetic?: boolean;
  showTranslation?: boolean;
  phonetic?: string;
  translation?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

// Nouvelles leçons ajoutées
const newLessons: Lesson[] = [
  {
    id: 'l4',
    level: 'beginner',
    title: 'Les Couleurs',
    description: 'Apprendre les couleurs de base en darija',
    xpReward: 50,
    vocabulary: [
      { darija: 'Ahmar', phonetic: 'ah-mar', fr: 'Rouge', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-28.mp3' },
      { darija: 'Azraq', phonetic: 'az-raq', fr: 'Bleu', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-29.mp3' },
      { darija: 'Akhdar', phonetic: 'akh-dar', fr: 'Vert', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-30.mp3' },
      { darija: 'Asfar', phonetic: 'as-far', fr: 'Jaune', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-31.mp3' },
      { darija: 'Abyad', phonetic: 'ab-yad', fr: 'Blanc', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-32.mp3' }
    ],
    exercises: []
  },
  {
    id: 'l5',
    level: 'beginner',
    title: 'Les Vêtements',
    description: 'Vocabulaire des vêtements essentiels',
    xpReward: 50,
    vocabulary: [
      { darija: 'Qamis', phonetic: 'qa-mis', fr: 'Chemise', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-33.mp3' },
      { darija: 'Sarwal', phonetic: 'sar-wal', fr: 'Pantalon', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-34.mp3' },
      { darija: 'Sabbat', phonetic: 'sab-bat', fr: 'Chaussures', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-35.mp3' },
      { darija: 'Tarbouche', phonetic: 'tar-bou-che', fr: 'Chapeau', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-36.mp3' },
      { darija: 'Jellaba', phonetic: 'jel-la-ba', fr: 'Djellaba', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-37.mp3' }
    ],
    exercises: []
  },
  {
    id: 'l6',
    level: 'intermediate',
    title: 'Au Marché',
    description: 'Phrases utiles pour faire ses courses',
    xpReward: 75,
    vocabulary: [
      { darija: 'Souk', phonetic: 'souk', fr: 'Marché', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-38.mp3' },
      { darija: 'B kam?', phonetic: 'b kam?', fr: 'Combien ?', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-39.mp3' },
      { darija: 'Ghali bzef', phonetic: 'gha-li bzef', fr: 'Très cher', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-40.mp3' },
      { darija: 'Rkhis', phonetic: 'r-khis', fr: 'Pas cher', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-41.mp3' },
      { darija: 'Bghit nshri', phonetic: 'bghit n-shri', fr: 'Je veux acheter', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-42.mp3' }
    ],
    exercises: []
  },
  {
    id: 'l7',
    level: 'intermediate',
    title: 'Le Temps et la Météo',
    description: 'Parler du temps qu\'il fait',
    xpReward: 75,
    vocabulary: [
      { darija: 'Jaw', phonetic: 'jaw', fr: 'Temps (météo)', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-43.mp3' },
      { darija: 'Skhoun', phonetic: 'skh-oun', fr: 'Chaud', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-44.mp3' },
      { darija: 'Bared', phonetic: 'ba-red', fr: 'Froid', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-45.mp3' },
      { darija: 'Rih', phonetic: 'rih', fr: 'Vent', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-46.mp3' },
      { darija: 'Liouma jaw zwin', phonetic: 'li-ou-ma jaw zwin', fr: 'Aujourd\'hui il fait beau', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-47.mp3' }
    ],
    exercises: []
  }
];

// Mock Data
export const mockLessons: Lesson[] = [
  {
    id: 'l1',
    level: 'beginner',
    title: 'Salutations',
    description: 'Apprendre les bases pour dire bonjour et se présenter',
    xpReward: 50,
    vocabulary: [
      { darija: 'Salam', phonetic: 'sa-lam', fr: 'Salut / Bonjour', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { darija: 'Sbah lkhir', phonetic: 'sbah l-khir', fr: 'Bonjour (matin)', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { darija: 'Msa lkhir', phonetic: 'msa l-khir', fr: 'Bonsoir', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
      { darija: 'Lila sa3ida', phonetic: 'li-la sa-3i-da', fr: 'Bonne nuit', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
      { darija: 'Smiti...', phonetic: 'smi-ti', fr: 'Je m\'appelle...', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' }
    ],
    exercises: ['ex1', 'ex2', 'ex3']
  },
  {
    id: 'l2',
    level: 'beginner',
    title: 'La Famille et les Nombres',
    description: 'Vocabulaire essentiel sur la famille',
    xpReward: 50,
    vocabulary: [
      { darija: 'Walidin', phonetic: 'wa-li-din', fr: 'Parents', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
      { darija: 'Baba', phonetic: 'ba-ba', fr: 'Papa', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { darija: 'Mama', phonetic: 'ma-ma', fr: 'Maman', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
      { darija: 'Wahad', phonetic: 'wa-had', fr: 'Un', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
      { darija: 'Jouj', phonetic: 'jouj', fr: 'Deux', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' }
    ],
  exercises: []
  },
  {
    id: 'l3',
    level: 'beginner',
    title: 'Nourriture de Base',
    description: 'Mots essentiels pour parler de nourriture',
    xpReward: 50,
    vocabulary: [ // Added audio URLs for mock purposes
      { darija: 'Khobz', phonetic: 'khobz', fr: 'Pain', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
      { darija: 'Ma', phonetic: 'ma', fr: 'Eau', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
      { darija: 'Atay', phonetic: 'a-tay', fr: 'Thé', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
      { darija: 'Laham', phonetic: 'la-ham', fr: 'Viande', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
      { darija: 'Khodar', phonetic: 'kho-dar', fr: 'Légumes', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' }
    ],
  exercises: []
  },
  ...newLessons
];

export const mockExercises: Exercise[] = [
  {
    id: 'ex1',
    category: 'salutations',
    level: 'beginner',
    question: 'Comment dit-on "Bonjour" en darija ?',
    options: ['Salam', 'Bslama', 'Shokran', 'Afak'],
    correct: 0,
    explanation: 'Salam signifie bonjour en darija.',
    xpReward: 10
  },
  {
    id: 'ex2',
    category: 'salutations',
    level: 'beginner',
    question: 'Que signifie "Shokran" ?',
    options: ['Bonjour', 'Au revoir', 'Merci', 'S\'il te plaît'],
    correct: 2,
    explanation: 'Shokran signifie merci.',
    xpReward: 10
  },
  {
    id: 'ex3',
    category: 'famille',
    level: 'beginner',
    question: 'Comment dit-on "Papa" en darija ?',
    options: ['Mama', 'Baba', 'Kho', 'Okhti'],
    correct: 1,
    explanation: 'Baba signifie Papa en darija.',
    xpReward: 10
  },
  {
    id: 'ex4',
    category: 'famille',
    level: 'beginner',
    question: 'Que signifie "Okhti" ?',
    options: ['Mon frère', 'Ma sœur', 'Mes parents', 'Mon père'],
    correct: 1,
    explanation: 'Okhti signifie "Ma sœur".',
    xpReward: 10
  },
  {
    id: 'ex5',
    category: 'nourriture',
    level: 'beginner',
    question: 'Comment dit-on "Pain" en darija ?',
    options: ['Ma', 'Atay', 'Khobz', 'Laham'],
    correct: 2,
    explanation: 'Khobz signifie Pain.',
    xpReward: 10
  },
  {
    id: 'ex6',
    category: 'nourriture',
    level: 'beginner',
    question: 'Que signifie "Atay" ?',
    options: ['Eau', 'Thé', 'Pain', 'Viande'],
    correct: 1,
    explanation: 'Atay signifie Thé, très populaire au Maroc.',
    xpReward: 10
  },
  {
    id: 'ex7',
    category: 'nombres',
    level: 'beginner',
    question: 'Comment dit-on "Trois" en darija ?',
    options: ['Wahad', 'Jouj', 'Tlata', 'Arba'],
    correct: 2,
    explanation: 'Tlata signifie Trois.',
    xpReward: 10
  },
  {
    id: 'ex8',
    category: 'nombres',
    level: 'intermediate',
    question: 'Comment dit-on "Cinq" en darija ?',
    options: ['Arba', 'Khamsa', 'Stta', 'Sb3a'],
    correct: 1,
    explanation: 'Khamsa signifie Cinq.',
    xpReward: 15
  },
  {
    id: 'ex9',
    category: 'expressions',
    level: 'intermediate',
    question: 'Que signifie "Bghit" ?',
    options: ['Je suis', 'Je veux', 'Je vais', 'Je peux'],
    correct: 1,
    explanation: 'Bghit signifie "Je veux".',
    xpReward: 15
  },
  {
    id: 'ex10',
    category: 'questions',
    level: 'intermediate',
    question: 'Comment dit-on "Où" en darija ?',
    options: ['Fin', 'Ash', 'Imta', 'Kifash'],
    correct: 0,
    explanation: 'Fin signifie "Où".',
    xpReward: 15
  }
];

export const mockDictionary: DictionaryWord[] = [
  { id: 'w1', word: 'Salam', darija: 'Salam', fr: 'Salut / Bonjour', phonetic: 'sa-lam', category: 'salutations', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'w2', word: 'Sbah lkhir', darija: 'Sbah lkhir', fr: 'Bonjour (matin)', phonetic: 'sbah l-khir', category: 'salutations', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'w3', word: 'Msa lkhir', darija: 'Msa lkhir', fr: 'Bonsoir', phonetic: 'msa l-khir', category: 'salutations', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'w4', word: 'Shokran', darija: 'Shokran', fr: 'Merci', phonetic: 'shok-ran', category: 'politesse', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3' },
  { id: 'w5', word: 'Afak', darija: 'Afak', fr: 'S\'il te plaît', phonetic: 'a-fak', category: 'politesse', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3' },
  { id: 'w6', word: 'Baba', darija: 'Baba', fr: 'Papa', phonetic: 'ba-ba', category: 'famille', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: 'w7', word: 'Mama', darija: 'Mama', fr: 'Maman', phonetic: 'ma-ma', category: 'famille', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 'w8', word: 'Kho', darija: 'Kho', fr: 'Frère', phonetic: 'kho', category: 'famille', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3' },
  { id: 'w9', word: 'Okhti', darija: 'Okhti', fr: 'Ma sœur', phonetic: 'okh-ti', category: 'famille', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3' },
  { id: 'w10', word: 'Walidin', darija: 'Walidin', fr: 'Parents', phonetic: 'wa-li-din', category: 'famille', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: 'w11', word: 'Khobz', darija: 'Khobz', fr: 'Pain', phonetic: 'khobz', category: 'nourriture', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
  { id: 'w12', word: 'Ma', darija: 'Ma', fr: 'Eau', phonetic: 'ma', category: 'nourriture', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
  { id: 'w13', word: 'Atay', darija: 'Atay', fr: 'Thé', phonetic: 'a-tay', category: 'nourriture', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
  { id: 'w14', word: 'Laham', darija: 'Laham', fr: 'Viande', phonetic: 'la-ham', category: 'nourriture', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
  { id: 'w15', word: 'Khodar', darija: 'Khodar', fr: 'Légumes', phonetic: 'kho-dar', category: 'nourriture', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' },
  { id: 'w16', word: 'Shta', darija: 'Shta', fr: 'Pluie', phonetic: 'sh-ta', category: 'météo', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3' },
  { id: 'w17', word: 'Shems', darija: 'Shems', fr: 'Soleil', phonetic: 'shems', category: 'météo', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3' },
  { id: 'w18', word: 'Baraka', darija: 'Baraka', fr: 'Assez / Stop', phonetic: 'ba-ra-ka', category: 'expressions', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-22.mp3' },
  { id: 'w19', word: 'Bghit', darija: 'Bghit', fr: 'Je veux', phonetic: 'bghit', category: 'expressions', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-23.mp3' },
  { id: 'w20', word: 'Fin', darija: 'Fin', fr: 'Où', phonetic: 'fin', category: 'questions', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-24.mp3' },
  { id: 'w21', word: 'Wahad', darija: 'Wahad', fr: 'Un', phonetic: 'wa-had', category: 'nombres', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: 'w22', word: 'Jouj', darija: 'Jouj', fr: 'Deux', phonetic: 'jouj', category: 'nombres', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  { id: 'w23', word: 'Tlata', darija: 'Tlata', fr: 'Trois', phonetic: 'tla-ta', category: 'nombres', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-25.mp3' },
  { id: 'w24', word: 'Arba', darija: 'Arba', fr: 'Quatre', phonetic: 'ar-ba', category: 'nombres', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-26.mp3' },
  { id: 'w25', word: 'Khamsa', darija: 'Khamsa', fr: 'Cinq', phonetic: 'kham-sa', category: 'nombres', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-27.mp3' }
];

export const mockUserProfile: UserProfile = {
  pseudo: 'Invité',
  xp: 180,
  level: 3,
  streak: 7,
  accuracy: 85,
  totalLessons: 3,
  completedLessons: 1,
  totalExercises: 10,
  completedExercises: 6,
  studyTimeMinutes: 145
};

export const mockAchievements: Achievement[] = [
  {
    id: 'a1',
    title: 'Premier Pas',
    description: 'Complète ta première leçon',
    icon: 'award',
    unlocked: true
  },
  {
    id: 'a2',
    title: 'Série de 7',
    description: 'Maintiens une série de 7 jours',
    icon: 'flame',
    unlocked: true
  },
  {
    id: 'a3',
    title: 'Expert QCM',
    description: 'Réussis 10 exercices consécutifs',
    icon: 'target',
    unlocked: false,
    progress: 6,
    maxProgress: 10
  },
  {
    id: 'a4',
    title: 'Vocabulaire',
    description: 'Apprends 50 mots',
    icon: 'book',
    unlocked: false,
    progress: 23,
    maxProgress: 50
  }
];

export const mockQuickPrompts = [
  'Commander au café',
  'Prendre un taxi',
  'Demander son chemin',
  'Faire les courses',
  'Parler de la météo'
];