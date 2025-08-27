import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { Layout } from 'react-native-reanimated';
import { Send, Bot, User } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { mockQuickPrompts, ChatMessage } from '@/data/mockData';

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Ahlan! Ana hna bash n3awnek tf3el darija. Ash bghiti tgoul?',
      isUser: false,
      timestamp: new Date(),
      phonetic: 'ah-lan! a-na h-na bash n-3aw-nek t-f3el da-ri-ja. ash bgh-i-ti t-goul?',
      translation: 'Salut ! Je suis là pour t\'aider à pratiquer le darija. Que veux-tu dire ?'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [showPhonetic, setShowPhonetic] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState<'ami' | 'prof' | 'souk'>('ami');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);

  const personas = [
    { key: 'ami' as const, title: 'Ami', description: 'Décontracté' },
    { key: 'prof' as const, title: 'Prof', description: 'Éducatif' },
    { key: 'souk' as const, title: 'Souk', description: 'Commerce' }
  ];

  const mockResponses = {
    ami: [
      {
        text: 'Ah wa3er! Kifash dayr?',
        phonetic: 'ah wa-3er! ki-fash da-yr?',
        translation: 'Ah super ! Comment ça va ?'
      },
      {
        text: 'Mezyan! Wach bghiti dir liouma?',
        phonetic: 'mez-yan! wach bgh-i-ti dir li-ou-ma?',
        translation: 'Bien ! Qu\'est-ce que tu veux faire aujourd\'hui ?'
      }
    ],
    prof: [
      {
        text: 'Mezyan bzef! Had lkelma kayna f darija klasikia.',
        phonetic: 'mez-yan bzef! had l-kel-ma kay-na f da-ri-ja kla-si-kia.',
        translation: 'Très bien ! Ce mot existe dans le darija classique.'
      },
      {
        text: 'Hsent! Waqila tqeder tgoul had joumla kamla b darija?',
        phonetic: 'h-sent! wa-qi-la t-qe-der t-goul had joum-la kam-la b da-ri-ja?',
        translation: 'Excellent ! Peux-tu dire cette phrase complète en darija ?'
      }
    ],
    souk: [
      {
        text: 'Marhba bik! Ash bghiti tshri?',
        phonetic: 'mar-h-ba bik! ash bgh-i-ti t-shri?',
        translation: 'Bienvenue ! Qu\'est-ce que tu veux acheter ?'
      },
      {
        text: 'Had tomobile zwin bzef! B kam?',
        phonetic: 'had to-mo-bi-le zwin bzef! b kam?',
        translation: 'Cette voiture est très belle ! Combien ?'
      }
    ]
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responses = mockResponses[selectedPersona];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse.text,
        isUser: false,
        timestamp: new Date(),
        phonetic: randomResponse.phonetic,
        translation: randomResponse.translation,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const sendQuickPrompt = (prompt: string) => {
    const mockPromptResponses: Record<string, any> = {
      'Commander au café': {
        text: 'Bghit wahad qahwa, afak.',
        phonetic: 'bghit wa-had qah-wa, a-fak.',
        translation: 'Je voudrais un café, s\'il te plaît.'
      },
      'Prendre un taxi': {
        text: 'Taxi! Bghit nmshi l medina, afak.',
        phonetic: 'ta-xi! bghit nm-shi l me-di-na, a-fak.',
        translation: 'Taxi ! Je veux aller à la médina, s\'il te plaît.'
      },
      'Demander son chemin': {
        text: 'Smahli, fin kayn l post?',
        phonetic: 'smah-li, fin ka-yn l post?',
        translation: 'Excuse-moi, où est la poste ?'
      },
      'Faire les courses': {
        text: 'Salam, bghit tomatoes w khizzo, afak.',
        phonetic: 'sa-lam, bghit to-ma-toes w khiz-zo, a-fak.',
        translation: 'Bonjour, je veux des tomates et des carottes, s\'il te plaît.'
      },
      'Parler de la météo': {
        text: 'Liouma jaw zwin bzef!',
        phonetic: 'li-ou-ma jaw zwin bzef!',
        translation: 'Aujourd\'hui il fait très beau !'
      }
    };

    const response = mockPromptResponses[prompt];
    if (response) {
      sendMessage(response.text);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Bot size={24} color="#e11d48" />
            <Text style={styles.title}>Chat IA</Text>
          </View>
          
          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => setShowPhonetic(!showPhonetic)}
              style={[styles.controlButton, showPhonetic && styles.activeControlButton]}
            >
              <Text style={[
                styles.controlText,
                showPhonetic && styles.activeControlText
              ]}>
                Phonétique
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setShowTranslation(!showTranslation)}
              style={[styles.controlButton, showTranslation && styles.activeControlButton]}
            >
              <Text style={[
                styles.controlText,
                showTranslation && styles.activeControlText
              ]}>
                Traduction
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personas */}
        <View style={styles.personasContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.personasScroll}
          >
            {personas.map((persona) => (
              <TouchableOpacity
                key={persona.key}
                onPress={() => setSelectedPersona(persona.key)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.personaChip,
                  selectedPersona === persona.key && styles.selectedPersonaChip
                ]}>
                  <Text style={[
                    styles.personaTitle,
                    selectedPersona === persona.key && styles.selectedPersonaTitle
                  ]}>
                    {persona.title}
                  </Text>
                  <Text style={[
                    styles.personaDescription,
                    selectedPersona === persona.key && styles.selectedPersonaDescription
                  ]}>
                    {persona.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <Animated.View key={message.id} layout={Layout.springify()} style={[
              styles.messageContainer,
              message.isUser ? styles.userMessageContainer : styles.aiMessageContainer
            ]}>
              <Card style={[
                styles.messageCard,
                message.isUser ? styles.userMessageCard : styles.aiMessageCard
              ]}>
                <View style={styles.messageHeader}>
                  {message.isUser ? (
                    <User size={16} color="#ffffff" />
                  ) : (
                    <Bot size={16} color="#e11d48" />
                  )}
                  <Text style={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
                
                <Text style={[
                  styles.messageText,
                  message.isUser ? styles.userMessageText : styles.aiMessageText
                ]}>
                  {message.text}
                </Text>
                
                {!message.isUser && showPhonetic && message.phonetic && (
                  <Text style={styles.phoneticText}>
                    [{message.phonetic}]
                  </Text>
                )}
                
                {!message.isUser && showTranslation && message.translation && (
                  <Text style={styles.translationText}>
                    {message.translation}
                  </Text>
                )}
              </Card>
            </Animated.View>
          ))}
          
          {isTyping && (
            <View style={styles.aiMessageContainer}>
              <Card style={styles.aiMessageCard}>
                <View style={styles.typingContainer}>
                  <Bot size={16} color="#e11d48" />
                  <Text style={styles.typingText}>En train d'écrire...</Text>
                </View>
              </Card>
            </View>
          )}
        </ScrollView>

        {/* Quick Prompts */}
        <View style={styles.quickPromptsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickPromptsScroll}
          >
            {mockQuickPrompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => sendQuickPrompt(prompt)}
                activeOpacity={0.8}
              >
                <View style={styles.promptChip}>
                  <Text style={styles.promptText}>{prompt}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Écris en darija ou en français..."
              placeholderTextColor="#71717a"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
              style={[
                styles.sendButton,
                !inputText.trim() && styles.disabledSendButton
              ]}
            >
              <Send 
                size={20} 
                color={inputText.trim() ? '#ffffff' : '#71717a'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingBottom: 20,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 12,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  activeControlButton: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  controlText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#a1a1aa',
  },
  activeControlText: {
    color: '#ffffff',
  },
  personasContainer: {
    marginBottom: 16,
  },
  personasScroll: {
    paddingHorizontal: 24,
    gap: 12,
  },
  personaChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  selectedPersonaChip: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  personaTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  selectedPersonaTitle: {
    color: '#ffffff',
  },
  personaDescription: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    textAlign: 'center',
    marginTop: 2,
  },
  selectedPersonaDescription: {
    color: '#ffffff',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '80%',
    padding: 12,
  },
  userMessageCard: {
    backgroundColor: '#6366f1',
  },
  aiMessageCard: {
    backgroundColor: '#1a1a1a',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageTime: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginLeft: 6,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  aiMessageText: {
    color: '#ffffff',
  },
  phoneticText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#8b5cf6',
    marginTop: 4,
    fontStyle: 'italic',
  },
  translationText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginLeft: 6,
    fontStyle: 'italic',
  },
  quickPromptsContainer: {
    paddingVertical: 12,
  },
  quickPromptsScroll: {
    paddingHorizontal: 24,
    gap: 8,
  },
  promptChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  promptText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#a1a1aa',
  },
  inputContainer: {
    padding: 24,
    paddingTop: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledSendButton: {
    backgroundColor: '#3f3f46',
  },
});